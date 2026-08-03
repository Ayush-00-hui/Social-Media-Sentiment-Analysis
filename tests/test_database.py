"""
Unit Tests for SQLAlchemy Database ORM Models & CRUD Operations
"""
from datetime import datetime, timezone
from src.db.models import TweetModel, SentimentScoreModel, CrisisAlertModel, HourlyAggregateModel

def test_create_tweet_and_sentiment_score(db_session):
    tweet = TweetModel(
        id="test-tweet-001",
        text="Loving the new @TechBrand release! Latency is low.",
        author="test_user",
        handle="@test_user",
        timestamp=datetime.now(timezone.utc),
        likes=10,
        retweets=2,
        topic="@TechBrand"
    )
    db_session.add(tweet)
    db_session.commit()

    sentiment = SentimentScoreModel(
        tweet_id="test-tweet-001",
        sentiment="POSITIVE",
        confidence=95.5,
        frustration_score=5.0,
        happiness_score=92.0,
        sarcasm_detected=False,
        crisis_score=10.0
    )
    db_session.add(sentiment)
    db_session.commit()

    fetched_tweet = db_session.query(TweetModel).filter(TweetModel.id == "test-tweet-001").first()
    assert fetched_tweet is not None
    assert fetched_tweet.author == "test_user"
    assert fetched_tweet.sentiment_score is not None
    assert fetched_tweet.sentiment_score.sentiment == "POSITIVE"

def test_create_crisis_alert(db_session):
    alert = CrisisAlertModel(
        id="alert-test-100",
        timestamp=datetime.now(timezone.utc),
        severity="CRITICAL",
        title="Spike in Negative Sentiment Detected",
        root_cause="API failure reports surge",
        z_score=4.25,
        negative_spike_pct=85.0,
        status="ACTIVE"
    )
    db_session.add(alert)
    db_session.commit()

    fetched_alert = db_session.query(CrisisAlertModel).filter(CrisisAlertModel.id == "alert-test-100").first()
    assert fetched_alert is not None
    assert fetched_alert.severity == "CRITICAL"
    assert fetched_alert.z_score == 4.25

def test_create_hourly_aggregate(db_session):
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    agg = HourlyAggregateModel(
        hour_timestamp=now,
        positive_pct=75.0,
        neutral_pct=15.0,
        negative_pct=10.0,
        tweet_volume=150,
        z_score=0.2,
        crisis_flag=False
    )
    db_session.add(agg)
    db_session.commit()

    fetched_agg = db_session.query(HourlyAggregateModel).filter(HourlyAggregateModel.hour_timestamp == now).first()
    assert fetched_agg is not None
    assert fetched_agg.tweet_volume == 150
    assert fetched_agg.positive_pct == 75.0
