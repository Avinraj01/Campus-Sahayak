#!/usr/bin/env python3
"""
Test script to verify backend environment variables and MongoDB connectivity.
"""

import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient
import pymongo.errors

def test_env_variables():
    """Test that all required environment variables are loaded correctly."""
    print("🔍 Testing environment variables...")
    
    # Load environment variables from backend/.env
    load_dotenv("backend/.env")
    
    # Also load from root .env as fallback
    load_dotenv(".env", override=False)
    
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
                if var == "OPENROUTER_API_KEY":
                    # Check if it looks like a valid API key
                    if value.startswith("sk-or-v1-") and len(value) > 32:
                        results[var] = {"status": "✅", "value": f"{value[:20]}... (valid format)", "issue": None}
                    else:
                        results[var] = {"status": "❌", "value": "Invalid format", "issue": "Invalid format"}
                elif var == "JWT_SECRET":
                    # Check if JWT_SECRET is strong enough (at least 10 characters)
                    if len(value) >= 10:
                        results[var] = {"status": "✅", "value": f"{value[:10]}... (hidden)", "issue": None}
                    else:
                        results[var] = {"status": "❌", "value": "Too short", "issue": "Too short"}
                elif var == "MONGO_URL":
                    # Check if MONGO_URL is pointing to Atlas
                    if "mongodb+srv://" in value:
                        results[var] = {"status": "✅", "value": "MongoDB Atlas connection", "issue": None}
                    else:
                        results[var] = {"status": "❌", "value": "Not Atlas connection", "issue": "Not Atlas"}
                else:
                    results[var] = {"status": "✅", "value": f"{value[:20]}..." if len(value) > 20 else value, "issue": None}
        else:
            results[var] = {"status": "❌", "value": "Not set", "issue": "Missing"}
    
    return results

def test_mongo_connection():
    """Test MongoDB connection using the MONGO_URL from environment."""
    print("\n🔍 Testing MongoDB connection...")
    
    # Load environment variables
    load_dotenv("backend/.env")
    load_dotenv(".env", override=False)
    
    mongo_url = os.getenv("MONGO_URL")
    
    if not mongo_url:
        print("  ❌ MONGO_URL not found in environment variables")
        return False
    
    print(f"  📍 Connecting to: {mongo_url.split('@')[0]}@***")
    
    try:
        # Use synchronous MongoDB client for testing to avoid event loop conflicts
        from pymongo import MongoClient
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("  ✅ MongoDB connection successful")
        return True
    except pymongo.errors.ServerSelectionTimeoutError:
        print("  ❌ MongoDB connection timeout - check connection string or network")
        return False
    except Exception as e:
        print(f"  ❌ MongoDB connection failed: {e}")
        return False

def main():
    """Main test function."""
    print("🚀 Campus Management System Backend Environment Test")
    print("=" * 55)
    
    # Test environment variables
    env_results = test_env_variables()
    
    # Test MongoDB connection
    mongo_ok = test_mongo_connection()
    
    # Summary
    print("\n" + "=" * 55)
    print("📋 TEST SUMMARY")
    print("=" * 55)
    
    print("\n🔑 Environment Variables:")
    for var, result in env_results.items():
        print(f"  {result['status']} {var}: {result['value']}")
    
    print(f"\n🗄️  Database Connectivity:")
    print(f"  {'✅' if mongo_ok else '❌'} MongoDB connection")
    
    # Overall status
    all_env_ok = all(result['issue'] is None for result in env_results.values())
    
    print(f"\n🏁 OVERALL STATUS:")
    if all_env_ok and mongo_ok:
        print("  ✅ All environment variables are correctly set and MongoDB connection is working!")
        print("     Backend is ready for deployment.")
    else:
        print("  ❌ Issues found:")
        if not all_env_ok:
            print("     - Some environment variables have issues")
        if not mongo_ok:
            print("     - MongoDB connection failed")
        print("     Please check the ❌ items above.")
    
    return all_env_ok and mongo_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)