import requests
import json
import uuid

# First, let's register a user
register_url = "http://localhost:8000/api/auth/register"
register_payload = {
    "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
    "password": "testpassword",
    "user_type": "student",
    "full_name": "Test User"
}

try:
    print("Registering user...")
    register_response = requests.post(register_url, json=register_payload)
    print("Register Status Code:", register_response.status_code)
    
    if register_response.status_code == 200:
        token_data = register_response.json()
        access_token = token_data.get("access_token")
        print("Registration successful, got token")
        print("User ID:", token_data["user"]["id"])
        
        # Now test the chat endpoint
        chat_url = "http://localhost:8000/api/chat"
        chat_payload = {
            "message": "What is the capital of India?",
            "session_id": f"test_session_{uuid.uuid4().hex[:8]}",
            "language": "en"
        }
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        print("Sending chat message...")
        chat_response = requests.post(chat_url, json=chat_payload, headers=headers)
        print("Chat Status Code:", chat_response.status_code)
        if chat_response.status_code == 200:
            chat_data = chat_response.json()
            print("Chat Response:", chat_data["response"])
        else:
            print("Chat failed:", chat_response.text)
    else:
        print("Registration failed:", register_response.json())
        
except Exception as e:
    print("Error:", str(e))