import requests
import json

# First, let's login to get a token
login_url = "http://localhost:8000/api/auth/login"
login_payload = {
    "identifier": "test@example.com",
    "password": "testpassword",
    "user_type": "student"
}

try:
    # Try to login first
    login_response = requests.post(login_url, json=login_payload)
    print("Login Status Code:", login_response.status_code)
    
    if login_response.status_code == 200:
        token_data = login_response.json()
        access_token = token_data.get("access_token")
        print("Login successful, got token")
        
        # Now test the chat endpoint
        chat_url = "http://localhost:8000/api/chat"
        chat_payload = {
            "message": "What is the capital of India?",
            "session_id": "test_session_123",
            "language": "en"
        }
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        chat_response = requests.post(chat_url, json=chat_payload, headers=headers)
        print("Chat Status Code:", chat_response.status_code)
        print("Chat Response:", chat_response.json())
    else:
        print("Login failed:", login_response.json())
        
except Exception as e:
    print("Error:", str(e))