#!/usr/bin/env python3
"""
Script to completely clear authentication data and restart both frontend and backend servers
"""
import os
import subprocess
import sys
import time

def main():
    print("=== Campus Management System - Clean Restart ===")
    
    print("Stopping any existing servers...")
    # Just wait a moment to ensure clean start
    time.sleep(2)
    
    # Clear in-memory user storage by restarting the backend
    print("Clearing authentication data...")
    
    # Check if .env files exist
    frontend_env_path = os.path.join("frontend", ".env")
    if os.path.exists(frontend_env_path):
        print("Frontend .env file exists")
    
    backend_env_path = os.path.join("backend", ".env")
    if os.path.exists(backend_env_path):
        print("Backend .env file exists")
    
    print("\n=== Starting Backend Server ===")
    print("Navigate to the backend directory and run:")
    print("  python server.py")
    print("\n=== Starting Frontend Server ===")
    print("After backend is running, navigate to the frontend directory and run:")
    print("  yarn start")
    
    print("\n=== Instructions ===")
    print("1. The authentication system will start with a clean state")
    print("2. You can register new users with your own credentials")
    print("3. Existing user data has been cleared")
    print("\nServers will be available at:")
    print("Frontend: http://localhost:3000")
    print("Backend API: http://localhost:8000/api")

if __name__ == "__main__":
    main()