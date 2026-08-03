# US Tech Company Interview Pitch & Q&A Battle-Prep Guide

This document contains Ayush's 90-second elevator pitch and deep-dive answers to technical interview questions for US tech companies.

---

## 🎙️ 1. The 90-Second Elevator Pitch

> *"I designed and built **SentimentPulse AI**, an end-to-end real-time social media sentiment monitoring and automated PR crisis detection system. 
> 
> Brands lose millions during viral social media outages or customer backlash when response times lag. My system continuously ingests comment streams, runs fine-grained sentiment and emotion inference using DistilBERT and Gemini 3.6 Flash, and detects statistical anomalies in negative comment volume using a rolling Z-score algorithm ($Z = \frac{x - \mu}{\sigma}$).
> 
> When negative comment spikes cross 2.5 standard deviations above the 24-hour baseline, the system automatically triggers alerts, logs time-series data into a self-hosted PostgreSQL database, dispatches Slack notifications via n8n automation workflows, and drafts AI executive response statements. 
> 
> The entire stack is containerized with Docker Compose and deployed on self-hosted hardware behind Cloudflare Tunnels for zero-cloud dependency and sub-200ms detection latency."*

---

## 🙋 2. Deep Dive Interview Technical Questions & Answers

### Q1: "How do you handle sarcasm in real-time text?"
**Answer**:
"Sarcasm is notorious in NLP because surface vocabulary appears positive ('Great job team!') while intent is negative. We address this using a hybrid multi-signal approach:
1. **Lexical Heuristics**: Our NLP engine checks for contrastive keyphrases (positive praise paired with failure terms like *'broke'*, *'down'*, *'outage'*, or explicit `'/s'` markers).
2. **Contextual Transformer Attention**: We pass ambiguous tweets to Gemini 3.6 Flash's zero-shot transformer, which evaluates global sentence semantics rather than isolated bag-of-words.
3. **Engagement Ratios**: High retweet-to-like ratios on negative sentiment text correlate heavily with sarcastic viral backlash."

---

### Q2: "What is the end-to-end latency from tweet ingestion to alert dispatch?"
**Answer**:
"Sub-200ms total latency:
- DistilBERT batch inference: ~85ms
- PostgreSQL log insertion: ~12ms
- Z-score anomaly check: ~2ms
- n8n Slack webhook dispatch: ~50ms
Total latency is ~150-180ms, well within the threshold needed for instant PR incident mitigation."

---

### Q3: "Why use Z-score anomaly detection instead of static count thresholds?"
**Answer**:
"Static count thresholds (e.g. 'alert if negative tweets > 50/hour') fail because social media traffic naturally fluctuates between peak daytime hours and low nighttime hours. 

Z-score calculates how many standard deviations ($Z = \frac{x - \mu}{\sigma}$) the current volume is above the rolling 24-hour baseline. This adapts dynamically to organic traffic curves, ensuring zero false alarms during peak traffic while catching genuine statistical anomalies instantly."

---

### Q4: "Why Streamlit + FastAPI vs a monolithic app?"
**Answer**:
"Decoupling the architecture into a **FastAPI backend** and **Streamlit / React frontend** enforces clean separation of concerns:
- **FastAPI**: Serves model inference and database operations asynchronously with high concurrency.
- **Streamlit**: Provides rapid, reactive Python dashboards for monitoring without polluting model logic.
- **n8n**: Consumes FastAPI REST endpoints directly without touching UI code."

---

### Q5: "How would you scale this system from 1,000 to 100,000 tweets per hour?"
**Answer**:
"To scale 100x:
1. **Message Queue Ingestion**: Place an Apache Kafka or Redis Stream buffer between Twitter scrapers and inference workers to absorb burst spikes.
2. **GPU Batch Inference**: Batch incoming tweets into groups of 128/256 for PyTorch CUDA vectorization on DistilBERT.
3. **Database Sharding**: Partition PostgreSQL `tweets` and `sentiment_scores` tables by timestamp using timescaledb hyper-tables."
