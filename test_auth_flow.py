import requests
import json

# Base URL for the backend API
BASE_URL = "http://localhost:8000/api"

# Test user data
test_user = {
    "email": "testuser@example.com",
    "password": "testpassword123",
    "user_type": "student",
    "full_name": "Test User"
}

print("Testing authentication flow...")

# Step 1: Register a new user
print("\n1. Registering new user...")
try:
    register_response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
    print(f"Register status code: {register_response.status_code}")
    print(f"Register response: {json.dumps(register_response.json(), indent=2)}")
    
    if register_response.status_code == 200:
        print("✓ Registration successful")
        auth_data = register_response.json()
        token = auth_data.get("access_token")
        print(f"Token: {token[:20]}..." if token else "No token")
    else:
        print("✗ Registration failed")
except Exception as e:
    print(f"✗ Registration error: {e}")

# Step 2: Login with the same credentials
print("\n2. Logging in with same credentials...")
login_data = {
    "identifier": test_user["email"],
    "password": test_user["password"],
    "user_type": test_user["user_type"]
}

try:
    login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login status code: {login_response.status_code}")
    print(f"Login response: {json.dumps(login_response.json(), indent=2)}")
    
    if login_response.status_code == 200:
        print("✓ Login successful")
    else:
        print("✗ Login failed")
except Exception as e:
    print(f"✗ Login error: {e}")

# Step 3: Check users in memory
print("\n3. Checking users in memory...")
try:
    debug_response = requests.get(f"{BASE_URL}/debug/users")
    print(f"Debug status code: {debug_response.status_code}")
    print(f"Debug response: {json.dumps(debug_response.json(), indent=2)}")
except Exception as e:
    print(f"✗ Debug error: {e}")