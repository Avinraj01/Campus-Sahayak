#!/usr/bin/env python3
"""
Direct test of OpenRouter API with the provided key
"""

from openai import OpenAI
import os

def test_openrouter_direct():
    """Test OpenRouter API directly with the provided key"""
    
    # Use the exact key and configuration from the user
    api_key = "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"
    
    print("Testing OpenRouter API directly...")
    print(f"API Key: {api_key[:20]}...")
    
    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
                "X-Title": "Campus Management System",
            },
            model="openai/gpt-4o",  # Use the same model as in the example
            messages=[
                {
                    "role": "user",
                    "content": "What is the capital of India?"
                }
            ],
            max_tokens=300
        )

        response_content = completion.choices[0].message.content
        print("✅ API call successful!")
        print(f"Response: {response_content}")
        return True
        
    except Exception as e:
        print(f"❌ API call failed: {e}")
        return False

if __name__ == "__main__":
    print("Direct OpenRouter API Test")
    print("=" * 30)
    success = test_openrouter_direct()
    
    if success:
        print("\n✅ OpenRouter API is working correctly!")
    else:
        print("\n❌ OpenRouter API is not working. Please check the key or account status.")