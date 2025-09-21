# Script to start both frontend and backend servers
# Usage: .\start_all.ps1

Write-Host "Starting Campus Management System..." -ForegroundColor Green

# Start backend server in background
Write-Host "Starting backend server on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; python server.py" -WindowStyle Normal

# Wait a few seconds for backend to start
Start-Sleep -Seconds 5

# Start frontend server
Write-Host "Starting frontend server on port 3000..." -ForegroundColor Yellow
Set-Location -Path "$PWD\frontend"
npm start

Write-Host "Both servers should now be running!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan