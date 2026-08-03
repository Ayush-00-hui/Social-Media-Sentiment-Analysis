# Traccia Platform - PowerShell Backend Setup Script
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  TRACCIA PLATFORM - POWERSHELL BACKEND SETUP" -ForegroundColor Cyan
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
pip install -r requirements.txt

# Initialize Database Schema
Write-Host "[INFO] Running database schema setup..." -ForegroundColor Yellow
python -c "try: from src.db.models import init_db; init_db(); print('[SUCCESS] Database initialized.'); except Exception as e: print('[NOTE] Database initialization note:', e)"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE! RUNNING BACKEND FASTAPI SERVER" -ForegroundColor Green
Write-Host "  FastAPI Endpoint: http://localhost:8000" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload
