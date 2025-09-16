# Deployment Configuration Summary

This document summarizes the changes made to configure the project for deployment to Render with proper environment variable management.

## Changes Made

### 1. Created `.env.example` file

Created a new `.env.example` file in the `backend` directory with all required environment variables:

```env
# Environment variables for Campus Management System

# CORS Origins - comma-separated list of allowed origins
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/campus_management
DB_NAME=campus_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# OpenRouter API Key for AI chat functionality
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key-here

# Optional: DeepSeek API Key (alternative AI provider)
# DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
```

### 2. Updated CORS configuration in `server.py`

Modified the CORS middleware configuration to use environment variables:

**Before:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**After:**
```python
# Get CORS origins from environment variable, fallback to localhost if not set
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:8000')
allow_origins = [origin.strip() for origin in CORS_ORIGINS.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Updated README.md

Added a reference to the deployment documentation in the main README file.

### 4. Created DEPLOYMENT.md

Created comprehensive deployment documentation with instructions for setting up environment variables on Render.

## Required Environment Variables

The following environment variables must be configured for deployment:

1. **CORS_ORIGINS** - Comma-separated list of allowed origins for CORS
2. **DB_NAME** - Name of your MongoDB database
3. **JWT_SECRET** - Secret key for JWT token generation
4. **MONGO_URL** - MongoDB connection string
5. **OPENROUTER_API_KEY** - API key for OpenRouter AI services

## Security

The `.env` file is already included in the `.gitignore` file, ensuring that sensitive configuration values will not be committed to version control.

## Render Deployment Instructions

1. Go to your Render dashboard
2. Navigate to your web service
3. Click on "Environment" in the sidebar
4. Add each of the required environment variables:
   - CORS_ORIGINS
   - DB_NAME
   - JWT_SECRET
   - MONGO_URL
   - OPENROUTER_API_KEY
5. Configure your service with:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

## Local Development

For local development, create a `.env` file in the backend directory with your actual values:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
MONGO_URL=mongodb://localhost:27017/campus_management
DB_NAME=campus_management
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key-here
```

Note: The `.env` file will not be committed to version control due to the `.gitignore` configuration.