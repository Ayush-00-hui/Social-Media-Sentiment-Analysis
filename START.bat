@echo off
REM ============================================================================
REM START.bat - One-click launcher for Traccia Platform
REM Double-click this file to start the frontend, backend, tunnel, and n8n together.
REM Each runs in its own window - close a window to stop that piece.
REM ============================================================================

set PROJECT_DIR=%~dp0
REM Remove trailing backslash if present
if "%PROJECT_DIR:~-1%"=="\" set PROJECT_DIR=%PROJECT_DIR:~0,-1%

echo Starting Traccia Platform Stack...
echo.

REM -- 1. Backend (FastAPI) --
echo [1/4] Starting backend on http://localhost:8001 ...
start "Backend - FastAPI" cmd /k "cd /d ""%PROJECT_DIR%"" && set PATH=%PATH:anaconda=xxxxxxxx% && .venv\Scripts\python.exe -m uvicorn src.app:app --host 0.0.0.0 --port 8001"

REM Give the backend a few seconds head start before the tunnel connects to it
timeout /t 5 /nobreak >nul

REM -- 2. ngrok Tunnel (permanent static domain) --
echo [2/4] Starting ngrok tunnel on https://diffuser-thousand-rule.ngrok-free.dev ...
start "ngrok Tunnel" cmd /v:on /k "cd /d ""%PROJECT_DIR%"" && FOR /F ""tokens=1,2 delims=="" %%G IN (.env) DO (if %%G==NGROK_AUTHTOKEN set NGROK_TOKEN=%%H) & if defined NGROK_TOKEN (ngrok config add-authtoken !NGROK_TOKEN!) & ngrok http --domain=diffuser-thousand-rule.ngrok-free.dev 8001"

REM -- 3. n8n --
echo [3/4] Starting n8n on http://localhost:5678 ...
start "n8n Orchestrator" cmd /k "cd /d ""%PROJECT_DIR%"" && npx n8n"

REM -- 4. Frontend (Vite) --
echo [4/4] Starting React Frontend on http://localhost:5173 ...
start "Frontend - Vite" cmd /k "cd /d ""%PROJECT_DIR%"" && npm run dev"

REM -- 5. Open the status/dashboards --
timeout /t 6 /nobreak >nul
start "" "%PROJECT_DIR%\backend_status.html"
start http://localhost:5173/

echo.
echo All 4 windows launched:
echo   - Backend window: watch for "Uvicorn running on http://0.0.0.0:8001"
echo   - Tunnel window:  maintains https://diffuser-thousand-rule.ngrok-free.dev
echo   - n8n window:     open http://localhost:5678 to manage workflows
echo   - Frontend window: Vite dev server running Traccia Dashboard
echo.
pause
