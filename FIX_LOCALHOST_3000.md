# Fix for http://localhost:3000 Issue

This document explains how to fix the http://localhost:3000 issue and start both backend and frontend servers properly.

## Problem Analysis

The issue with http://localhost:3000 typically occurs due to one of the following reasons:
1. The frontend server is not running
2. The backend server is not running or not accessible
3. Port conflicts (another application using port 3000 or 8000)
4. CORS configuration issues
5. Environment variable misconfiguration

## Solution

### Step 1: Use the Start Script

We've created a PowerShell script [start_servers.ps1](start_servers.ps1) that will:
1. Kill any existing processes on ports 3000 and 8000
2. Start the backend server (FastAPI) on port 8000
3. Start the frontend server (React) on port 3000

To run the script:
```powershell
.\start_servers.ps1
```

### Step 2: Manual Start (Alternative)

If you prefer to start the servers manually:

#### Start Backend Server:
```powershell
cd backend
python server.py
```

#### Start Frontend Server (in a separate terminal):
```powershell
cd frontend
yarn start
```

### Step 3: Verify Configuration

#### Backend Configuration (.env):
Ensure your [backend/.env](backend/.env) file has the correct CORS configuration:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

#### Frontend Configuration (.env):
Ensure your [frontend/.env](frontend/.env) file has the correct backend URL:
```
REACT_APP_BACKEND_URL=http://localhost:8000/api
PORT=3000
```

### Step 4: Access the Application

After both servers are running:
1. Open your browser
2. Navigate to http://localhost:3000
3. The application should load properly

## Troubleshooting

### If the frontend doesn't load:
1. Check that both servers are running without errors
2. Verify that ports 3000 and 8000 are not blocked by firewall
3. Check browser console for any error messages

### If login/registration doesn't work:
1. Ensure the backend server is accessible at http://localhost:8000
2. Check that MongoDB is running (or the application is using in-memory storage)
3. Verify that the OpenRouter API key is valid in the backend .env file

### If you see CORS errors:
1. Check that CORS_ORIGINS in backend/.env includes http://localhost:3000
2. Verify that the backend server has restarted after any .env changes

## Additional Notes

- The application uses CRACO for the frontend build system
- The backend uses FastAPI with Uvicorn server
- Authentication is handled with JWT tokens
- The chatbot feature requires a valid OpenRouter API key