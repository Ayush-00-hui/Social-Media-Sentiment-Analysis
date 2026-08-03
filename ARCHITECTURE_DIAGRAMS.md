# System Architecture Diagrams & Data Flow Models

This document presents ASCII visual diagrams of the system topology, data flow, and mathematical anomaly detection formulas.

---

## 1. High-Level Data Flow Topology

```
+------------------+         +--------------------------+         +------------------------+
| Twitter / X API  | ------> | FastAPI Ingestion Engine | ------> | DistilBERT NLP Infer   |
| (Stream Filter)  |         | (src/app.py)             |         | (src/sentiment__...py) |
+------------------+         +--------------------------+         +------------------------+
                                          |                                    |
                                          v                                    v
                             +--------------------------+         +------------------------+
                             | PostgreSQL Database      | <------ | Z-Score Anomaly Engine |
                             | (database/schema.sql)    |         | (src/crisis_detec...py)|
                             +--------------------------+         +------------------------+
                                          |                                    |
                                          v                                    v
                             +--------------------------+         +------------------------+
                             | Streamlit Dashboard UI   |         | n8n Automation Engine  |
                             | (src/dashboard.py)       |         | (Slack Alert Webhook)  |
                             +--------------------------+         +------------------------+
```

---

## 2. Z-Score Anomaly Detection Mathematical Formula

$$\text{Baseline Mean: } \mu = \frac{1}{N} \sum_{i=1}^{N} x_i \quad (N = 24 \text{ hours})$$

$$\text{Standard Deviation: } \sigma = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (x_i - \mu)^2}$$

$$\text{Z-Score Metric: } Z = \frac{x_{\text{current}} - \mu}{\sigma}$$

$$\text{Crisis Decision Rule: } \text{Trigger Alert IF } Z \ge 2.5\sigma$$
