import requests
import json

# Test login with wrong password
login_url = "http://localhost:8001/api/auth/login"

# Login data with wrong password
login_data = {
    "identifier": "test@example.com",
    "password": "wrongpassword",
    "user_type": "student"
}

print("Testing login with wrong password...")
try:
    response = requests.post(login_url, json=login_data)
    print(f"Login status code: {response.status_code}")
    print(f"Login response: {response.json()}")
    if response.status_code == 401:
        print("Correctly rejected login with wrong password!")
    else:
        print("ERROR: Should have rejected login with wrong password!")
except Exception as e:
    print(f"Login failed: {e}")