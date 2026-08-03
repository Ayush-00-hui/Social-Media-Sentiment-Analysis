@echo off
TITLE Traccia Platform - Backend + ngrok Tunnel
COLOR 0A
echo ===================================================
echo   TRACCIA PLATFORM - LOCAL BACKEND STARTUP SCRIPT
echo   FastAPI on :8000 + ngrok static tunnel
echo ===================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

:: Check if .env file exists, create from template if missing
if not exist ".env" (
    echo [INFO] .env file not found. Copying from .env.example...
    copy ".env.example" ".env"
    echo [SUCCESS] .env created. Edit secret keys in .env if needed.
    echo.
)

:: Check if Virtual Environment exists
if not exist ".venv" (
    echo [INFO] Creating Python virtual environment (.venv)...
    python -m venv .venv
    echo [SUCCESS] Virtual environment created.
    echo.
)

:: Activate virtual environment
echo [INFO] Activating virtual environment...
call .venv\Scripts\activate

:: Install / Update Python dependencies
echo [INFO] Installing required dependencies from requirements.txt...
pip install -r requirements.txt --quiet
echo [SUCCESS] Dependencies installed.
echo.

:: Initialize Database Tables (PostgreSQL or SQLite fallback)
echo [INFO] Initializing Database Schema...
python -c "try: from src.db.models import init_db; init_db(); print('[SUCCESS] Database initialized cleanly.'); except Exception as e: print('[NOTE] Database initialization skipped:', e)"
echo.

:: Start ngrok static tunnel in a separate window
echo [INFO] Starting ngrok static tunnel...
start "Traccia ngrok Tunnel" cmd /k "ngrok http 8000 --domain=diffuser-thousand-rule.ngrok-free.dev"
echo [SUCCESS] ngrok tunnel starting at https://diffuser-thousand-rule.ngrok-free.dev
echo.

:: Start FastAPI Backend Server
echo ===================================================
echo   FASTAPI BACKEND ENGINE STARTING ON PORT 8000
echo   Local:  http://localhost:8000/docs
echo   Public: https://diffuser-thousand-rule.ngrok-free.dev/docs
echo ===================================================
echo.

uvicorn src.app:app --host "::" --port 8000 --reload

pause
