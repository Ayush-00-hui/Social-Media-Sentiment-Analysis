# Production Monitoring & Post-Deployment Health Checks

This guide outlines how to monitor system health, container CPU/RAM utilization, and API throughput post-deployment.

---

## 📊 1. Live Container Metrics
```bash
# Monitor container resource usage (RAM/CPU/Network IO)
docker stats
```
Expected Baselines:
- `fastapi-sentiment-engine`: ~250MB RAM, <5% CPU idle
- `sentiment_postgres`: ~45MB RAM, <1% CPU idle
- `n8n-automation`: ~120MB RAM, <2% CPU idle

---

## 🩺 2. API Endpoint Health Heartbeat
```bash
# Poll API health endpoint every 10 seconds
watch -n 10 "curl -s http://localhost:3000/api/current_sentiment | jq ."
```

---

## 📁 3. Log Aggregation & Inspection
```bash
# Tail last 100 lines across all containers
docker-compose -f docker/docker-compose.yml logs -f --tail=100
```
