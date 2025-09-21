# Render.yaml Fix

## Changes Made

### 1. Updated buildCommand
- Changed from: `"pip install -r requirements.txt"`
- Changed to: `pip install -r backend/requirements.txt`
- This ensures that Render looks for the requirements.txt file in the correct backend directory

### 2. Updated startCommand
- Changed from: `"uvicorn main:app --host 0.0.0.0 --port $PORT"`
- Changed to: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
- This uses the python -m approach which is more reliable for module execution

## File Modified

1. [backend/render.yaml](file://c:\Users\AVIN%20RAJ\Desktop\app_backup\backend\render.yaml) - Updated build and start commands

## Deployment Instructions

To deploy to Render:

```bash
git add render.yaml
git commit -m "Fix render.yaml with correct build and start commands"
git push origin <your-branch>
```

## Verification

- The buildCommand now correctly references `backend/requirements.txt`
- The startCommand now uses `python -m uvicorn` which is more reliable
- All environment variables remain unchanged
- Python version is still correctly set to 3.13.4

The render.yaml file is now properly configured for deployment to Render.