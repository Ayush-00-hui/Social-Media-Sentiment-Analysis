# Traccia: Architecture & Deployment Guide

Traccia is a multi-tenant Social Media & News Sentiment Analysis pipeline. It continuously monitors brand sentiment, detects PR crises via Z-score statistical anomalies, and notifies stakeholders via Slack and email.

## 🏗️ Architecture Explained

The project is split into three decoupled layers:

### 1. Orchestration & Scraping (n8n)
- **Role:** Handles data fetching, workflow timing, and notification routing.
- **Workflow (`n8n-workflows/traccia-news-workflow.json`):**
  - **Ingestion:** Runs on a 30-second loop. Reads Google News RSS feeds natively inside n8n, maps the data, and pushes it to the backend `POST /api/ingest_news` webhook.
  - **Crisis Polling:** Polls the backend `GET /api/current_sentiment`. If the Z-score for negative sentiment crosses the threshold (e.g., 2.5), it routes alerts to Slack and Email based on severity (Medium/High/Critical).
  - **Digest:** Runs a daily cron at 9 AM to fetch the last 24 hours of data and sends a summary digest.
  - **Onboarding:** Receives client registration webhooks and sends automated magic setup links.

### 2. Machine Learning & Database API (Python / FastAPI)
- **Role:** The brain of the operation. Receives raw text, runs NLP, and persists data.
- **NLP Engine:** Uses Hugging Face `transformers` (DistilBERT SST-2 English) to classify sentiment (Positive, Negative, Neutral), extract emotion heuristics (Frustration, Happiness, Sarcasm), and generate a crisis weight score.
- **Database:** Uses SQLAlchemy to persist data. Tables include `TweetModel` (News Articles), `SentimentScoreModel`, `CrisisAlertModel`, and `UserModel`.
- **Background Tasks:** Runs lightweight AsyncIO tasks every hour to roll up data into historical aggregations (`HourlyAggregateModel`) for performance.

### 3. Client Dashboard (React / Vite)
- **Role:** Multi-tenant frontend where clients can view their live brand sentiment.
- **Auth:** Secured via JWT cookies/tokens.
- **Features:** Live data streaming, crisis alerts overlay, keyword management settings, and competitor comparisons.

---

## 🚀 Deployment Guide (Backend/VPS)

To deploy this securely on a Linux server (Ubuntu/Debian), follow these steps:

### Prerequisites
1. A Linux VPS (e.g., DigitalOcean, AWS EC2, or Hetzner).
2. Python 3.10+
3. Node.js 18+ (if hosting frontend on the same machine)
4. A static domain or persistent `ngrok` tunnel for n8n webhooks.

### Step 1: Clone & Setup Backend
```bash
# Clone repo
git clone https://github.com/YourUsername/Social-Media-Sentiment-Analysis.git traccia
cd traccia

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### Step 2: Environment Variables
Create a `.env` file in the root directory:
```ini
JWT_SECRET=your_super_secret_production_key
CRISIS_EMAIL_LIST=client@company.com
NGROK_AUTHTOKEN=your_ngrok_token  # If tunneling
PORT=8000
```

### Step 3: Run FastAPI with Uvicorn / Gunicorn
For production, you should use `gunicorn` with `uvicorn` workers behind an Nginx reverse proxy.
```bash
# Install gunicorn
pip install gunicorn

# Run daemonized
gunicorn src.app:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 --daemon
```

### Step 4: Import n8n Workflow
1. Start your n8n instance (via Docker or npx).
2. Go to the n8n dashboard -> Workflows -> Import from File.
3. Select `n8n-workflows/traccia-news-workflow.json`.
4. **CRITICAL:** Update the HTTP Request node URLs in the n8n workflow to point to your new production domain (e.g., replace `diffuser-thousand-rule.ngrok-free.dev` with `api.yourdomain.com`).
5. Activate the workflow.

### Step 5: Frontend Deployment (Vercel)
The Vite frontend is pre-configured for Vercel deployment via the `vercel.json` and `vite.config.ts` files.
1. Connect your GitHub repository to Vercel.
2. Override the Build Command if necessary: `npm run build`
3. The app will automatically build and deploy.

---
*Ready for production traffic!*
