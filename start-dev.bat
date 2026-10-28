@echo off
title OfferProof - Internship Verification Assistant
cd /d "%~dp0"

echo ========================================================
echo   OfferProof - Verify before you accept.
echo ========================================================
echo.

:: Ensure Node.js is in PATH
set "PATH=C:\Program Files\nodejs;%PATH%"

:: Verify Node
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in PATH or C:\Program Files\nodejs.
    echo Please install Node.js from https://nodejs.org or restart your terminal.
    pause
    exit /b 1
)

echo [INFO] Starting Next.js development server on http://127.0.0.1:3000 ...
echo [INFO] Press Ctrl+C anytime to stop the server.
echo.

:: Open browser automatically after 2 seconds in the background
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://127.0.0.1:3000"

:: Start Next dev bound strictly to localhost loopback (bypasses Windows firewall prompts)
call npm.cmd run dev -- -H 127.0.0.1 -p 3000

pause
