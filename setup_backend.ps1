# Traccia Platform - PowerShell Backend + ngrok Startup Script
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  TRACCIA PLATFORM - BACKEND + NGROK TUNNEL SETUP" -ForegroundColor Cyan
Write-Host "  FastAPI :8001 + https://diffuser-thousand-rule.ngrok-free.dev" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Check Python Installation
$pythonCheck = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCheck) {
    Write-Host "[ERROR] Python is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Python 3.10+ from https://python.org" -ForegroundColor Yellow
    exit 1
}

# Create .env if missing
if (-not (Test-Path ".env")) {
    Write-Host "[INFO] Creating .env from .env.example template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "[SUCCESS] .env created." -ForegroundColor Green
}

# Create Python Virtual Environment
if (-not (Test-Path ".venv")) {
    Write-Host "[INFO] Creating virtual environment (.venv)..." -ForegroundColor Yellow
    python -m venv .venv
    Write-Host "[SUCCESS] .venv created." -ForegroundColor Green
}

# Activate Virtual Environment
Write-Host "[INFO] Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Install Dependencies
Write-Host "[INFO] Installing Python packages from requirements.txt..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet
Write-Host "[SUCCESS] Dependencies installed." -ForegroundColor Green

# Initialize Database Schema
Write-Host "[INFO] Running database schema setup..." -ForegroundColor Yellow
python -c "try: from src.db.models import init_db; init_db(); print('[SUCCESS] Database initialized.'); except Exception as e: print('[NOTE] Database init note:', e)"

# Start ngrok tunnel in a new PowerShell window
Write-Host ""
Write-Host "[INFO] Launching ngrok static tunnel in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 8001 --domain=diffuser-thousand-rule.ngrok-free.dev"
Write-Host "[SUCCESS] ngrok tunnel starting at https://diffuser-thousand-rule.ngrok-free.dev" -ForegroundColor Green

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "  STARTING FASTAPI BACKEND ON PORT 8001" -ForegroundColor Green
Write-Host "  Local:  http://localhost:8001/docs" -ForegroundColor Green
Write-Host "  Public: https://diffuser-thousand-rule.ngrok-free.dev/docs" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

uvicorn src.app:app --host "::" --port 8001 --reload
