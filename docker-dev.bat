@echo off
echo Starting Ticket Hub Visuals Development Environment...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Build and start the development environment
echo Building Docker image...
docker-compose build

echo.
echo Starting development server...
docker-compose up

echo.
echo Development server stopped.
pause
