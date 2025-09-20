#!/usr/bin/env python3
"""
Test the OpenRouter client as configured in the server
"""

import os
import sys
sys.path.append('backend')

# Load environment variables
from dotenv import load_dotenv
load_dotenv('backend/.env')

# Import the server module to access its variables
import backend.server as server

def test_server_openrouter():
    """Test the OpenRouter client as configured in the server"""
    
    print("Testing Server OpenRouter Configuration...")
    print("=" * 40)
    
    # Print environment variables
    print(f"OPENROUTER_API_KEY: {server.OPENROUTER_API_KEY[:20] if server.OPENROUTER_API_KEY else 'None'}...")
    print(f"DEEPSEEK_API_KEY: {server.DEEPSEEK_API_KEY[:20] if server.DEEPSEEK_API_KEY else 'None'}...")
    print(f"OPENROUTER_MODEL: {server.OPENROUTER_MODEL}")
    
    # Check if OpenRouter client is available
    if server.openrouter_client:
        print("✅ OpenRouter client is available")
        
        # Test a simple API call
        try:
            model_name = "deepseek-chat" if (server.DEEPSEEK_API_KEY and server.DEEPSEEK_API_KEY.startswith('sk-')) else server.OPENROUTER_MODEL
            print(f"Using model: {model_name}")
            
            response = server.openrouter_client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
                    "X-Title": "Campus Management System",
                },
                model=model_name,
                messages=[
                    {
                        "role": "user",
                        "content": "What is the capital of India?"
                    }
                ],
                max_tokens=300
            )
            
            response_content = response.choices[0].message.content
            print("✅ Server OpenRouter API call successful!")
            print(f"Response: {response_content}")
            return True
            
        except Exception as e:
            print(f"❌ Server OpenRouter API call failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    else:
        print("❌ OpenRouter client is not available")
        return False

if __name__ == "__main__":
    print("Server OpenRouter Client Test")
    print("=" * 30)
    success = test_server_openrouter()
    
    if success:
        print("\n✅ Server OpenRouter client is working correctly!")
    else:
        print("\n❌ Server OpenRouter client is not working.")