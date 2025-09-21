# Campus Management System - Backend Deployment

## Render Deployment Instructions

This document provides instructions for deploying the backend to Render.

### Deployment Configuration

The application is configured to work with Render using the following settings:

1. **Build Command**: `pip install -r requirements.txt`
2. **Start Command**: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
3. **Python Version**: 3.13.4 (specified in render.yaml)

### Environment Variables

The following environment variables must be set in Render:

- `OPENROUTER_API_KEY` - Your OpenRouter API key for AI chatbot functionality
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name (default: campusDB)
- `JWT_SECRET` - Secret key for JWT token signing
- `CORS_ORIGINS` - Comma-separated list of allowed origins

### Health Checks

Render will use the `/health` endpoint to check the application status.

### File Structure

```
backend/
├── server.py          # Main FastAPI application
├── main.py            # Entry point for Render
├── start_server.py    # Alternative entry point
├── requirements.txt   # Python dependencies
├── render.yaml        # Render deployment configuration
├── .env.example       # Example environment variables
└── DEPLOYMENT.md      # This file
```

### Local Development

To run locally:

```bash
cd backend
pip install -r requirements.txt
python server.py
```

Or using uvicorn directly:

```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

### Troubleshooting

1. **Import Errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`
2. **Environment Variables**: Check that all required environment variables are set
3. **Port Issues**: Render provides the PORT environment variable - don't hardcode ports
4. **CORS Issues**: Verify CORS_ORIGINS includes your frontend URLs

### Deployment Verification

Run the deployment check script to verify configuration:

```bash
cd backend
python deployment_check.py
```