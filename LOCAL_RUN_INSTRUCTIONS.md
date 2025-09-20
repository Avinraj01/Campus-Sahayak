# Local Development Setup

## Prerequisites
1. Python 3.13.4 or later
2. Node.js and npm (or yarn)
3. MongoDB instance (local or cloud)

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```bash
# MongoDB Configuration
MONGO_URI=your-mongodb-connection-string-here

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-here

# OpenRouter API Key (optional, for AI features)
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

### Frontend Environment Variables
The frontend already has a `.env` file configured for local development:
```bash
REACT_APP_BACKEND_URL=http://localhost:8000/api
PORT=3000
```

## Running the Application

### Option 1: Using the provided scripts (Windows)

1. **Run both frontend and backend**:
   Double-click on `start_all.bat` or `start_all.ps1`

2. **Run backend only**:
   Double-click on `start_backend.bat` or `start_backend.ps1`

3. **Run frontend only**:
   Double-click on `start_frontend.bat` or `start_frontend.ps1`

### Option 2: Manual startup

1. **Start the backend server**:
   ```bash
   cd backend
   python start_server.py
   ```
   The backend will be available at http://localhost:8000

2. **Start the frontend server** (in a separate terminal):
   ```bash
   cd frontend
   npm start
   ```
   The frontend will be available at http://localhost:3000

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Backend Docs**: http://localhost:8000/docs

## Testing the Setup

1. Visit http://localhost:8000/ - Should show {"message": "Backend is running"}
2. Visit http://localhost:8000/healthz - Should show {"status": "ok"}
3. Visit http://localhost:3000/ - Should show the frontend application

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Make sure no other applications are using ports 3000 or 8000
   - You can change the ports in the respective configuration files

2. **Missing dependencies**:
   - Backend: `pip install -r backend/requirements.txt`
   - Frontend: `cd frontend && npm install`

3. **MongoDB connection issues**:
   - Verify your MONGO_URI in backend/.env is correct
   - Ensure your MongoDB instance is accessible

4. **CORS errors**:
   - Check that CORS_ORIGINS in backend/.env includes http://localhost:3000

### Windows Execution Policy Issues (PowerShell)

If you encounter issues running the PowerShell scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```