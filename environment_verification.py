#!/usr/bin/env python3
"""
Verification script for Campus Management System environment setup.
"""

import os
import sys
from dotenv import load_dotenv

def check_env_variables():
    """Check that all required environment variables exist and are properly configured."""
    print("🔍 Checking environment variables...")
    
    # Load environment variables
    load_dotenv()
    
    required_vars = [
        "OPENROUTER_API_KEY",
        "MONGO_URL", 
        "JWT_SECRET",
        "CORS_ORIGINS"
    ]
    
    results = {}
    
    for var in required_vars:
        value = os.getenv(var)
        if value and value.strip():
            # Check if it's still a placeholder
            if "your-" in value or value == "change-me-in-prod" or value == "your-secret-key-here-change-in-production":
                results[var] = {"status": "❌", "value": "Placeholder value", "issue": "Placeholder"}
            else:
                # Additional checks for specific variables
                if var == "JWT_SECRET":
                    # Check if JWT_SECRET is strong enough (at least 10 characters)
                    if len(value) >= 10:
                        results[var] = {"status": "✅", "value": f"{value[:10]}... (hidden)", "issue": None}
                    else:
                        results[var] = {"status": "❌", "value": "Too short", "issue": "Too short"}
                elif var == "MONGO_URL":
                    # Check if MONGO_URL is pointing to Atlas (not localhost)
                    if "mongodb+srv://" in value:
                        results[var] = {"status": "✅", "value": "MongoDB Atlas connection", "issue": None}
                    elif "localhost" in value or "127.0.0.1" in value:
                        results[var] = {"status": "⚠️", "value": "Local MongoDB connection", "issue": "Local connection"}
                    else:
                        results[var] = {"status": "✅", "value": "Remote MongoDB connection", "issue": None}
                else:
                    results[var] = {"status": "✅", "value": f"{value[:20]}..." if len(value) > 20 else value, "issue": None}
        else:
            results[var] = {"status": "❌", "value": "Not set", "issue": "Missing"}
    
    return results

def check_backend_port_config():
    """Check that backend uses dynamic port assignment."""
    print("\n🔍 Checking backend port configuration...")
    
    try:
        with open("backend/server.py", "r", encoding="utf-8") as f:
            content = f.read()
            
        # Check for dynamic port assignment
        if 'port = int(os.environ.get("PORT", 8000))' in content and 'uvicorn.run(app, host="0.0.0.0", port=port' in content:
            print("  ✅ Backend uses dynamic port assignment")
            return True
        else:
            print("  ❌ Backend does not use dynamic port assignment")
            return False
    except Exception as e:
        print(f"  ❌ Error reading backend/server.py: {e}")
        return False

def check_api_key_security():
    """Scan Python files for hardcoded API keys."""
    print("\n🔍 Scanning for hardcoded API keys...")
    
    # List of Python files to check
    python_files = [
        "campus_assistant_chatbot.py",
        "fixed_chatbot_client.py", 
        "interactive_campus_assistant.py",
        "test_chatbot_functionality.py",
        "test_openrouter_simple.py",
        "backend/server.py",
        "backend/secure_chatbot.py",
        "backend/refactored_openrouter_client.py",
        "backend/test_api_key.py",
        "secure_openai_test.py"
    ]
    
    hardcoded_keys_found = []
    
    for file_name in python_files:
        try:
            if os.path.exists(file_name):
                with open(file_name, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                # Check for hardcoded API keys
                if 'sk-or-v1-' in content and 'os.getenv("OPENROUTER_API_KEY")' not in content and 'os.environ.get("OPENROUTER_API_KEY")' not in content:
                    # More specific check for actual hardcoded keys
                    import re
                    hardcoded_pattern = r'["\'][^"\']*sk-or-v1-[a-zA-Z0-9]{10,}["\']'
                    if re.search(hardcoded_pattern, content):
                        hardcoded_keys_found.append(file_name)
        except Exception as e:
            print(f"  ⚠️  Error reading {file_name}: {e}")
    
    if hardcoded_keys_found:
        print(f"  ❌ Hardcoded API keys found in: {', '.join(hardcoded_keys_found)}")
        return False
    else:
        print("  ✅ No hardcoded API keys found")
        return True

def check_frontend_config():
    """Check frontend configuration."""
    print("\n🔍 Checking frontend configuration...")
    
    # Check frontend .env file
    frontend_env_path = "frontend/.env"
    if os.path.exists(frontend_env_path):
        with open(frontend_env_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "REACT_APP_BACKEND_URL" in content:
            print("  ✅ Frontend .env file exists with backend URL configuration")
            
            # Check if it points to the correct backend
            if "http://localhost:8000/api" in content:
                print("  ✅ Frontend configured to connect to local backend")
            else:
                print("  ℹ️  Frontend backend URL may need adjustment for deployment")
                
            return True
        else:
            print("  ❌ Frontend .env missing REACT_APP_BACKEND_URL")
            return False
    else:
        print("  ❌ Frontend .env file not found")
        return False

def check_cors_configuration():
    """Check CORS configuration."""
    print("\n🔍 Checking CORS configuration...")
    
    try:
        with open("backend/server.py", "r", encoding="utf-8") as f:
            content = f.read()
            
        # Check if CORS_ORIGINS is loaded from environment
        if "CORS_ORIGINS = os.environ.get('CORS_ORIGINS'" in content:
            print("  ✅ Backend loads CORS_ORIGINS from environment variables")
            
            # Check if localhost:3000 is included
            if "http://localhost:3000" in content:
                print("  ✅ Backend includes localhost:3000 in CORS origins")
            else:
                print("  ⚠️  Backend may not include localhost:3000 in CORS origins")
                
            return True
        else:
            print("  ❌ Backend does not load CORS_ORIGINS from environment")
            return False
    except Exception as e:
        print(f"  ❌ Error reading backend/server.py: {e}")
        return False

def main():
    """Main verification function."""
    print("🚀 Campus Management System Environment Verification")
    print("=" * 55)
    
    # Check environment variables
    env_results = check_env_variables()
    
    # Check backend port configuration
    port_ok = check_backend_port_config()
    
    # Check API key security
    api_security_ok = check_api_key_security()
    
    # Check frontend configuration
    frontend_ok = check_frontend_config()
    
    # Check CORS configuration
    cors_ok = check_cors_configuration()
    
    # Summary
    print("\n" + "=" * 55)
    print("📋 VERIFICATION SUMMARY")
    print("=" * 55)
    
    print("\n🔑 Environment Variables:")
    for var, result in env_results.items():
        print(f"  {result['status']} {var}: {result['value']}")
    
    print(f"\n🖥️  Backend Configuration:")
    print(f"  {'✅' if port_ok else '❌'} Dynamic port assignment")
    print(f"  {'✅' if cors_ok else '❌'} CORS configuration")
    
    print(f"\n🔒 Security:")
    print(f"  {'✅' if api_security_ok else '❌'} No hardcoded API keys")
    
    print(f"\n🌐 Frontend:")
    print(f"  {'✅' if frontend_ok else '❌'} Frontend configuration")
    
    # Overall readiness
    all_checks = [
        port_ok,
        api_security_ok,
        frontend_ok,
        cors_ok
    ]
    
    # Count successful checks
    success_count = sum(1 for check in all_checks if check)
    
    # Check if critical environment variables are properly set
    critical_env_ok = all(result['issue'] is None for result in env_results.values())
    
    print(f"\n🏁 DEPLOYMENT READINESS:")
    if success_count == len(all_checks) and critical_env_ok:
        print("  ✅ System is ready for deployment!")
        print("     - Backend: Ready for Render deployment")
        print("     - Frontend: Ready for Vercel deployment")
    else:
        print(f"  ⚠️  System needs fixes before deployment")
        print("     Issues found:")
        if not critical_env_ok:
            print("     - Environment variables need proper values")
        if success_count < len(all_checks):
            print(f"     - {len(all_checks) - success_count} configuration issues found")
    
    print("\n💡 Recommendations:")
    print("  1. Replace placeholder values in .env with real values")
    print("  2. For MongoDB Atlas, update the connection string with actual credentials")
    print("  3. Ensure all environment variables are set in deployment platforms")
    print("  4. Test API endpoints after deployment")

if __name__ == "__main__":
    main()