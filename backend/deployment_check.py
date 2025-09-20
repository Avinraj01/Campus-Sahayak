"""
Deployment verification script for Render
This script checks if all required environment variables are set
and if the application can start correctly.
"""

import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Check if all required environment variables are set"""
    print("Checking environment variables...")
    
    required_vars = [
        'OPENROUTER_API_KEY',
        'MONGO_URL',
        'DB_NAME',
        'JWT_SECRET'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.environ.get(var)
        if not value:
            missing_vars.append(var)
            print(f"❌ {var}: NOT SET")
        else:
            # Show first 20 characters for sensitive values
            if var in ['OPENROUTER_API_KEY', 'MONGO_URL', 'JWT_SECRET']:
                display_value = f"{value[:20]}..." if len(value) > 20 else value
            else:
                display_value = value
            print(f"✅ {var}: {display_value}")
    
    if missing_vars:
        print(f"\n⚠️  Warning: Missing environment variables: {missing_vars}")
        print("These will be provided by Render during deployment.")
        return False
    else:
        print("\n✅ All required environment variables are set!")
        return True

def check_imports():
    """Check if all required modules can be imported"""
    print("\nChecking imports...")
    
    required_modules = [
        'fastapi',
        'uvicorn',
        'motor.motor_asyncio',
        'openai',
        'pydantic',
        'passlib.context',
        'jwt',
        'bcrypt'
    ]
    
    failed_imports = []
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module}: OK")
        except ImportError as e:
            failed_imports.append((module, str(e)))
            print(f"❌ {module}: FAILED - {e}")
    
    if failed_imports:
        print(f"\n❌ Failed imports: {failed_imports}")
        return False
    else:
        print("\n✅ All required modules can be imported!")
        return True

def check_files():
    """Check if required files exist"""
    print("\nChecking required files...")
    
    required_files = [
        'server.py',
        'requirements.txt'
    ]
    
    missing_files = []
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file}: EXISTS")
        else:
            missing_files.append(file)
            print(f"❌ {file}: MISSING")
    
    if missing_files:
        print(f"\n❌ Missing files: {missing_files}")
        return False
    else:
        print("\n✅ All required files exist!")
        return True

if __name__ == "__main__":
    print("=== Campus Management System - Deployment Check ===\n")
    
    # Load environment variables if .env file exists
    if os.path.exists('.env'):
        load_dotenv()
        print("Loaded .env file")
    
    env_ok = check_environment()
    imports_ok = check_imports()
    files_ok = check_files()
    
    print("\n=== Summary ===")
    if env_ok and imports_ok and files_ok:
        print("✅ All checks passed! Ready for deployment.")
        sys.exit(0)
    else:
        print("⚠️  Some checks failed. Please review the issues above.")
        sys.exit(1)