@echo off
title Cinema Studio - Starting...

echo ========================================
echo   CINEMA STUDIO - Quick Start
echo ========================================
echo.

:: Start the dev server in background
echo [1/3] Starting dev server...
start "Video Studio Dev Server" cmd /c "cd /d C:\Users\yodes\Documents\n8n\video-studio && npm run dev"

:: Wait for server to start
echo [2/3] Waiting for server to start...
timeout /t 5 /nobreak >nul

:: Open browser
echo [3/3] Opening Cinema Studio...
start http://localhost:3000/cinema

echo.
echo ========================================
echo   SERVER RUNNING!
echo ========================================
echo.
echo   URL: http://localhost:3000/cinema
echo   (If port 3000 is busy, check console for actual port)
echo.
echo   Login: admin / admin123
echo.
echo ========================================
echo   TO RESUME CLAUDE CODE:
echo ========================================
echo.
echo   cd C:\Users\yodes\Documents\n8n\video-studio
echo   claude
echo.
echo   Then say: "Continue working on Cinema Studio"
echo.
echo ========================================
echo.
pause
