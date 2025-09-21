import requests
import json

# First, register a user
register_url = "http://localhost:8000/api/auth/register"
register_data = {
    "email": "chatuser4@example.com",
    "password": "password123",
    "user_type": "student",
    "full_name": "Chat User 4"
}

print("Registering user...")
register_response = requests.post(register_url, json=register_data)
print("Register status:", register_response.status_code)

if register_response.status_code == 200:
    token = register_response.json()["access_token"]
    print("Got token:", token[:20] + "...")
    
    # Now test the chat endpoint with authentication
    chat_url = "http://localhost:8000/api/chat"
    chat_data = {
        "message": "What is the capital of India?",
        "session_id": "test_session_123",
        "language": "en"
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print("\nTesting chat endpoint...")
    chat_response = requests.post(chat_url, json=chat_data, headers=headers)
    print("Chat status:", chat_response.status_code)
    
    if chat_response.status_code == 200:
        print("Chat response:", chat_response.json())
    else:
        print("Chat error:", chat_response.text)
else:
    print("Registration failed:", register_response.text)