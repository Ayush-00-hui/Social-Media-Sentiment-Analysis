"""
Background Workers for SentimentPulse AI
Handles 30s Tweet Ingestion, Sentiment Pipeline Processing, Z-Score Crisis Monitoring, Hourly Aggregations, and Maintenance Cleanup.
"""
import asyncio
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from src.db.models import SessionLocal, TweetModel, SentimentScoreModel, CrisisAlertModel, HourlyAggregateModel
from src.sentiment_analyzer import SentimentAnalyzer
from src.crisis_detector import CrisisDetector
from src.news_scraper import NewsScraper
from src.logging_config import get_logger

logger = get_logger("BackgroundTasks")

analyzer = SentimentAnalyzer()
crisis_detector = CrisisDetector(z_threshold=2.5)
scraper = NewsScraper()

_running = False

def ingest_and_process_tweets(db: Session, keywords: List[str] = None) -> int:
    """Streams tweets, analyzes sentiment, and persists to database."""
    if keywords is None:
        keywords = ["@TechBrand", "#TechBrand", "@CompetitorA"]

    raw_tweets = scraper.stream_keywords(keywords, max_tweets=5)
    processed_count = 0

    for item in raw_tweets:
        t_id = item["id"]
        # Skip if tweet already exists in DB
        existing = db.query(TweetModel).filter(TweetModel.id == t_id).first()
        if existing:
            continue

        # Run Sentiment & Entity Analysis
        analysis = analyzer.analyze_text(item["text"])

        # Persist Tweet Model
        tweet_record = TweetModel(
            id=t_id,
            text=item["text"],
            author=item["author"],
            handle=item["handle"],
            timestamp=datetime.now(timezone.utc),
            likes=item["likes"],
            retweets=item["retweets"],
            topic=keywords[0] if keywords else "GENERAL"
        )
        db.add(tweet_record)

        # Persist Sentiment Score Model
        sentiment_record = SentimentScoreModel(
            tweet_id=t_id,
            sentiment=analysis["sentiment"],
            confidence=float(analysis["confidence"]),
            frustration_score=float(analysis["emotions"]["frustration"]),
            happiness_score=float(analysis["emotions"]["happiness"]),
            sarcasm_detected=bool(analysis["sarcasm_detected"]),
            crisis_score=float(analysis["crisis_score"])
        )
        db.add(sentiment_record)
        processed_count += 1

    db.commit()
    logger.info(f"Ingested & processed {processed_count} new news articles into DB.")
    return processed_count

def run_crisis_detection_job(db: Session) -> Dict[str, Any]:
    """Calculates rolling negative sentiment Z-Score and creates alert if Z >= 2.5."""
    now = datetime.now(timezone.utc)
    twenty_four_hours_ago = now - timedelta(hours=24)

    # Collect hourly negative tweet volumes for the last 24h
    hourly_volumes = []
    for h in range(24, 0, -1):
        h_start = now - timedelta(hours=h)
        h_end = h_start + timedelta(hours=1)
        count = db.query(SentimentScoreModel).join(TweetModel).filter(
            TweetModel.timestamp >= h_start,
            TweetModel.timestamp < h_end,
            SentimentScoreModel.sentiment == "NEGATIVE"
        ).count()
        hourly_volumes.append(count)

    # Current hour negative volume
    current_neg_volume = db.query(SentimentScoreModel).join(TweetModel).filter(
        TweetModel.timestamp >= now - timedelta(hours=1),
        SentimentScoreModel.sentiment == "NEGATIVE"
    ).count()

    eval_res = crisis_detector.evaluate_time_series(hourly_volumes, current_neg_volume)

    if eval_res["is_crisis"]:
        alert_id = f"alert-{int(now.timestamp())}"
        existing_alert = db.query(CrisisAlertModel).filter(CrisisAlertModel.id == alert_id).first()
        if not existing_alert:
            new_alert = CrisisAlertModel(
                id=alert_id,
                timestamp=now,
                severity=eval_res["severity"],
                title=f"Spike in Negative Sentiment Detected (Z-Score: {eval_res['z_score']})",
                root_cause="Negative tweet surge exceeding rolling 24h baseline",
                z_score=eval_res["z_score"],
                negative_spike_pct=float(eval_res["current_volume"]),
                status="ACTIVE"
            )
            db.add(new_alert)
            db.commit()
            logger.warning(f"CRISIS ALERT CREATED: {alert_id} | Z-Score: {eval_res['z_score']}")

    return eval_res

def run_hourly_aggregation_job(db: Session) -> None:
    """Computes hourly aggregate sentiment metrics and saves to database."""
    now = datetime.now(timezone.utc)
    hour_floor = now.replace(minute=0, second=0, microsecond=0)

    existing_agg = db.query(HourlyAggregateModel).filter(HourlyAggregateModel.hour_timestamp == hour_floor).first()

    total = db.query(TweetModel).filter(TweetModel.timestamp >= hour_floor).count()
    if total == 0:
        return

    pos = db.query(SentimentScoreModel).join(TweetModel).filter(
        TweetModel.timestamp >= hour_floor, SentimentScoreModel.sentiment == "POSITIVE"
    ).count()
    neg = db.query(SentimentScoreModel).join(TweetModel).filter(
        TweetModel.timestamp >= hour_floor, SentimentScoreModel.sentiment == "NEGATIVE"
    ).count()
    neu = db.query(SentimentScoreModel).join(TweetModel).filter(
        TweetModel.timestamp >= hour_floor, SentimentScoreModel.sentiment == "NEUTRAL"
    ).count()

    pos_pct = round((pos / total) * 100.0, 2)
    neg_pct = round((neg / total) * 100.0, 2)
    neu_pct = round((neu / total) * 100.0, 2)

    if existing_agg:
        existing_agg.positive_pct = pos_pct
        existing_agg.negative_pct = neg_pct
        existing_agg.neutral_pct = neu_pct
        existing_agg.tweet_volume = total
    else:
        new_agg = HourlyAggregateModel(
            hour_timestamp=hour_floor,
            positive_pct=pos_pct,
            neutral_pct=neu_pct,
            negative_pct=neg_pct,
            tweet_volume=total,
            z_score=0.0,
            crisis_flag=False
        )
        db.add(new_agg)
    db.commit()

def run_cleanup_job(db: Session, retention_days: int = 7) -> int:
    """Purges raw tweets older than retention_days."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=retention_days)
    old_tweets = db.query(TweetModel).filter(TweetModel.timestamp < cutoff).all()
    count = len(old_tweets)
    for t in old_tweets:
        db.delete(t)
    db.commit()
    logger.info(f"Purged {count} old tweets beyond {retention_days} days retention.")
    return count

async def background_loop():
    """Async background worker executing periodic pipeline jobs every 30s."""
    global _running
    logger.info("Starting SentimentPulse AI background worker task...")
    while _running:
        try:
            db = SessionLocal()
            try:
                ingest_and_process_tweets(db)
                run_crisis_detection_job(db)
                run_hourly_aggregation_job(db)
            finally:
                db.close()
        except Exception as e:
            logger.error(f"Error in background task loop: {e}")

        await asyncio.sleep(30)

def start_background_scheduler():
    global _running
    if not _running:
        _running = True
        asyncio.create_task(background_loop())

def stop_background_scheduler():
    global _running
    _running = False
