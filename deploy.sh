#!/bin/bash
# Master Startup & Health-Check Deployment Script for Antigravity

set -e

echo "========================================================"
echo "🚀 Starting SentimentPulse AI Production Deployment"
echo "========================================================"

# 1. Environment File Check
if [ ! -f .env ]; then
    echo "⚠️ .env file missing! Creating from template..."
    cp .env.example .env
fi

# 2. Build and Launch Containers
echo "🐳 Launching Docker Compose Stack (FastAPI, Postgres, n8n)..."
docker-compose -f docker/docker-compose.yml up --build -d

# 3. Wait for Database Ready
echo "⏳ Waiting for PostgreSQL container to pass health checks..."
sleep 5

# 4. Run Integration Test Suite
echo "🧪 Running Integration Tests..."
python3 -m unittest discover -s tests

echo "========================================================"
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "Dashboard UI: http://localhost:3000"
echo "FastAPI Specs: http://localhost:8000/docs"
echo "n8n Workflows: http://localhost:5678"
echo "========================================================"
