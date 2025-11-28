@echo off
setlocal

echo ========================================
echo   Building and Running Email Client
echo ========================================
echo.

echo [1/3] Building React frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    exit /b 1
)
cd ..
echo.

echo [2/3] Frontend built successfully!
echo.

echo [3/3] Starting FastAPI server...
echo.
echo Server will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
cd backend
python -m uvicorn main:app --reload --port 8000
