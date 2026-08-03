@echo off
TITLE Traccia Platform - Launch All Local Services
COLOR 0B
echo ===================================================
echo   TRACCIA PLATFORM - LAUNCH FRONTEND + BACKEND
echo ===================================================
echo.

:: Launch Backend in a new window
echo [INFO] Starting FastAPI Backend on http://localhost:8000 ...
start "Traccia Backend (FastAPI)" cmd /k "start_backend.bat"

:: Launch Frontend in current window
echo [INFO] Starting Vite Frontend on http://localhost:5173 ...
echo.
npm run dev

pause
