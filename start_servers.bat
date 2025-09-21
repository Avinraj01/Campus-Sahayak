@echo off
echo Starting Campus Management System servers...
echo.

echo Starting backend server on port 8000...
start "Backend Server" /D "%~dp0backend" cmd /k "python server.py"

echo.
echo Starting frontend server on port 3000...
start "Frontend Server" /D "%~dp0frontend" cmd /k "npx craco start"

echo.
echo Servers started successfully!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
pause