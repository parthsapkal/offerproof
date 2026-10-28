@echo off
title OfferProof Production Server
cd /d "%~dp0"

echo ========================================================
echo   OfferProof (Production Mode)
echo ========================================================
echo.

set "PATH=C:\Program Files\nodejs;%PATH%"

echo [INFO] Starting production server on http://127.0.0.1:3000 ...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://127.0.0.1:3000"

call npm.cmd run start -- -H 127.0.0.1 -p 3000
pause
