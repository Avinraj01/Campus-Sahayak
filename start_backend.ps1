# Script to start the backend server
Set-Location -Path "backend"
Write-Host "Starting backend server on http://localhost:8000" -ForegroundColor Green
python start_server.py