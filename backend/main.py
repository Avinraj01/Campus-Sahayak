# This file is specifically for Render deployment
# Render expects a main.py file in the backend directory

from server import app

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get port from environment variable (Render provides this)
    port = int(os.environ.get("PORT", 8000))
    
    # Run the app with proper configuration for Render
    uvicorn.run(
        app,  # Direct reference to the app instance
        host="0.0.0.0",
        port=port,
        workers=1,  # Use single worker for free tier
        log_level="info",
        timeout_keep_alive=5,  # Reduce keep-alive timeout
        timeout_graceful_shutdown=10  # Add graceful shutdown timeout
    )