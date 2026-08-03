# Traccia — Real-Time Social Media Sentiment & PR Crisis Intelligence Engine

> Production-grade NLP sentiment monitoring and statistical anomaly detection engine built with React, FastAPI, DistilBERT, PostgreSQL, and n8n.

---

## 🚀 Overview

**Traccia** is a real-time social media sentiment intelligence platform designed to protect brand reputation by identifying negative sentiment volume spikes and PR crisis anomalies *before* they escalate.

### Key Capabilities

1. **Fine-Grained DistilBERT NLP Inference**:
   - Executes local Hugging Face DistilBERT SST-2 sentiment pipelines (`Positive`, `Neutral`, `Negative`).
   - Sarcasm & irony detection heuristics.
   - Fine-grained token classification & dslim Named Entity Recognition (NER).
   - Optional Gemini 3.6 Flash fallback.

2. **Z-Score Anomaly Mathematics ($Z \ge 2.5\sigma$)**:
   - Statistically calculates negative comment volume surges against a rolling 24-hour baseline.
   - Automatic crisis classification (`CRITICAL`, `HIGH`, `MODERATE`).

3. **n8n Automated Workflow Escalation**:
   - Production multi-stage workflow spec (`n8n-workflows/social-media-monitoring.json`).
   - 30-second cron monitoring loop, Slack notification routing to `#eng-alerts`, and email executive digests.

4. **Self-Hosted Infrastructure Spec**:
   - Single command Docker Compose spec (`docker-compose.yml`) for running PostgreSQL 15, FastAPI, and n8n.
   - SQLite local fallback (`sqlite:///./traccia.db`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS v4, Recharts, Lucide Icons, Vite.
- **Backend API**: FastAPI (Python 3.11), Uvicorn ASGI server, SQLAlchemy.
- **NLP / ML**: Hugging Face Transformers, DistilBERT SST-2, dslim NER, Google Gemini.
- **Database**: PostgreSQL 15, SQLite.
- **Automation**: n8n Workflow Automation Engine.
- **Deployment**: Vercel (Frontend) + Self-Hosted / Ngrok (Backend).

---

## 💻 Quick Start (One-Click Local Setup)

### Option 1: One-Click Windows Batch Setup
To launch BOTH the FastAPI backend and Vite frontend together in parallel windows:
```cmd
start_all_local.bat
```

To launch ONLY the backend FastAPI server (`http://localhost:8000`):
```cmd
start_backend.bat
```

### Option 2: PowerShell Setup Script
```powershell
.\setup_backend.ps1
```

### Option 3: Manual Command Line Setup
1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/Ayush-00-hui/Social-Media-Sentiment-Analysis.git
   cd Social-Media-Sentiment-Analysis
   npm install
   ```

2. **Set up Python Virtual Environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Run FastAPI Backend**:
   ```bash
   uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload
   ```

5. **Run Vite Frontend**:
   ```bash
   npm run dev
   ```

---

## ⚙️ Environment Variables Spec (`.env`)

```env
# Database Connection (PostgreSQL or SQLite fallback)
DATABASE_URL=postgresql://ayush_admin:secret_pass@localhost:5432/traccia_db

# Twitter / X API v2 Bearer Token
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Google Gemini API Key (Optional)
GEMINI_API_KEY=your_gemini_api_key

# n8n Automation Engine URL
N8N_URL=http://localhost:5678

# FastAPI Host & Port
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8000

# Frontend Base API URL (Set for Vercel / Ngrok deployment)
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🤖 n8n Workflow Setup

1. Start n8n on `http://localhost:5678` via Docker:
   ```bash
   docker run -d --name traccia-n8n -p 5678:5678 n8nio/n8n:latest
   ```
2. Open `http://localhost:5678` in your browser.
3. Click **Workflows** $\rightarrow$ **Import from File**.
4. Select `n8n-workflows/social-media-monitoring.json`.
5. Toggle the switch to **Active**.

---

## 📄 License & Author

Developed by **Ayush** for social sentiment & real-time PR crisis analytics.
