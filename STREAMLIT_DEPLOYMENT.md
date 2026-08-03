# Streamlit Deployment & Caching Guide

This document outlines how to run and deploy the **Streamlit Monitoring Dashboard** (`src/dashboard.py`) both in self-hosted Docker environments and on Streamlit Community Cloud.

---

## 🚀 1. Local & Self-Hosted Docker Execution

### Option A: Via Docker Compose (Recommended)
```bash
# Spin up full stack (FastAPI + Postgres + n8n + Streamlit)
docker-compose -f docker/docker-compose.yml up --build -d
```
Access points:
- Streamlit UI: `http://localhost:8501` or `http://localhost:3000`
- FastAPI REST API: `http://localhost:8000`

### Option B: Standalone Python Virtual Environment
```bash
# Create and activate virtualenv
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run Streamlit with custom config
streamlit run src/dashboard.py --config_file .streamlit/config.toml
```

---

## ⚡ 2. Session State & Caching Strategy

The Streamlit dashboard uses `@st.cache_data` and `@st.cache_resource` to maintain high responsiveness without hammering backend databases or APIs:

1. **Model & API Client Caching (`@st.cache_resource`)**:
   - Keeps `SentimentAnalyzer` loaded in GPU/CPU memory across user reloads.
   - Prevents re-instantiating transformer tokenizers on every interaction.

2. **API Data Polling Caching (`@st.cache_data(ttl=10)`)**:
   - `fetch_current_stats()` caches real-time metrics for 10 seconds.
   - `fetch_history()` caches 24-hour time-series datasets for 30 seconds.

3. **Session State Initialization**:
   ```python
   if "is_spike_active" not in st.session_state:
       st.session_state.is_spike_active = False
   ```

---

## ☁️ 3. Streamlit Community Cloud Deployment

1. Push repository to Gitea/GitHub.
2. Link repository in Streamlit Cloud Dashboard (`share.streamlit.io`).
3. Set main file path to `src/dashboard.py`.
4. Copy variables from `.streamlit/secrets.toml` into Streamlit Cloud's Secret Manager.
