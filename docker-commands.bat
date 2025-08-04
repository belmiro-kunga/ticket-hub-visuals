@echo off
echo Ticket Hub Visuals - Docker Commands
echo ====================================
echo.
echo Available commands:
echo 1. Start development server
echo 2. Stop development server
echo 3. Rebuild Docker image
echo 4. View logs
echo 5. Access container shell
echo 6. Clean up (remove containers and images)
echo 0. Exit
echo.

set /p choice="Enter your choice (0-6): "

if "%choice%"=="1" (
    echo Starting development server...
    docker-compose up -d
    echo Server started! Access at http://localhost:8080
) else if "%choice%"=="2" (
    echo Stopping development server...
    docker-compose down
    echo Server stopped.
) else if "%choice%"=="3" (
    echo Rebuilding Docker image...
    docker-compose build --no-cache
    echo Image rebuilt successfully.
) else if "%choice%"=="4" (
    echo Showing logs...
    docker-compose logs -f ticket-hub-visuals
) else if "%choice%"=="5" (
    echo Accessing container shell...
    docker-compose exec ticket-hub-visuals sh
) else if "%choice%"=="6" (
    echo Cleaning up Docker resources...
    docker-compose down
    docker system prune -f
    echo Cleanup completed.
) else if "%choice%"=="0" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please try again.
)

echo.
pause
