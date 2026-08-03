# SentimentPulse AI - Operations Runbook

## System Architecture Overview
SentimentPulse AI is a real-time social media sentiment monitoring and crisis anomaly detection engine.
- **FastAPI Service (`src/app.py`):** REST API handling sentiment analysis endpoints and crisis stats.
- **Streamlit Dashboard (`src/dashboard.py`):** Real-time web UI showing metrics, time-series charts, and tweet feeds.
- **Crisis Detector (`src/crisis_detector.py`):** Z-Score time-series anomaly calculation ($Z \ge 2.5$).
- **Sentiment Analyzer (`src/sentiment_analyzer.py`):** Dual-engine NLP for sentiment, sarcasm, and emotions.

---

## Daily Operational Checklist
- [ ] Verify FastAPI health status: `curl http://localhost:8000/`
- [ ] Confirm Streamlit UI rendering on `http://localhost:8501`
- [ ] Run test suite: `python -m pytest tests/`
- [ ] Run latency check: `python test_latency.py`

---

## Starting the System

### Option A: Local Python Execution
```bash
# 1. Activate Environment & Setup .env
cp .env.example .env

# 2. Launch FastAPI Backend
uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload

# 3. Launch Streamlit UI (in second terminal)
streamlit run src/dashboard.py
```

### Option B: Docker Compose Execution
```bash
# Build and start containers
docker-compose build
docker-compose up -d

# Verify container status
docker-compose ps
```

---

## Stopping the System
```bash
# Stop Docker containers
docker-compose down

# Or stop local uvicorn / streamlit processes (Ctrl+C)
```

---

## Troubleshooting & Diagnostics

### Issue 1: `ModuleNotFoundError` on standard packages
**Resolution:**
```bash
python -m pip install -r requirements.txt pytest pytest-cov
```

### Issue 2: Console Unicode Error on Windows (`charmap` codec)
**Resolution:**
All benchmark scripts (`test_latency.py`, `simulate_crisis.py`) have been formatted with Windows console compatible ASCII status tags (`[OK]`).

### Issue 3: High Latency or CPU Usage
**Resolution:**
Check system resource utilization:
```bash
# Check running Python processes
tasklist | findstr python
```

---

## Emergency Rollback Procedures
Refer to `ROLLBACK_PROCEDURES.md` or execute:
```bash
git checkout main
docker-compose restart
```
