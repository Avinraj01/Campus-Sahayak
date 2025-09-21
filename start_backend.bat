@echo off
echo Starting backend server on http://localhost:8000
cd /d "%~dp0\backend"
python start_server.py