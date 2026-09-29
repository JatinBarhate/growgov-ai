@echo off
title GrowGov AI - iGOT Karmayogi Competency Platform
cd /d "%~dp0"

echo ======================================================================
echo    GrowGov AI - AI-Enabled Competency Development Platform
echo    iGOT Karmayogi Ecosystem - Government of India
echo ======================================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not detected in your PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

echo [*] Launching GrowGov AI Web Server on http://localhost:3000 ...
echo [*] Automatically opening portal in your default browser...
echo [*] Press Ctrl+C in this window at any time to stop the server.
echo.

:: Automatically launch the browser after a brief delay so the server binds first
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Start the application server
node server.js

pause
