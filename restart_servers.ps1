# PowerShell script to restart authentication servers with clean state

Write-Host "=== Campus Management System - Server Restart ===" -ForegroundColor Green

# Kill any existing processes on ports 3000 and 8000
Write-Host "Checking for processes on ports 3000 and 8000..." -ForegroundColor Yellow

# Check for processes on port 3000
$port3000Processes = netstat -ano | findstr :3000
if ($port3000Processes) {
    Write-Host "Found processes on port 3000:" -ForegroundColor Yellow
    Write-Host $port3000Processes
    # Extract PIDs and kill them
    $port3000Processes | ForEach-Object {
        if ($_ -match '\s+(\d+)$') {
            $pid = $matches[1]
            Write-Host "Killing process with PID: $pid" -ForegroundColor Red
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host "No processes found on port 3000" -ForegroundColor Green
}

# Check for processes on port 8000
$port8000Processes = netstat -ano | findstr :8000
if ($port8000Processes) {
    Write-Host "Found processes on port 8000:" -ForegroundColor Yellow
    Write-Host $port8000Processes
    # Extract PIDs and kill them
    $port8000Processes | ForEach-Object {
        if ($_ -match '\s+(\d+)$') {
            $pid = $matches[1]
            Write-Host "Killing process with PID: $pid" -ForegroundColor Red
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host "No processes found on port 8000" -ForegroundColor Green
}

# Wait for processes to terminate
Write-Host "Waiting for processes to terminate..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Servers have been stopped. You can now start them with clean state." -ForegroundColor Green
Write-Host ""
Write-Host "To start the backend server:" -ForegroundColor Cyan
Write-Host "  1. Open a new PowerShell terminal" -ForegroundColor White
Write-Host "  2. Navigate to the backend directory: cd backend" -ForegroundColor White
Write-Host "  3. Run the server: python server.py" -ForegroundColor White
Write-Host ""
Write-Host "To start the frontend server:" -ForegroundColor Cyan
Write-Host "  1. Open another new PowerShell terminal" -ForegroundColor White
Write-Host "  2. Navigate to the frontend directory: cd frontend" -ForegroundColor White
Write-Host "  3. Run the server: yarn start" -ForegroundColor White
Write-Host ""
Write-Host "After both servers are running, visit http://localhost:3000 to test authentication." -ForegroundColor Green