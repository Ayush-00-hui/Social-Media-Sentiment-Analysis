#!/bin/bash
# Standalone Streamlit Dashboard Launcher Script

set -e

echo "📊 Launching Streamlit Sentiment Monitoring Dashboard on Port 8501..."
streamlit run src/dashboard.py --server.port 8501 --server.address 0.0.0.0
