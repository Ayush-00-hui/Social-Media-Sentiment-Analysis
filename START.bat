@echo off
REM ============================================================================
REM START.bat - One-click launcher for Traccia Platform
REM Double-click this file to start the backend, tunnel, and n8n together.
REM Each runs in its own window - close a window to stop that piece.
REM ============================================================================

set PROJECT_DIR=%~dp0
REM Remove trailing backslash if present
if "%PROJECT_DIR:~-1%"=="\" set PROJECT_DIR=%PROJECT_DIR:~0,-1%

echo Starting Traccia Platform Stack...
echo.

REM -- 1. Backend (FastAPI) --
echo [1/3] Starting backend on http://localhost:8001 ...
start "Backend - FastAPI" cmd /k "cd /d ""%PROJECT_DIR%"" && set PATH=%PATH:anaconda=xxxxxxxx% && .venv\Scripts\python.exe -m uvicorn src.app:app --host 0.0.0.0 --port 8001"

REM Give the backend a few seconds head start before the tunnel connects to it
timeout /t 5 /nobreak >nul

REM -- 2. ngrok Tunnel (dynamic domain) --
echo [2/3] Starting ngrok tunnel on a dynamic domain ...
start "ngrok Tunnel" cmd /k "cd /d ""%PROJECT_DIR%"" && .venv\Scripts\python.exe -c ""import os; env=dict(line.strip().split('=',1) for line in open('.env') if '=' in line); t=env.get('NGROK_AUTHTOKEN', '').strip(' \x22\''); open('ngrok.yml','w').write('version: \x222\x22\nauthtoken: '+t+'\n') if t else print('\nWARNING: No NGROK_AUTHTOKEN found in .env\n'); os.system('ngrok http 8001 --config ngrok.yml' if t else 'ngrok http 8001')"""

REM -- 3. n8n --
echo [3/3] Starting n8n on http://localhost:5678 ...
start "n8n Orchestrator" cmd /k "cd /d ""%PROJECT_DIR%"" && npx n8n"

REM -- 4. Open the status/dashboards --
timeout /t 6 /nobreak >nul
start "" "%PROJECT_DIR%\backend_status.html"

echo.
echo All 3 windows launched:
echo   - Backend window: watch for "Uvicorn running on http://0.0.0.0:8001"
echo   - Tunnel window:  maintains ngrok forwarding url
echo   - n8n window:     open http://localhost:5678 to manage workflows
echo.
pause
