#!/usr/bin/env python3
"""
Test script to verify the chatbot API integration
"""

import os
import sys
sys.path.append('backend')

# Load environment variables
from dotenv import load_dotenv
load_dotenv('backend/.env')

def test_environment_variables():
    """Test that environment variables are properly loaded"""
    print("Testing Environment Variables...")
    print("=" * 40)
    
    # Check OpenRouter API Key
    api_key = os.getenv('OPENROUTER_API_KEY')
    if api_key:
        print(f"✅ OPENROUTER_API_KEY: {api_key[:20]}... (length: {len(api_key)})")
    else:
        print("❌ OPENROUTER_API_KEY: Not found")
        return False
    
    # Check OpenRouter Model
    model = os.getenv('OPENROUTER_MODEL', 'openai/gpt-4o')
    print(f"✅ OPENROUTER_MODEL: {model}")
    
    return True

def test_openrouter_direct():
    """Test OpenRouter API directly with the provided key"""
    print("\nTesting OpenRouter API Directly...")
    print("=" * 40)
    
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        print("❌ API key not found")
        return False
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
                "X-Title": "Campus Management System",
            },
            model="openai/gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": "What is the capital of India?"
                }
            ],
            max_tokens=300
        )

        response_content = completion.choices[0].message.content
        print("✅ Direct API call successful!")
        print(f"Response: {response_content}")
        return True
        
    except Exception as e:
        print(f"❌ Direct API call failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_server_client():
    """Test the OpenRouter client as configured in the server"""
    print("\nTesting Server OpenRouter Client...")
    print("=" * 40)
    
    try:
        # Import the server module to access its variables
        import backend.server as server
        
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
            
    except Exception as e:
        print(f"❌ Server client test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Chatbot API Integration Test")
    print("=" * 50)
    
    # Test environment variables
    env_success = test_environment_variables()
    
    # Test direct API call
    direct_success = False
    if env_success:
        direct_success = test_openrouter_direct()
    
    # Test server client
    server_success = False
    if env_success:
        server_success = test_server_client()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print(f"Environment Variables: {'✅ PASS' if env_success else '❌ FAIL'}")
    print(f"Direct API Call: {'✅ PASS' if direct_success else '❌ FAIL'}")
    print(f"Server Client: {'✅ PASS' if server_success else '❌ FAIL'}")
    
    if env_success and (direct_success or server_success):
        print("\n🎉 Chatbot API integration is working correctly!")
    else:
        print("\n❌ Chatbot API integration has issues that need to be fixed.")