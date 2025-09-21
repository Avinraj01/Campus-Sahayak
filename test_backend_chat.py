import requests
import json

# Test the test-chat endpoint (no authentication required)
print("Testing /api/test-chat endpoint...")
try:
    response = requests.post(
        "http://localhost:8000/api/test-chat",
        json={"message": "What is the capital of India?"}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*50 + "\n")

# Test the main chat endpoint with a mock user
print("Testing /api/chat endpoint with mock authentication...")
try:
    # First, let's register a test user to get a token
    register_response = requests.post(
        "http://localhost:8000/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "user_type": "student",
            "full_name": "Test User"
        }
    )
    
    if register_response.status_code == 200:
        token_data = register_response.json()
        access_token = token_data["access_token"]
        print(f"Successfully registered user and obtained token")
        
        # Now test the chat endpoint
        chat_response = requests.post(
            "http://localhost:8000/api/chat",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "message": "What is the capital of India?",
                "session_id": "test-session-123"
            }
        )
        
        print(f"Chat Status Code: {chat_response.status_code}")
        print(f"Chat Response: {chat_response.json()}")
    else:
        print(f"Failed to register user: {register_response.status_code}")
        print(f"Response: {register_response.text}")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()