import requests
import json

# Test registration endpoint
url = "http://localhost:8000/api/auth/register"
data = {
    "email": "test4@example.com",
    "password": "testpass123",
    "user_type": "student",
    "full_name": "Test User 4",
    "phone": "1234567890"
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Registration successful!")
        print(f"Response data: {response.json()}")
    else:
        print("❌ Registration failed!")
        
except Exception as e:
    print(f"Error: {e}")