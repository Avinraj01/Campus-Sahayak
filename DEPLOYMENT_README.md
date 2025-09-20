# Campus Management System - Deployment Guide

This document provides instructions for deploying and running the Campus Management System locally and on Render.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Render Deployment](#render-deployment)
3. [Troubleshooting](#troubleshooting)
4. [Testing](#testing)

## Local Development Setup

### Prerequisites
- Python 3.13+
- Node.js 14+
- MongoDB (local or cloud instance)

### Starting the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the server:
   ```bash
   python server.py
   ```

The backend will be available at `http://localhost:8000`

### Starting the Frontend Server

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

### Using the Start Script

For convenience, you can use the provided PowerShell script to start both servers:

```bash
.\start_all.ps1
```

## Render Deployment

### Configuration

The `backend/render.yaml` file has been configured with:

- Python version: 3.13.4 (matches Render's default)
- Build command: `pip install -r backend/requirements.txt`
- Start command: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
- Environment variables for CORS, MongoDB, and API keys

### Deployment Steps

1. Push your changes to the `deploy/render-vercel-ready` branch
2. Render will automatically detect the `render.yaml` file and deploy accordingly
3. Monitor the deployment logs in the Render dashboard

### Environment Variables

Ensure these environment variables are set in Render:

- `CORS_ORIGINS` - Comma-separated list of allowed origins
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret for JWT token signing
- `OPENROUTER_API_KEY` - API key for OpenRouter (optional for AI features)

## Troubleshooting

### Common Issues

1. **Backend won't start**: 
   - Check that all dependencies are installed: `pip install -r requirements.txt`
   - Verify MongoDB connection string in environment variables
   - Check that port 8000 is not already in use

2. **Frontend can't connect to backend**:
   - Verify the proxy configuration in `frontend/craco.config.js`
   - Ensure both servers are running
   - Check browser console for CORS errors

3. **Render deployment fails**:
   - Check that `backend/render.yaml` exists and is properly formatted
   - Verify that the start command references the correct files
   - Check Render logs for specific error messages

### Verification

Run the verification script to test backend endpoints:

```bash
python verify_backend.py
```

## Testing

### Backend Endpoints

Test these key endpoints to verify functionality:

1. `GET /` - Root endpoint with API information
2. `GET /healthz` - Health check endpoint
3. `GET /api/test` - API test endpoint
4. `GET /docs` - Interactive API documentation

### Authentication Flow

1. Register a new user: `POST /api/auth/register`
2. Login with credentials: `POST /api/auth/login`
3. Use the returned JWT token for authenticated requests

### Chat Functionality

1. Send a message: `POST /api/chat`
2. Retrieve chat history: `GET /api/chat/history/{session_id}`

## Support

For issues with deployment or functionality, contact:
- Email: avinyaduvansi123@gmail.com
- Phone: +916200060778
- WhatsApp: +916200060778

## Files Modified for Deployment

1. `backend/render.yaml` - Updated Python version and commands
2. `backend/main.py` - Improved compatibility with Render deployment
3. `RENDER_DEPLOYMENT_FIXES.md` - Documentation of changes
4. `FINAL_DEPLOYMENT_SUMMARY.md` - Complete deployment summary
5. `start_all.ps1` - Script to start both servers
6. `verify_backend.py` - Script to verify backend functionality
7. `DEPLOYMENT_README.md` - This documentation