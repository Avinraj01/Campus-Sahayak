# PowerShell script to start both backend and frontend servers for Campus Management System

Write-Host "=== Campus Management System - Starting Servers ===" -ForegroundColor Green

# Kill any existing processes on ports 3000 and 8000
Write-Host "Checking for processes on ports 3000 and 8000..." -ForegroundColor Yellow

# Function to kill processes on a specific port
function Kill-ProcessesOnPort($port) {
    $processes = netstat -ano | findstr ":$port"
    if ($processes) {
        Write-Host "Found processes on port $port:" -ForegroundColor Yellow
        Write-Host $processes
        # Extract PIDs and kill them
        $processes | ForEach-Object {
            if ($_ -match '\s+(\d+)$') {
                $pid = $matches[1]
                Write-Host "Killing process with PID: $pid" -ForegroundColor Red
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    } else {
        Write-Host "No processes found on port $port" -ForegroundColor Green
    }
}

# Kill processes on both ports
Kill-ProcessesOnPort 3000
Kill-ProcessesOnPort 8000

# Wait for processes to terminate
Write-Host "Waiting for processes to terminate..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start backend server in background
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "server.py" -WorkingDirectory ".\backend"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server in background
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Set-Location -Path ".\frontend"
Start-Process -NoNewWindow -FilePath "yarn" -ArgumentList "start"

Write-Host ""
Write-Host "=== Servers Started Successfully ===" -ForegroundColor Green
Write-Host "Backend server running on http://localhost:8000" -ForegroundColor White
Write-Host "Frontend server running on http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Visit http://localhost:3000 in your browser to access the application" -ForegroundColor Green
Write-Host "Note: It may take a few seconds for both servers to fully initialize" -ForegroundColor Yellow