# Render Deployment Fix

## Issue
The 502 error was occurring because Render was looking for a `main:app` entry point, but the application was configured to use `server:app`.

## Solution
1. Created a `main.py` file that imports the FastAPI app from `server.py`
2. Updated `render.yaml` to use `uvicorn main:app` instead of `uvicorn server:app`
3. Added proper health check endpoints

## Files Modified
- `main.py` - New entry point for Render
- `render.yaml` - Updated start command
- `server.py` - Added root and health check endpoints

## Health Check Endpoints
- `/` - Simple root endpoint
- `/health` - Detailed health check
- `/docs` - API documentation
- `/api-info` - API information

## CORS Configuration
The CORS configuration in `render.yaml` allows requests from:
- `http://localhost:3000`
- `http://localhost:8000`
- `https://campus-management-system-ten.vercel.app`
- Additional Vercel deployment URLs

## Environment Variables
Make sure these environment variables are set in Render:
- `OPENROUTER_API_KEY`
- `MONGO_URL`
- `JWT_SECRET`
- `DB_NAME` (defaults to "campusDB")

## Deployment Steps
1. Push changes to your repository
2. Render will automatically deploy the changes
3. Monitor the logs for any errors
4. Test the endpoints to ensure they're working

## Troubleshooting
If you still encounter 502 errors:
1. Check the Render logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure the MongoDB connection string is valid
4. Confirm the OpenRouter API key is valid