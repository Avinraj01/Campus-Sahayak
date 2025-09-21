import requests
import json

# Test the frontend chat functionality by simulating what the frontend does
print("Testing frontend chat fix...")

# First, let's register a test user to get a token
print("1. Registering test user...")
register_response = requests.post(
    "http://localhost:8000/api/auth/register",
    json={
        "email": "frontend_test@example.com",
        "password": "testpassword",
        "user_type": "student",
        "full_name": "Frontend Test User"
    }
)

if register_response.status_code == 200:
    token_data = register_response.json()
    access_token = token_data["access_token"]
    print(f"   Successfully registered user and obtained token: {access_token[:10]}...")
    
    # Now test the chat endpoint the same way the frontend would
    print("2. Testing chat endpoint...")
    chat_response = requests.post(
        "http://localhost:8000/api/chat",  # This is what the frontend will request after our fix
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "message": "What is the capital of India?",
            "session_id": "frontend-test-session-123"
        }
    )
    
    print(f"   Chat Status Code: {chat_response.status_code}")
    if chat_response.status_code == 200:
        chat_data = chat_response.json()
        print(f"   Chat Response: {chat_data['response']}")
        print("   SUCCESS: Chat functionality is working correctly!")
    else:
        print(f"   ERROR: {chat_response.text}")
else:
    print(f"   ERROR: Failed to register user: {register_response.status_code}")
    print(f"   Response: {register_response.text}")

print("\nTest completed.")