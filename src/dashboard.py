"""
Streamlit Real-Time Sentiment & Crisis Dashboard
Connects directly to FastAPI backend service (http://localhost:8001) with auto-refresh and graceful offline fallbacks.
"""
import time
import requests
import streamlit as st
import pandas as pd

API_BASE_URL = "http://localhost:8001"

st.set_page_config(
    page_title="SentimentPulse AI - Real-Time Crisis Dashboard",
    page_icon="📈",
    layout="wide"
)

# Custom Styling & Header
st.title("📈 SentimentPulse AI: Social Media Sentiment & Crisis Dashboard")
st.caption("Real-Time DistilBERT Dual NLP Engine & Z-Score Anomaly Spike Detection")
st.markdown("---")

def fetch_api_data(endpoint: str, default_fallback: dict) -> dict:
    """Helper function to perform REST calls to FastAPI backend with graceful fallback."""
    url = f"{API_BASE_URL}{endpoint}"
    try:
        res = requests.get(url, timeout=3)
        if res.status_code == 200:
            return res.json()
    except Exception:
        pass
    return default_fallback

# Top Metrics Row
current_data = fetch_api_data(
    "/api/current_sentiment",
    {
        "stats": {
            "totalAnalyzed": 14825,
            "currentScore": 78,
            "positivePct": 65.0,
            "negativePct": 20.0,
            "neutralPct": 15.0,
            "tweetsPerMin": 85,
            "activeCrisisLevel": "LOW",
            "zScore": 0.45,
            "isStreaming": False
        }
    }
)
stats = current_data.get("stats", {})

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric(label="Brand Health Index", value=f"{stats.get('currentScore', 78)} / 100", delta="+2.4%")
with col2:
    st.metric(label="Z-Score Anomaly", value=f"{stats.get('zScore', 0.45)}σ", delta="NORMAL" if stats.get('zScore', 0) < 2.5 else "CRITICAL")
with col3:
    st.metric(label="Stream Ingestion Rate", value=f"{stats.get('tweetsPerMin', 85)} tweets/min")
with col4:
    crisis_lvl = stats.get("activeCrisisLevel", "LOW")
    st.metric(label="Crisis Status", value=f"{crisis_lvl} RISK", delta_color="inverse" if crisis_lvl in ["HIGH", "CRITICAL"] else "normal")

st.markdown("---")

# Main Content Layout
tab1, tab2, tab3 = st.tabs(["📊 24h Sentiment Trends", "🚨 Crisis Alerts", "🔍 Manual Analyzer"])

with tab1:
    st.subheader("24-Hour Sentiment & Volume Time-Series")
    history_res = fetch_api_data("/api/sentiment_history?hours=24", {"history": []})
    history_list = history_res.get("history", [])

    if history_list:
        df = pd.DataFrame(history_list)
        if "timestamp" in df.columns:
            df["timestamp"] = pd.to_datetime(df["timestamp"])
            df = df.set_index("timestamp")
            st.area_chart(df[["positivePct", "neutralPct", "negativePct"]])
    else:
        st.info("No timeline data recorded yet. Displaying default baseline.")
        chart_data = pd.DataFrame(
            [[70, 15, 15], [68, 17, 15], [72, 14, 14], [65, 20, 15]],
            columns=["positivePct", "neutralPct", "negativePct"]
        )
        st.area_chart(chart_data)

with tab2:
    st.subheader("Active Crisis Anomaly Spikes (Z-Score >= 2.5)")
    alerts_res = fetch_api_data("/api/crisis_alerts", {"alerts": []})
    alerts = alerts_res.get("alerts", [])

    if alerts:
        for a in alerts:
            st.warning(f"⚠️ **{a.get('severity')} ALERT**: {a.get('title')} (Z-Score: {a.get('zScore')}) at {a.get('timestamp')}")
    else:
        st.success("🟢 No active crisis anomaly alerts. System operating within normal rolling 24h baseline.")

with tab3:
    st.subheader("Test DistilBERT Sentiment Inference Engine")
    input_text = st.text_area("Enter social media post text to analyze:", "Oh great, another update that completely broke API auth... /s")
    if st.button("Run Inference"):
        try:
            api_res = requests.post(f"{API_BASE_URL}/api/manual_analyze", json={"text": input_text}, timeout=5)
            if api_res.status_code == 200:
                result = api_res.json()
                st.write("**Sentiment:**", result.get("sentiment"))
                st.write("**Confidence:**", f"{result.get('confidence')}%")
                st.write("**Sarcasm Detected:**", "YES ⚠️" if result.get("sarcasm_detected") else "NO ✅")
                st.write("**Emotions Breakdown:**", result.get("emotions"))
            else:
                st.error("Failed to process text inference via FastAPI backend.")
        except Exception as e:
            st.error(f"Cannot reach FastAPI backend at {API_BASE_URL}: {e}")

# Sidebar Options & Auto-Refresh Indicator
st.sidebar.title("Dashboard Controls")
st.sidebar.info("🟢 Auto-Refresh Enabled (10s polling interval)")
st.sidebar.markdown(f"**API Host:** `{API_BASE_URL}`")

# 10s Auto-refresh mechanism
time.sleep(10)
st.rerun()
