# Antigravity Step-by-Step Deployment Checklist

Use this checklist to ensure all prerequisites, environment configs, container builds, and database initializations are complete before marking deployment finished.

---

## 📋 Pre-Deployment Phase
- [ ] Verify Docker and Docker Compose are installed on Home PC server.
- [ ] Verify `git` and `cloudflared` are running.
- [ ] Clone repository into `~/projects/social-media-sentiment`.
- [ ] Copy `.env.example` to `.env` and configure `GEMINI_API_KEY`, `POSTGRES_PASSWORD`, and `N8N_PASSWORD`.

---

## 🚀 Execution Phase
- [ ] Run `./deploy.sh` script to build containers and run unit tests.
- [ ] Verify all 3 containers (`fastapi-sentiment-engine`, `sentiment_postgres`, `n8n`) report state `Up`.
- [ ] Verify PostgreSQL automatically creates tables: `tweets`, `sentiment_scores`, `crisis_alerts`, `hourly_aggregates`.

---

## 🔍 Post-Deployment Verification
- [ ] Execute API health check: `curl http://localhost:3000/api/current_sentiment`.
- [ ] Open web dashboard at `http://localhost:3000` or `http://localhost:8501`.
- [ ] Import n8n workflow spec from `n8n-workflows/social-media-monitoring.json`.
- [ ] Trigger a crisis spike via dashboard and confirm alert appears in red and triggers Slack webhook.
