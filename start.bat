@echo off
title Discord Bot Starter
echo Starting the bot...
echo.

REM Check if Node.js is installed
node -v
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b
)

REM Start the bot
node index.js

echo.
echo Bot has stopped. Press any key to exit...
pause >nul
