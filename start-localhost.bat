@echo off
title Birthday Bliss - Localhost Launcher
echo ========================================================
echo   Launching Birthday Bliss on Localhost
echo ========================================================
echo.
echo Starting Backend API (Port 5000)...
start "Birthday Bliss - Backend API (:5000)" cmd /k "cd /d \"%~dp0server\" && npm run dev"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting Frontend Dev Server (Port 5173)...
start "Birthday Bliss - Frontend (:5173)" cmd /k "cd /d \"%~dp0client\" && npm run dev"

echo Waiting for frontend to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ========================================================
echo   Birthday Bliss is now running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:5000
echo ========================================================
pause
