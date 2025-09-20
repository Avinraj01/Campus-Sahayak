#!/usr/bin/env python3
"""
Test script to verify OpenRouter API key and functionality
"""

import os
import sys

# Add the backend directory to the path and load environment variables
sys.path.append('backend')
from dotenv import load_dotenv
load_dotenv('backend/.env')  # Load .env from backend directory

from openai import OpenAI

def test_openrouter():
    """Test OpenRouter API key and basic functionality"""
    
    # Get API key from environment
    api_key = os.getenv("OPENROUTER_API_KEY")
    
    if not api_key:
        print("❌ OPENROUTER_API_KEY not found in environment variables")
        return False
    
    print(f"✅ OPENROUTER_API_KEY found: {api_key[:20]}...")
    
    # Test basic API call
    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )
        
        print("✅ OpenRouter client created successfully")
        
        # Test a simple completion
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "user", "content": "List the first 3 Prime Ministers of India?"}
            ],
            max_tokens=200
        )
        
        answer = response.choices[0].message.content
        print("✅ API call successful!")
        print(f"Response: {answer}")
        return True
        
    except Exception as e:
        print(f"❌ OpenRouter API test failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing OpenRouter API...")
    print("=" * 30)
    success = test_openrouter()
    
    if success:
        print("\n✅ OpenRouter is working correctly!")
    else:
        print("\n❌ OpenRouter is not working. Please check your API key.")