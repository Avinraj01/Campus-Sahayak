@echo off
echo Starting Campus Management System
echo ===============================

echo Starting backend server...
cd backend
start "Backend Server" /min cmd /c "python start_server.py"
cd ..

timeout /t 3 /nobreak >nul

echo Starting frontend server...
cd frontend
npm run start