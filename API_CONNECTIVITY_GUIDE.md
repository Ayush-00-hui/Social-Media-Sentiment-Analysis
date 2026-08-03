# FastAPI Endpoint Specification & Connectivity Guide

This document details all REST endpoints served by the backend and consumed by both Streamlit and React frontend visualizers.

---

## 📡 REST API Specifications

### 1. `GET /api/current_sentiment`
- **Description**: Returns live brand health index, Z-score metric, stream throughput, and sentiment percentages.
- **Response Schema**:
  ```json
  {
    "stats": {
      "totalAnalyzed": 14825,
      "currentScore": 78,
      "avgConfidence": 93.4,
      "tweetsPerMin": 85,
      "activeCrisisLevel": "LOW",
      "zScore": 0.45,
      "isStreaming": true
    },
    "sentimentBreakdown": {
      "positivePct": 78,
      "neutralPct": 12,
      "negativePct": 10
    }
  }
  ```

---

### 2. `POST /api/manual_analyze`
- **Description**: Evaluates custom input text for sentiment, confidence, sarcasm flags, and emotion breakdown.
- **Request Body**: `{"text": "Oh great, another bug... /s"}`
- **Response Schema**:
  ```json
  {
    "sentiment": "NEGATIVE",
    "confidence": 98.2,
    "sarcasm_detected": true,
    "crisis_score": 88.0,
    "emotions": {
      "frustration": 94.0,
      "happiness": 1.0,
      "sarcasm_prob": 98.0
    }
  }
  ```

---

### 3. `POST /api/simulate_spike`
- **Description**: Triggers or resolves simulated negative tweet volume spikes for testing crisis workflows.
- **Request Body**: `{"action": "TRIGGER", "topic": "Cloud Outage & Data Sync Bug"}`
- **Response**: `{"status": "SPIKE_ACTIVE", "message": "Simulated crisis spike initiated."}`

---

### 4. `GET /api/tweets`
- **Description**: Retrieves recent stream comments with sentiment, entity, and sarcasm tags.

---

### 5. `GET /health`
- **Description**: System health check for container liveness probes.
- **Response**: `{"status": "HEALTHY", "database": "CONNECTED", "nlp_engine": "READY"}`
