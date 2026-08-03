# SentimentPulse AI: Social Media Sentiment & Crisis Monitoring Engine

Production-grade real-time social media NLP pipeline with DistilBERT inference, Z-Score anomaly crisis detection, self-hosted Docker Compose orchestration, PostgreSQL time-series logging, and automated n8n Slack/Email workflows.

---

## 🏗️ System Architecture & Endpoints

### Core Service Components
- **FastAPI Backend Service (`src/app.py`):** Exposes REST API endpoints, rate limiting, and lifespan background workers.
- **DistilBERT NLP Engine (`src/sentiment_analyzer.py`):** Hugging Face DistilBERT (`distilbert-base-uncased-finetuned-sst-2-english`) and NER (`dslim/distilbert-ner`) pipelines with model caching and fallback heuristics.
- **Twitter Streaming Collector (`src/twitter_scraper.py`):** Tweepy v2 streaming API collector with keyword filtering, deduplication (`seen_ids`), and exponential backoff retry.
- **Z-Score Anomaly Detector (`src/crisis_detector.py`):** Time-series anomaly calculation ($Z = \frac{x - \mu}{\sigma}$) triggering alerts when negative volume surge exceeds $2.5\sigma$.
- **Background Worker Tasks (`src/background_tasks.py`):** Periodic 30s ingestion, sentiment analysis, Z-score evaluation, hourly aggregate calculations, and data retention cleanup.
- **Streamlit & React Dashboard (`src/dashboard.py`):** Real-time monitoring UI connected to FastAPI backend with 10s auto-refresh.
- **Master n8n Workflow (`n8n-workflows/social-media-monitoring.json`):** 30s polling anomaly monitoring, Slack/Email alert dispatching, and user registration onboarding pipeline.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Healthcheck probe returning API, DB, and service status |
| `GET` | `/api/current_sentiment` | Real-time stats, Brand Health Index, sentiment breakdown, and top topics |
| `GET` | `/api/sentiment_history` | 24-hour time-series aggregates array (`hours` query param) |
| `GET` | `/api/crisis_alerts` | Active and historical Z-Score anomaly alerts array |
| `GET` | `/api/competitor_comparison` | Sentiment breakdown across target brand and competitors |
| `GET` | `/api/tweets` | Filtered list of raw tweets (`filter`, `search`, `limit` params) |
| `POST` | `/api/manual_analyze` | Text sentiment inference with DistilBERT (Rate Limited: 30 req/min) |
| `POST` | `/api/webhook/n8n` | Webhook endpoint for ingested posts from n8n workflows |
| `POST` | `/api/register_user` | User onboarding registration endpoint for n8n Section 2 |
| `POST` | `/api/simulate_spike` | Demo control toggling anomaly spike state |
| `POST` | `/api/toggle_stream` | Demo control toggling background ingestion stream state |

---

## 🗄️ Database Schema (`database/schema.sql`)

```sql
-- PostgreSQL DDL Tables
tweets (id, text, author, handle, timestamp, likes, retweets, topic)
sentiment_scores (id, tweet_id, sentiment, confidence, frustration_score, happiness_score, sarcasm_detected, crisis_score)
crisis_alerts (id, timestamp, severity, title, root_cause, z_score, negative_spike_pct, status)
hourly_aggregates (id, hour_timestamp, positive_pct, neutral_pct, negative_pct, tweet_volume, z_score, crisis_flag)
users (email, name, registered_at)
```

---

## 🏃 Quick Start (Docker Compose)

The project uses a single primary `docker-compose.yml` file located at the repository root.

```bash
# 1. Clone repository
git clone https://github.com/ayush/social-media-sentiment.git
cd Social-Media-Sentiment-Analysis

# 2. Configure Environment Variables
cp .env.example .env

# 3. Launch Docker Compose Stack
docker-compose up --build -d
```

### Access Services:
- **FastAPI OpenAPI Specs**: http://localhost:8000/docs
- **n8n Automation Console**: http://localhost:5678
- **PostgreSQL Database**: `localhost:5432` (`sentiment_db`)

---

## ⚡ Input Validation & Security Measures

- **Rate Limiting**: In-memory IP rate limiter applied to `POST /api/manual_analyze`, `POST /api/webhook/n8n`, and `POST /api/register_user` enforcing a maximum of 30 requests/minute per IP (returns HTTP 429 Too Many Requests on breach).
- **Input Sanitization**: HTML escaping and string truncation (max 5000 chars) preventing XSS and injection attacks.
- **Environment Isolation**: `.env*` files strictly excluded via `.gitignore`. Sensitive n8n credentials managed via n8n Credential Store using `CRISIS_EMAIL_LIST` env configuration.

---

## ⚠️ Known Limitations & Design Trade-offs

1. **Sarcasm Detection Accuracy (~70% Accuracy)**: Sarcasm detection combines contrastive phrase heuristics (e.g. `/s` tags, positive keywords paired with failure terms) with DistilBERT token probability scoring. While effective for common patterns, complex contextual sarcasm may require full LLM fine-tuning.
2. **Rate Limits on Twitter/X API**: Tweepy v2 collector defaults to exponential backoff and mock stream fallback when live Bearer tokens are rate-limited or unconfigured.
3. **Model Weights Downloading**: When running offline or without internet access to Hugging Face Hub, the analyzer automatically falls back to an internal heuristic sentiment engine.
