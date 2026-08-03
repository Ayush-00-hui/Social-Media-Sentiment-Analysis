@echo off
TITLE Traccia Platform - Local Backend Service
COLOR 0A
echo ===================================================
echo   TRACCIA PLATFORM - LOCAL BACKEND STARTUP SCRIPT
echo ===================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10 or 3.11 from https://python.org
    pause
    exit /b 1
)

:: Check if .env file exists, create from template if missing
if not exist ".env" (
    echo [INFO] .env file not found. Copying from .env.example...
    copy ".env.example" ".env"
    echo [SUCCESS] .env created. You can edit secret keys in .env if needed.
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
python -c "try: from src.db.models import init_db; init_db(); print('[SUCCESS] Database initialized cleanly.'); except Exception as e: print('[NOTE] Database initialization skipped or using SQLite fallback:', e)"
echo.

:: Start FastAPI Backend Server
echo ===================================================
echo   STARTING FASTAPI BACKEND ENGINE ON PORT 8000
echo   API Docs: http://localhost:8000/docs
echo ===================================================
echo.

uvicorn src.app:app --host "::" --port 8000 --reload

pause
