@echo off
echo Starting Jyotish Daily...
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
start http://localhost:8000
python -m http.server 8000
