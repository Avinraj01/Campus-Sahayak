import requests
import json

print("Testing login/signup functionality...")

# Test the backend endpoints directly to verify they're working
print("1. Testing backend auth endpoints...")

# First, try to register a new user
print("   Registering test user...")
register_data = {
    "email": "test_login@example.com",
    "password": "testpassword123",
    "user_type": "student",
    "full_name": "Test Login User"
}

register_response = requests.post(
    "http://localhost:8000/api/auth/register",
    json=register_data
)

if register_response.status_code == 200:
    print("   ✓ Registration successful!")
    token_data = register_response.json()
    access_token = token_data["access_token"]
    print(f"   Token: {access_token[:20]}...")
    
    # Now test login with the same user
    print("   Testing login...")
    login_data = {
        "identifier": "test_login@example.com",
        "password": "testpassword123",
        "user_type": "student"
    }
    
    login_response = requests.post(
        "http://localhost:8000/api/auth/login",
        json=login_data
    )
    
    if login_response.status_code == 200:
        print("   ✓ Login successful!")
        login_data = login_response.json()
        print(f"   User: {login_data['user']['full_name']}")
    else:
        print(f"   ✗ Login failed: {login_response.status_code}")
        print(f"   Response: {login_response.text}")
else:
    # Check if it's because the user already exists
    if register_response.status_code == 400 and "already registered" in register_response.text.lower():
        print("   User already exists, testing login...")
        
        # Try to login
        login_data = {
            "identifier": "test_login@example.com",
            "password": "testpassword123",
            "user_type": "student"
        }
        
        login_response = requests.post(
            "http://localhost:8000/api/auth/login",
            json=login_data
        )
        
        if login_response.status_code == 200:
            print("   ✓ Login successful!")
            login_data = login_response.json()
            print(f"   User: {login_data['user']['full_name']}")
        else:
            print(f"   ✗ Login failed: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
    else:
        print(f"   ✗ Registration failed: {register_response.status_code}")
        print(f"   Response: {register_response.text}")

print("\nTest completed.")