"""
Test script to verify the application can start correctly
"""

import os
import sys
import asyncio

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that we can import the main application"""
    try:
        from server import app
        print("✅ Successfully imported FastAPI app")
        return True
    except Exception as e:
        print(f"❌ Failed to import FastAPI app: {e}")
        return False

def test_env_vars():
    """Test that environment variables are accessible"""
    required_vars = ['OPENROUTER_API_KEY', 'MONGO_URL', 'JWT_SECRET']
    
    for var in required_vars:
        value = os.environ.get(var)
        if value:
            print(f"✅ {var}: SET")
        else:
            print(f"⚠️  {var}: NOT SET (will be provided by Render)")
    
    return True

def test_openrouter_client():
    """Test OpenRouter client initialization"""
    try:
        # This is just to check if the module can be imported
        from openai import OpenAI
        print("✅ OpenAI module imported successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to import OpenAI module: {e}")
        return False

if __name__ == "__main__":
    print("=== Testing Backend Deployment Readiness ===\n")
    
    tests = [
        test_imports,
        test_env_vars,
        test_openrouter_client
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {e}")
            results.append(False)
        print()
    
    if all(results):
        print("✅ All tests passed! Backend is ready for deployment.")
        sys.exit(0)
    else:
        print("❌ Some tests failed. Please check the issues above.")
        sys.exit(1)