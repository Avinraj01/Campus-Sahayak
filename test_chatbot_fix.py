#!/usr/bin/env python3
"""
Test script to verify chatbot functionality after fixes
"""

import os
import sys

# Add the backend directory to the path and load environment variables
sys.path.append('backend')
from dotenv import load_dotenv
load_dotenv('backend/.env')  # Load .env from backend directory

sys.path.append('backend')  # Add backend to path

from backend.server import validate_api_key, OPENROUTER_API_KEY

def test_api_key_validation():
    """Test API key validation function"""
    
    print("Testing API Key Validation...")
    print("=" * 30)
    
    # Test with the actual API key
    if OPENROUTER_API_KEY:
        print(f"✅ OPENROUTER_API_KEY loaded: {OPENROUTER_API_KEY[:20]}...")
        is_valid = validate_api_key(OPENROUTER_API_KEY)
        print(f"✅ API key validation result: {is_valid}")
    else:
        print("❌ OPENROUTER_API_KEY not found")
        return False
    
    # Test with empty key
    empty_result = validate_api_key("")
    print(f"✅ Empty key validation result: {empty_result}")
    
    # Test with None
    none_result = validate_api_key(None)
    print(f"✅ None key validation result: {none_result}")
    
    return True

def test_environment_variables():
    """Test that all required environment variables are set"""
    
    print("\nTesting Environment Variables...")
    print("=" * 30)
    
    required_vars = [
        "OPENROUTER_API_KEY",
        "MONGO_URL",
        "DB_NAME",
        "JWT_SECRET"
    ]
    
    all_good = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: {'*' * 20}{value[-5:] if len(value) > 5 else value}")
        else:
            print(f"❌ {var}: NOT SET")
            all_good = False
    
    return all_good

if __name__ == "__main__":
    print("Testing Chatbot Fixes...")
    print("=" * 50)
    
    # Test API key validation
    validation_success = test_api_key_validation()
    
    # Test environment variables
    env_success = test_environment_variables()
    
    if validation_success and env_success:
        print("\n✅ All tests passed! Chatbot should be working correctly.")
        print("\nTo test the chatbot, start the server and try asking:")
        print("- 'List the first 3 Prime Ministers of India?'")
        print("- 'What are the library hours?'")
        print("- 'When is the fee payment deadline?'")
    else:
        print("\n❌ Some tests failed. Please check the output above.")