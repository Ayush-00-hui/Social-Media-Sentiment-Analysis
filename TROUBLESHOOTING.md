# Troubleshooting & Common Issues Guide

This guide covers resolution steps for common errors encountered during local execution or self-hosted deployment.

---

## 🛠️ Common Issue Diagnosis & Fixes

### 1. `FastAPI Connection Refused` or `Port 8000 Unavailable`
- **Symptom**: Streamlit or React dashboard displays `Failed to fetch stats: Connection Refused`.
- **Cause**: FastAPI backend container failed to bind or is initializing models.
- **Fix**:
  ```bash
  # Check backend container logs
  docker-compose -f docker/docker-compose.yml logs fastapi-sentiment-engine
  
  # Restart backend service
  docker-compose -f docker/docker-compose.yml restart fastapi-sentiment-engine
  ```

---

### 2. `PostgreSQL Database Connection Loss`
- **Symptom**: `psycopg2.OperationalError: could not connect to server`.
- **Cause**: DB container cold start delay.
- **Fix**:
  ```bash
  # Check Postgres health
  docker exec -it sentiment_postgres pg_isready -U ayush_admin
  ```

---

### 3. `n8n Webhook Workflow Silent / Not Firing`
- **Symptom**: Crisis spike triggered, but Slack notification doesn't arrive.
- **Fix**:
  1. Open n8n console at `http://localhost:5678`.
  2. Open imported workflow `Social Media Real-Time Crisis Monitoring`.
  3. Ensure active toggle at top-right is switched to **ACTIVE**.
  4. Verify incoming Slack Webhook URL in node settings.

---

### 4. `Streamlit Socket / Websocket Connection Failure`
- **Symptom**: Streamlit dashboard displays `Connecting...` indefinitely.
- **Fix**: Ensure `enableCORS = false` and `headless = true` are set in `.streamlit/config.toml`.
