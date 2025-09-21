import requests
import json

# Test registration
register_url = "http://localhost:8001/api/auth/register"
login_url = "http://localhost:8001/api/auth/login"

# Registration data
register_data = {
    "email": "test@example.com",
    "password": "testpassword",
    "user_type": "student",
    "full_name": "Test User"
}

print("Testing registration...")
try:
    response = requests.post(register_url, json=register_data)
    print(f"Registration status code: {response.status_code}")
    print(f"Registration response: {response.json()}")
    registration_success = response.status_code == 200
except Exception as e:
    print(f"Registration failed: {e}")
    registration_success = False

# Login data
login_data = {
    "identifier": "test@example.com",
    "password": "testpassword",
    "user_type": "student"
}

if registration_success:
    print("\nTesting login...")
    try:
        response = requests.post(login_url, json=login_data)
        print(f"Login status code: {response.status_code}")
        print(f"Login response: {response.json()}")
        if response.status_code == 200:
            print("Login successful!")
        else:
            print("Login failed!")
    except Exception as e:
        print(f"Login failed: {e}")
else:
    print("Skipping login test due to registration failure")