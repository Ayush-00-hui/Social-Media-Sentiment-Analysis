@echo off
TITLE Traccia Platform - Launch All Local Services
COLOR 0B
echo ===================================================
echo   TRACCIA PLATFORM - LAUNCH FRONTEND + BACKEND
echo ===================================================
echo.

:: Launch Backend in a new window
echo [INFO] Starting FastAPI Backend on http://localhost:8001 ...
start "Traccia Backend (FastAPI)" cmd /k "start_backend.bat"

:: Set up ngrok authtoken and launch tunnel
echo [INFO] Setting up ngrok token and starting tunnel on port 8001 ...
start "Traccia ngrok Tunnel" cmd /k "FOR /F \"tokens=1,2 delims==\" %%G IN (.env) DO (if %%G==NGROK_AUTHTOKEN set NGROK_TOKEN=%%H) & if defined NGROK_TOKEN (ngrok config add-authtoken %NGROK_TOKEN%) & ngrok http --domain=diffuser-thousand-rule.ngrok-free.dev 8001"

:: Launch n8n Orchestrator
echo [INFO] Starting n8n orchestration workflow engine ...
start "Traccia n8n Orchestrator" cmd /k "npx n8n"

:: Launch Frontend in current window
echo [INFO] Starting Vite Frontend on http://localhost:5173 ...
echo.
npm run dev

pause
