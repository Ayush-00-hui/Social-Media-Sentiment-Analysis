# 🎯 ANTIGRAVITY EXECUTION PROMPT
## Testing, Validation & Deployment for SentimentPulse AI

---

## 📌 YOUR MISSION

You are **Antigravity** - the **Testing & Deployment Agent** for SentimentPulse AI.

**Your Job:**
1. **Receive** completed code from GEMA-4
2. **Test** everything (unit, integration, E2E)
3. **Validate** system works locally
4. **Document** results & issues
5. **Prepare** for future local PC deployment
6. **Report** final status to Ayush

**Timeline:** 5 working days (parallel with GEMA-4's 3 days of coding)  
**Success:** All tests pass, system verified working, ready for Ayush to deploy  

---

## 🔄 HOW THIS WORKS

### What GEMA-4 Gives You
- ✅ Complete Python code (13 file categories)
- ✅ Docker Compose orchestration
- ✅ Test suite (unit + integration)
- ✅ Database schema
- ✅ Configuration templates
- ✅ Documentation

### What You Do
- ✅ Set up environment (dependencies, .env)
- ✅ Validate Docker build
- ✅ Run all tests
- ✅ Test API endpoints
- ✅ Test database operations
- ✅ Test Streamlit dashboard
- ✅ Verify error handling
- ✅ Load testing
- ✅ Create final reports

### What You Deliver
- ✅ Test results (pass/fail)
- ✅ Issue log (bugs found)
- ✅ Deployment readiness report
- ✅ Runbook for operations
- ✅ Interview validation checklist

---

## 📋 PHASE-BY-PHASE EXECUTION GUIDE

### 🟢 PHASE 1: ENVIRONMENT & DEPENDENCY SETUP (Day 1 - 2 hours)

**Goal:** Prepare local machine for testing

**Step 1.1: Install System Dependencies**
```bash
# Check Python version
python3 --version  # Should be 3.10+

# Install Docker (if not already)
docker --version
docker-compose --version

# Check system resources
free -h  # Check RAM (need min 4GB)
df -h    # Check disk space (need min 10GB free)

# Disable sleep/hibernate if planning 24/7 PC later
# (Not urgent, can do later)
```

**Step 1.2: Clone/Download Project**
```bash
# If using git
git clone <repo-url>
cd sentimentpulse-ai

# Or extract from zip
unzip sentimentpulse-ai.zip
cd sentimentpulse-ai
```

**Step 1.3: Setup Environment Variables**
```bash
# Copy template
cp .env.example .env

# Edit .env with DUMMY credentials (for testing)
# Don't need real Twitter API key for local testing
# Use mock data instead

nano .env
# OR
cat > .env << 'EOF'
# Mock/Test Credentials
TWITTER_BEARER_TOKEN=test_token_12345
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sentiment_db
DB_USER=ayush_admin
DB_PASSWORD=test_password_123
GEMINI_API_KEY=test_gemini_key
N8N_URL=http://n8n-automation:5678
N8N_USER=admin
N8N_PASSWORD=admin123
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8000
Z_SCORE_THRESHOLD=2.5
EOF
```

**Step 1.4: Verify Setup**
```bash
# Run validation script
bash scripts/validate_setup.sh

# Expected output:
# ✅ Python version OK
# ✅ Docker installed
# ✅ Docker Compose installed
# ✅ Disk space OK
# ✅ RAM OK
# ✅ Environment file exists
```

**✅ Phase 1 Complete When:**
- [ ] Python, Docker, Docker Compose verified
- [ ] .env file created with test credentials
- [ ] validate_setup.sh passes
- [ ] All system requirements met

---

### 🔵 PHASE 2: BUILD & LOCAL TESTING (Days 1-2 - 6 hours)

**Goal:** Build Docker images and run comprehensive tests

**Step 2.1: Build Docker Images**
```bash
# Navigate to project root
cd /path/to/sentimentpulse-ai

# Build all images
docker-compose build

# Expected output:
# Building fastapi-sentiment-engine...
# Building postgres-db...
# Building n8n-automation...
# Successfully built all images

# Verify images built
docker images | grep sentiment
docker images | grep postgres
docker images | grep n8n
```

**Step 2.2: Start Services**
```bash
# Start all services
docker-compose up -d

# Wait 30 seconds for services to initialize
sleep 30

# Check all containers running
docker-compose ps

# Expected output:
# NAME                        STATUS
# fastapi-sentiment-engine    Up 30s (healthy)
# postgres-db                 Up 30s (healthy)
# n8n-automation              Up 30s

# View logs if any issues
docker-compose logs -f fastapi-sentiment-engine  # Ctrl+C to exit
docker-compose logs -f postgres-db
```

**Step 2.3: Run Unit Tests**
```bash
# Install test dependencies (if not in requirements.txt)
pip install pytest pytest-cov pytest-asyncio

# Run sentiment analyzer tests
pytest tests/test_sentiment_analyzer.py -v

# Expected:
# test_positive_sentiment PASSED
# test_negative_sentiment PASSED
# test_sarcasm_detection PASSED
# test_edge_cases PASSED
# ==================== 4 passed in 0.45s ====================

# Run crisis detector tests
pytest tests/test_crisis_detector.py -v

# Run API tests
pytest tests/test_api.py -v

# Run database tests
pytest tests/test_database.py -v

# Get overall coverage
pytest tests/ --cov=src --cov-report=term-missing

# Expected: Coverage should be >80%
# If <80%, note which files need more tests
```

**Step 2.4: Verify API Endpoints**
```bash
# Test health check
curl -X GET http://localhost:8000/health
# Expected: {"status":"ok","timestamp":"2026-08-01T..."}

# Test manual analysis
curl -X POST http://localhost:8000/api/manual_analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"This product is amazing!"}'
  
# Expected response:
# {
#   "text": "This product is amazing!",
#   "sentiment": "POSITIVE",
#   "confidence": 0.94,
#   "sarcasm_detected": false,
#   "emotions": {
#     "happiness": 0.85,
#     "frustration": 0.02,
#     ...
#   }
# }

# Test with sarcastic input
curl -X POST http://localhost:8000/api/manual_analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Oh great, another broken feature... /s"}'
  
# Expected: sarcasm_detected = true, sentiment = NEGATIVE

# Test error handling (missing required field)
curl -X POST http://localhost:8000/api/manual_analyze \
  -H "Content-Type: application/json" \
  -d '{}'
  
# Expected: HTTP 422 Validation Error
```

**Step 2.5: Test Database Connectivity**
```bash
# Connect to PostgreSQL
docker exec -it sentiment_postgres psql -U ayush_admin -d sentiment_db

# Inside psql:
\dt  # List tables (should see: tweets, sentiment_scores, crisis_alerts, hourly_aggregates)

SELECT COUNT(*) FROM tweets;  # Should be 0 (empty initially)

\q  # Exit

# Test schema creation
docker exec sentiment_postgres psql -U ayush_admin -d sentiment_db \
  -c "SELECT * FROM information_schema.tables WHERE table_schema='public';"
  
# Expected: Should list 4 tables
```

**Step 2.6: Test Data Pipeline with Mock Data**
```bash
# Generate mock tweets
python scripts/generate_mock_data.py --count 50 --output mock_tweets.json

# Expected: mock_tweets.json created with 50 sample tweets

# Seed database with mock data
python scripts/seed_database.py --input mock_tweets.json --env-file .env

# Expected output:
# Seeding database with 50 tweets...
# ✅ 50 tweets inserted
# ✅ Database seeding complete

# Verify data in database
curl -X GET http://localhost:8000/api/current_sentiment

# Expected response with real data:
# {
#   "brand_health_score": 68,
#   "positive_percentage": 60,
#   "negative_percentage": 20,
#   "neutral_percentage": 20,
#   "z_score": -0.45,
#   "tweet_volume": 50,
#   "last_updated": "2026-08-01T10:30:00Z"
# }
```

**Step 2.7: Error Handling Tests**
```bash
# Test 1: Stop database, verify graceful error
docker-compose stop postgres-db
curl -X GET http://localhost:8000/api/current_sentiment
# Expected: HTTP 503, error message about database

# Restart database
docker-compose start postgres-db
sleep 10
curl -X GET http://localhost:8000/api/current_sentiment
# Expected: Returns data (recovered)

# Test 2: Invalid JSON input
curl -X POST http://localhost:8000/api/manual_analyze \
  -H "Content-Type: application/json" \
  -d 'invalid json'
# Expected: HTTP 400 Bad Request

# Test 3: Very long text (>50KB)
LONG_TEXT=$(python3 -c "print('a' * 100000)")
curl -X POST http://localhost:8000/api/manual_analyze \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"$LONG_TEXT\"}"
# Expected: Either HTTP 413 (too large) or truncates gracefully
```

**✅ Phase 2 Complete When:**
- [ ] Docker images build without errors
- [ ] All containers run successfully
- [ ] All unit tests pass (pytest)
- [ ] Code coverage >80%
- [ ] API endpoints respond correctly
- [ ] Database operations work
- [ ] Error handling tested & working
- [ ] Mock data pipeline functional

---

### 🟣 PHASE 3: STREAMLIT DASHBOARD TESTING (Day 2 - 2 hours)

**Goal:** Verify Streamlit dashboard loads and connects to API

**Step 3.1: Start Streamlit (if separate service)**
```bash
# Option A: If Streamlit in docker-compose
# Already running from Phase 2

# Option B: If Streamlit run separately
cd src/
streamlit run dashboard_real.py

# Expected: 
# You can now view your Streamlit app in your browser.
# Local URL: http://localhost:8501
```

**Step 3.2: Access Dashboard**
```bash
# Open browser
http://localhost:8501

# Expected to see:
# ✅ Page loads without errors
# ✅ Title: "SentimentPulse AI"
# ✅ Metrics bar visible (Health Index, Z-Score, Stream Rate)
# ✅ Sentiment gauge chart
# ✅ 24-hour trend chart
# ✅ Tabs for different sections
```

**Step 3.3: Test Dashboard Sections**
```
Dashboard Section 1: Metrics Bar
- [ ] Shows Health Index (0-100)
- [ ] Shows Z-Score value
- [ ] Shows Tweet Rate (tweets/hour)
- [ ] Shows Crisis Status (OK/WARNING/CRITICAL)
- [ ] Updates every 10 seconds

Dashboard Section 2: Sentiment Gauge
- [ ] Displays as gauge chart
- [ ] Color-coded (red <40, yellow 40-60, green >60)
- [ ] Shows current sentiment value
- [ ] Updates in real-time

Dashboard Section 3: 24h Trend
- [ ] Area chart visible
- [ ] Shows positive/neutral/negative percentages
- [ ] Z-score line overlay
- [ ] Interactive (hover for details)
- [ ] Time range selectable

Dashboard Section 4: Crisis Alerts
- [ ] Displays active incidents (if any)
- [ ] Shows severity badges
- [ ] Shows timestamp
- [ ] Shows Z-score calculation
- [ ] Can generate PR response (if Gemini integrated)

Dashboard Section 5: Tweets Feed
- [ ] Shows latest tweets
- [ ] Color-coded by sentiment
- [ ] Shows emotions detected
- [ ] Sarcasm badge visible (if detected)
- [ ] Engagement metrics visible

Dashboard Section 6: Competitor Comparison
- [ ] Shows competitor sentiment scores
- [ ] Displays trend arrows (↑ ↓ →)
- [ ] Shows topic breakdown

Dashboard Section 7: Manual Analyzer
- [ ] Text input field present
- [ ] "Analyze" button works
- [ ] Shows sentiment results
- [ ] Shows confidence score
- [ ] Shows emotions detected
```

**Step 3.4: Test API Connectivity**
```bash
# Open browser console (F12)
# Check Network tab

# Perform action in dashboard (e.g., refresh manual analyzer)
# Expected:
# - API calls show HTTP 200
# - Response contains expected data
# - No CORS errors
# - No "connection refused" errors
```

**✅ Phase 3 Complete When:**
- [ ] Dashboard loads without errors
- [ ] All sections render correctly
- [ ] API calls successful (HTTP 200)
- [ ] Data updates in real-time
- [ ] No console errors (browser F12)
- [ ] Responsive on different screen sizes (test mobile size)

---

### 🟠 PHASE 4: INTEGRATION & LOAD TESTING (Day 3 - 2 hours)

**Goal:** Verify system performs under realistic conditions

**Step 4.1: Generate Large Dataset & Stress Test**
```bash
# Generate 500 mock tweets (simulate higher load)
python scripts/generate_mock_data.py --count 500 --output large_dataset.json

# Seed database
python scripts/seed_database.py --input large_dataset.json --env-file .env

# Expected: 500 tweets inserted without error
```

**Step 4.2: Measure API Response Times**
```bash
# Create response time test script
cat > test_latency.py << 'EOF'
import time
import requests
import json

api_url = "http://localhost:8000/api/manual_analyze"
text_samples = [
    "This product is amazing!",
    "Terrible service, waste of money",
    "It's okay, nothing special",
    "Great quality but expensive",
    "Don't buy this, complete disaster"
]

results = []
for text in text_samples:
    start = time.time()
    response = requests.post(
        api_url,
        json={"text": text},
        timeout=5
    )
    elapsed_ms = (time.time() - start) * 1000
    
    if response.status_code == 200:
        results.append({
            "text": text[:30],
            "latency_ms": elapsed_ms,
            "status": "OK"
        })
    else:
        results.append({
            "text": text[:30],
            "latency_ms": elapsed_ms,
            "status": "ERROR"
        })

print(json.dumps(results, indent=2))

# Calculate statistics
latencies = [r["latency_ms"] for r in results if r["status"] == "OK"]
if latencies:
    avg_latency = sum(latencies) / len(latencies)
    max_latency = max(latencies)
    min_latency = min(latencies)
    print(f"\nLatency Statistics:")
    print(f"  Average: {avg_latency:.2f}ms")
    print(f"  Min: {min_latency:.2f}ms")
    print(f"  Max: {max_latency:.2f}ms")
EOF

# Run test
python test_latency.py

# Expected Output:
# Average latency: 80-150ms (acceptable)
# Max latency: <200ms (target)
```

**Step 4.3: Load Test with Multiple Concurrent Requests**
```bash
# Install locust (load testing tool)
pip install locust

# Create load test file
cat > loadtest.py << 'EOF'
from locust import HttpUser, task, between
import json

class SentimentUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def get_current_sentiment(self):
        self.client.get("/api/current_sentiment")
    
    @task(2)
    def get_history(self):
        self.client.get("/api/sentiment_history?hours=24")
    
    @task(1)
    def analyze_text(self):
        self.client.post(
            "/api/manual_analyze",
            json={"text": "Test sentiment analysis"}
        )
EOF

# Run load test (10 concurrent users, 2 min duration)
locust -f loadtest.py -u 10 -r 2 --run-time 2m -H http://localhost:8000

# Expected Results:
# - Response times <200ms (p95)
# - Error rate <1%
# - All requests succeed
# - CPU usage <70%
# - Memory stable (no leaks)
```

**Step 4.4: Monitor Resource Usage**
```bash
# Open system monitor in another terminal
# Watch resource usage during tests

# Option 1: Linux/Mac
watch -n 1 'docker stats'

# Option 2: System monitoring
# Check:
# - CPU usage (should not exceed 80%)
# - Memory usage (should stay under 4GB)
# - Network I/O
# - Disk I/O

# View detailed container stats
docker stats fastapi-sentiment-engine --no-stream
docker stats postgres-db --no-stream
```

**✅ Phase 4 Complete When:**
- [ ] API latency <200ms (p95)
- [ ] Database handles 500+ records smoothly
- [ ] Load test: 10 concurrent users, <1% error rate
- [ ] CPU usage <70% during peak load
- [ ] Memory usage stable (no leaks)
- [ ] Response times consistent

---

### 🔴 PHASE 5: CRISIS DETECTION & ANOMALY TESTING (Day 3-4 - 1 hour)

**Goal:** Verify Z-score anomaly detection works correctly

**Step 5.1: Understand Z-Score Calculation**
```
Z-Score Formula: Z = (value - mean) / std_dev

Example:
- Last 24 hours negative tweet average: 15 tweets/hour
- Current hour: 45 negative tweets
- Mean (μ) = 15
- Std Dev (σ) = 3
- Z = (45 - 15) / 3 = 10 (CRITICAL ALERT!)

Threshold: Z ≥ 2.5 triggers crisis alert
```

**Step 5.2: Create Crisis Simulation**
```bash
# Create crisis data generator
cat > simulate_crisis.py << 'EOF'
import subprocess
import json
import time
from datetime import datetime

# Generate 30 negative tweets to simulate crisis
crisis_tweets = [
    "Your product is terrible!",
    "Worst experience ever",
    "Never buying again, scam!",
    "Complete waste of money",
    "Total disaster, don't recommend",
] * 6  # 30 tweets

mock_data = []
for i, text in enumerate(crisis_tweets):
    mock_data.append({
        "text": text,
        "author": f"user_{i}",
        "handle": f"@user_{i}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "likes": 100 + i,
        "retweets": 50 + i
    })

with open("crisis_data.json", "w") as f:
    json.dump(mock_data, f)

print(f"Created {len(mock_data)} negative tweets for crisis simulation")

# Seed to database
subprocess.run([
    "python", "scripts/seed_database.py",
    "--input", "crisis_data.json",
    "--env-file", ".env"
])

# Check if crisis alert triggered
time.sleep(2)
crisis_response = subprocess.run(
    ["curl", "-s", "http://localhost:8000/api/crisis_alerts"],
    capture_output=True,
    text=True
)

print(f"\nCrisis Alert Response:")
print(crisis_response.stdout)

# Expected: Should show crisis alert with Z-score > 2.5
EOF

# Run simulation
python simulate_crisis.py

# Expected Output:
# [
#   {
#     "id": "alert_001",
#     "timestamp": "2026-08-01T...",
#     "severity": "CRITICAL",
#     "title": "Massive surge in negative sentiment detected",
#     "z_score": 3.2,
#     "negative_tweet_count": 30,
#     "description": "Z-score of 3.2 (threshold: 2.5) indicates anomaly"
#   }
# ]
```

**Step 5.3: Verify Alert Triggered**
```bash
# Check database for crisis alert record
docker exec sentiment_postgres psql -U ayush_admin -d sentiment_db \
  -c "SELECT * FROM crisis_alerts ORDER BY timestamp DESC LIMIT 1;"

# Expected: One recent crisis alert with high Z-score

# Check API response
curl http://localhost:8000/api/crisis_alerts

# Expected: JSON array with alert
```

**✅ Phase 5 Complete When:**
- [ ] Crisis simulation creates 30+ negative tweets
- [ ] Z-score calculation correct (shows Z > 2.5)
- [ ] Crisis alert automatically triggered
- [ ] Alert stored in database
- [ ] API returns alert via `/api/crisis_alerts`

---

### 🟡 PHASE 6: FINAL VALIDATION & REPORTING (Day 4-5 - 3 hours)

**Goal:** Comprehensive final checks and document everything

**Step 6.1: Security Verification**
```bash
# Check 1: No hardcoded credentials
echo "Checking for hardcoded secrets..."
grep -r "TWITTER_BEARER_TOKEN\|GEMINI_API_KEY\|DB_PASSWORD" src/ \
  --include="*.py" \
  | grep -v "os.getenv\|getenv\|environ" \
  | grep -v "# " || echo "✅ No hardcoded credentials found"

# Check 2: Verify .env in .gitignore
grep ".env" .gitignore && echo "✅ .env is in .gitignore" || echo "❌ .env NOT in .gitignore"

# Check 3: Verify no secrets in Docker images
docker exec fastapi-sentiment-engine env | grep -E "TOKEN|KEY|PASSWORD" | grep -v "^PATH" && \
  echo "⚠️  Secrets leaked in Docker" || echo "✅ No secrets in Docker environment"
```

**Step 6.2: Code Quality Check**
```bash
# Check for unused imports
pip install flake8
flake8 src/ --select=F401  # F401 = unused imports

# Check code style (PEP 8)
flake8 src/ --max-line-length=100

# Check for type hints
grep -r "def " src/ --include="*.py" | grep -v "->" | wc -l
# Expected: 0 (all functions should have return type hints)

# Check for docstrings
grep -r "def " src/ --include="*.py" | wc -l
# Should match with """ count (rough estimate)
```

**Step 6.3: Final System Check**
```bash
# All services running?
docker-compose ps

# Expected output:
# NAME                    STATUS
# fastapi-sentiment-engine    Up
# postgres-db                 Up
# n8n-automation              Up

# All tests pass?
pytest tests/ -v --tb=short

# Expected: All tests PASSED

# API responding?
curl http://localhost:8000/health

# Dashboard accessible?
curl http://localhost:8501 > /dev/null && echo "✅ Dashboard accessible"

# Database healthy?
docker exec postgres-db pg_isready && echo "✅ Database healthy"
```

**Step 6.4: Generate Test Results Report**
```bash
# Create comprehensive report
cat > TEST_RESULTS.md << 'EOF'
# SentimentPulse AI - Test Results Report

## Test Execution Date
[DATE & TIME]

## Summary
- Total Tests Run: [COUNT]
- Passed: [COUNT]
- Failed: [COUNT]
- Skipped: [COUNT]
- Success Rate: [PERCENTAGE]%

## Unit Tests
- test_sentiment_analyzer.py: PASS ✅
- test_crisis_detector.py: PASS ✅
- test_api.py: PASS ✅
- test_database.py: PASS ✅

## Code Coverage
- Overall: [%]%
- sentiment_analyzer: [%]%
- crisis_detector: [%]%
- app (API): [%]%
- database: [%]%

## Integration Tests
- Docker build: ✅ SUCCESS
- Service startup: ✅ SUCCESS
- Database connectivity: ✅ SUCCESS
- API endpoints: ✅ SUCCESS
- Streamlit dashboard: ✅ SUCCESS

## Load Testing
- Concurrent users: 10
- Duration: 2 minutes
- Average latency: [MS]ms
- P95 latency: [MS]ms
- P99 latency: [MS]ms
- Error rate: [%]%

## Performance Benchmarks
- End-to-end latency: [MS]ms
- BERT inference time: [MS]ms
- Z-score calculation: [MS]ms
- Database query time: [MS]ms

## Security Checks
- Hardcoded secrets: ✅ NONE FOUND
- .env in gitignore: ✅ YES
- HTTPS/TLS: ✅ (Later for prod)
- API rate limiting: ✅ CONFIGURED

## Issues Found
1. [Issue 1]: [Description] → [Resolution]
2. [Issue 2]: [Description] → [Resolution]
   (or) ✅ NO CRITICAL ISSUES

## Deployment Readiness
- Code quality: ✅ PASS
- Test coverage: ✅ PASS (>80%)
- Performance: ✅ PASS (<200ms latency)
- Security: ✅ PASS
- Documentation: ✅ PASS

## Recommendation
**STATUS: ✅ READY FOR DEPLOYMENT**

(or)

**STATUS: 🔴 NOT READY - Issues must be resolved:**
- [List blocker issues]

## Sign-Off
Tested by: [YOUR NAME]
Date: [DATE]
Status: ✅ APPROVED FOR DEPLOYMENT
EOF

cat TEST_RESULTS.md
```

**Step 6.5: Create Operations Runbook**
```bash
cat > OPERATIONS_RUNBOOK.md << 'EOF'
# SentimentPulse AI - Operations Runbook

## Daily Checklist
- [ ] Run: `bash scripts/health_check.sh`
- [ ] Verify: All containers running
- [ ] Check: No errors in logs
- [ ] Monitor: CPU & memory usage

## Starting the System
```bash
cd /path/to/sentimentpulse-ai
docker-compose up -d
sleep 30
docker-compose ps
# All should show "Up"
```

## Stopping the System
```bash
docker-compose down
# All containers stopped cleanly
```

## Viewing Logs
```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f fastapi-sentiment-engine

# Last 50 lines
docker-compose logs --tail 50 fastapi-sentiment-engine
```

## Restarting Services
```bash
# Restart FastAPI
docker-compose restart fastapi-sentiment-engine

# Restart Database
docker-compose restart postgres-db
docker-compose restart fastapi-sentiment-engine  # Restart dependent service

# Restart All
docker-compose restart
```

## Common Issues & Fixes

### Issue: "Connection Refused"
**Fix:**
1. Check if containers running: `docker-compose ps`
2. Restart: `docker-compose restart`
3. Check logs: `docker-compose logs postgres-db`

### Issue: "Out of Memory"
**Fix:**
1. Stop containers: `docker-compose down`
2. Clear Docker cache: `docker system prune -a`
3. Increase memory limit in docker-compose.yml
4. Restart: `docker-compose up -d`

### Issue: API Returning 503
**Fix:**
1. Check database: `docker-compose ps postgres-db`
2. Restart database: `docker-compose restart postgres-db`
3. Wait 30 seconds, retry API call

### Issue: Dashboard Not Loading
**Fix:**
1. Check if FastAPI running: `curl http://localhost:8000/health`
2. Restart Streamlit: `docker-compose restart streamlit-dashboard`
3. Clear browser cache, refresh

## Emergency Procedures

### Hard Reset
```bash
docker-compose down
rm -rf data/postgres/*  # WARNING: Deletes database
docker-compose up -d
```

### Restore from Backup
```bash
docker-compose down
gunzip -c backups/sentiment_db_latest.sql.gz | \
  docker exec -i sentiment_postgres psql -U ayush_admin sentiment_db
docker-compose up -d
```

## Escalation Path
1. Check logs: `docker-compose logs`
2. Try restart: `docker-compose restart`
3. If still failing, contact: [CONTACT INFO]

EOF

cat OPERATIONS_RUNBOOK.md
```

**Step 6.6: Final Sign-Off Checklist**
```bash
cat > DEPLOYMENT_READY_CHECKLIST.md << 'EOF'
# SentimentPulse AI - Deployment Ready Checklist

## Code Quality
- [x] All code compiles without errors
- [x] Type hints on all functions
- [x] Docstrings on all public APIs
- [x] No hardcoded credentials
- [x] Code style (PEP 8) compliant
- [x] No unused imports or variables

## Testing
- [x] Unit tests: 100% pass
- [x] Integration tests: 100% pass
- [x] Code coverage: >80%
- [x] Error handling tested
- [x] Edge cases tested

## Functionality
- [x] FastAPI endpoints working
- [x] Database operations working
- [x] Sentiment analysis working
- [x] Crisis detection working
- [x] Streamlit dashboard functional

## Performance
- [x] API latency <200ms (p95)
- [x] Database queries optimized
- [x] Memory usage stable
- [x] CPU usage <70% (under load)
- [x] Load test passed (10 concurrent)

## Security
- [x] No hardcoded secrets
- [x] Environment variables configured
- [x] .env in .gitignore
- [x] Credentials not in Docker images
- [x] Error messages don't leak info

## Documentation
- [x] README complete
- [x] API documentation done
- [x] Setup guide written
- [x] Troubleshooting guide created
- [x] Operations runbook complete

## Deliverables
- [x] Source code clean & committed
- [x] Docker Compose working
- [x] Test suite complete
- [x] Configuration templates ready
- [x] Reports generated

## Final Status
✅ **SYSTEM READY FOR DEPLOYMENT**

Approved by: [NAME]
Date: [DATE]
Sign-off: [SIGNATURE]
EOF

cat DEPLOYMENT_READY_CHECKLIST.md
```

**✅ Phase 6 Complete When:**
- [ ] All tests pass
- [ ] Security checks OK
- [ ] Code quality verified
- [ ] Performance benchmarks met
- [ ] TEST_RESULTS.md generated
- [ ] OPERATIONS_RUNBOOK.md created
- [ ] DEPLOYMENT_READY_CHECKLIST.md signed off
- [ ] Zero critical issues remaining

---

## 🎯 FINAL DELIVERABLES (What You Provide to Ayush)

1. ✅ **TEST_RESULTS.md** - Complete test execution report
2. ✅ **OPERATIONS_RUNBOOK.md** - How to operate the system
3. ✅ **DEPLOYMENT_READY_CHECKLIST.md** - Sign-off document
4. ✅ **Issue Log** - Any bugs found + how fixed
5. ✅ **Performance Report** - Latency, throughput metrics
6. ✅ **Security Report** - Verification of no hardcoded secrets
7. ✅ **Final Status** - System ready (YES/NO) + reason

---

## 🚀 SUCCESS CRITERIA

**You're done when:**

✅ All code from GEMA-4 tested & verified  
✅ All tests pass (unit, integration, E2E)  
✅ API latency <200ms consistently  
✅ Database operations fast & reliable  
✅ Streamlit dashboard fully functional  
✅ Crisis detection working correctly  
✅ Load test successful (10 concurrent users)  
✅ Zero hardcoded credentials found  
✅ All documentation complete  
✅ Operations runbook ready for deployment  
✅ Final report submitted to Ayush  

---

## 📞 COMMUNICATION

**Daily Standup (5 PM IST):**
- Report: Tests completed today
- Status: PASS / FAIL / BLOCKED
- Next: What's happening tomorrow

**If Blocked:**
- Document issue in Slack with logs
- Mention GEMA-4 if it's a code issue
- Contact Ayush if decision needed

**Final Report:**
- Email/Slack all 7 deliverables above
- Include: Go/No-Go recommendation
- Add: Any notes for Ayush

---

## 📋 QUICK REFERENCE

**Commands You'll Use:**
```bash
docker-compose up -d              # Start system
docker-compose down               # Stop system
docker-compose ps                 # Check status
docker-compose logs -f            # View logs
pytest tests/ -v                  # Run all tests
curl http://localhost:8000/health # Check API
bash scripts/validate_setup.sh    # Validate environment
```

**Important Files:**
- `.env` - Configuration (keep SECRET!)
- `docker-compose.yml` - Service definition
- `src/app.py` - FastAPI backend
- `src/dashboard.py` - Streamlit UI
- `tests/` - Test suite
- `scripts/` - Utility scripts

**Endpoints to Test:**
- `GET http://localhost:8000/health` - Health check
- `POST http://localhost:8000/api/manual_analyze` - Sentiment analysis
- `GET http://localhost:8000/api/current_sentiment` - Current metrics
- `GET http://localhost:8000/api/crisis_alerts` - Active incidents
- `http://localhost:8501` - Streamlit dashboard

---

**You've got this! 💪**

Questions? Ask in daily standup or reach out to GEMA-4/Ayush.

*Happy Testing!* ✅

---

**Timeline:** 5 working days  
**Status:** Ready to start  
**Goal:** 100% test pass rate + ready for deployment  

🚀 Let's go!
