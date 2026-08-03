# Environment Setup & Secrets Management

This document provides complete instructions for configuring environment variables, API keys, database connection strings, and Docker injection templates.

---

## 🔑 1. `.env.example` Master Template

```env
# Server & Environment Settings
NODE_ENV=production
PORT=3000
FASTAPI_PORT=8000

# AI Model Credentials
GEMINI_API_KEY=your_gemini_3_6_flash_api_key_here

# Self-Hosted PostgreSQL Configuration
POSTGRES_DB=sentiment_db
POSTGRES_USER=ayush_admin
POSTGRES_PASSWORD=your_secure_db_password_here
DATABASE_URL=postgresql://ayush_admin:your_secure_db_password_here@postgres-db:5432/sentiment_db

# Self-Hosted n8n Workflow Automation
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_n8n_password_here

# Twitter / X API Credentials (Optional - Mock Stream Available)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Cloudflare Tunnel Hostnames
PUBLIC_APP_DOMAIN=sentiment.ayush.dev
PUBLIC_N8N_DOMAIN=n8n.ayush.dev
```

---

## 🔒 2. Secrets Management Guidelines

1. **Never commit actual `.env` or `.streamlit/secrets.toml` files** to Git.
2. In production, Docker Compose loads variables directly via `${VARIABLE_NAME}` substitution.
3. For cloud-hosted environments (Streamlit Cloud, Railway, Cloud Run), add credentials into platform environment settings.
