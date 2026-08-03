#!/usr/bin/env bash
# SentimentPulse AI - System Environment & Setup Validation Script

set -e

echo "=================================================="
echo "  SENTIMENTPULSE AI - SYSTEM SETUP VALIDATION"
echo "=================================================="

# 1. Python Version Check
python3 --version > /dev/null 2>&1 || python --version > /dev/null 2>&1 || { echo "❌ Python not found!"; exit 1; }
PYTHON_VER=$(python3 --version 2>&1 || python --version 2>&1)
echo "✅ Python Version: $PYTHON_VER"

# 2. Docker Check
docker --version > /dev/null 2>&1 && echo "✅ Docker Installed: $(docker --version)" || echo "⚠️  Docker not running or not installed (Optional for local dev mode)"

# 3. Docker Compose Check
docker-compose --version > /dev/null 2>&1 && echo "✅ Docker Compose Installed: $(docker-compose --version)" || docker compose version > /dev/null 2>&1 && echo "✅ Docker Compose Installed: $(docker compose version)" || echo "⚠️  Docker Compose not installed (Optional for local dev mode)"

# 4. Environment File Check
if [ -f ".env" ]; then
    echo "✅ .env File Exists"
elif [ -f ".env.example" ]; then
    echo "⚠️  .env missing! Creating .env from .env.example template..."
    cp .env.example .env
    echo "✅ .env File Created from .env.example"
else
    echo "❌ Neither .env nor .env.example found!"
    exit 1
fi

# 5. Core Directory Structure Check
for dir in src tests docker database; do
    if [ -d "$dir" ]; then
        echo "✅ Directory Found: $dir"
    else
        echo "❌ Directory Missing: $dir"
        exit 1
    fi
done

echo "=================================================="
echo "  ✅ ALL SYSTEM ENVIRONMENT CHECKS PASSED!"
echo "=================================================="
