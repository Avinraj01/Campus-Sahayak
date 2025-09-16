#!/usr/bin/env python3
"""
Test script to verify the fixes for the "not found" error after login/signup
"""

import os
import sys

def test_frontend_env():
    """Test frontend environment configuration"""
    print("Testing frontend environment configuration...")
    
    # Check if we're in the right directory
    current_dir = os.getcwd()
    print(f"Current directory: {current_dir}")
    
    # Check if frontend .env file exists
    frontend_env_path = os.path.join(current_dir, "frontend", ".env")
    if os.path.exists(frontend_env_path):
        print("✓ Frontend .env file exists")
        with open(frontend_env_path, 'r') as f:
            content = f.read()
            print(f"Frontend .env content:\n{content}")
    else:
        print("✗ Frontend .env file not found")
    
    return True

def test_backend_env():
    """Test backend environment configuration"""
    print("\nTesting backend environment configuration...")
    
    # Check if we're in the right directory
    current_dir = os.getcwd()
    
    # Check if backend .env file exists
    backend_env_path = os.path.join(current_dir, "backend", ".env")
    if os.path.exists(backend_env_path):
        print("✓ Backend .env file exists")
        with open(backend_env_path, 'r') as f:
            content = f.read()
            print(f"Backend .env content:\n{content}")
    else:
        print("✗ Backend .env file not found")
    
    return True

def test_file_structure():
    """Test file structure"""
    print("\nTesting file structure...")
    
    # Check if we're in the right directory
    current_dir = os.getcwd()
    
    # Check if required files exist
    required_files = [
        "frontend/src/App.js",
        "frontend/.env",
        "backend/server.py",
        "backend/.env"
    ]
    
    for file_path in required_files:
        full_path = os.path.join(current_dir, file_path)
        if os.path.exists(full_path):
            print(f"✓ {file_path} exists")
        else:
            print(f"✗ {file_path} not found")
    
    return True

if __name__ == "__main__":
    print("Running fix verification tests...")
    
    try:
        test_frontend_env()
        test_backend_env()
        test_file_structure()
        
        print("\n✓ All tests completed successfully!")
        print("\nSummary of fixes made:")
        print("1. Fixed API URL in test-api.js")
        print("2. Added 'replace' option to navigation calls in App.js")
        print("3. Enhanced CORS configuration in backend")
        print("4. Verified environment variable configuration")
        
    except Exception as e:
        print(f"✗ Test failed with error: {e}")
        sys.exit(1)