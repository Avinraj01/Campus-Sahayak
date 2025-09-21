#!/usr/bin/env python3
"""
Test script to verify authentication system is working correctly
"""
import requests
import time
import json

# Configuration
BASE_URL = "http://localhost:8000/api"
TEST_USER = {
    "email": "testuser@example.com",
    "password": "testpassword123",
    "full_name": "Test User",
    "user_type": "student"
}

def test_backend_connection():
    """Test if backend is accessible"""
    try:
        response = requests.get("http://localhost:8000/api-info")
        if response.status_code == 200:
            print("✅ Backend server is running")
            return True
        else:
            print(f"❌ Backend server returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server. Make sure it's running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")
        return False

def test_registration():
    """Test user registration"""
    try:
        print("Testing user registration...")
        response = requests.post(f"{BASE_URL}/auth/register", json=TEST_USER)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Registration successful")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Full Name: {data['user']['full_name']}")
            print(f"   User Type: {data['user']['user_type']}")
            return data['access_token']
        else:
            print(f"❌ Registration failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error during registration: {e}")
        return None

def test_login(token):
    """Test user login"""
    try:
        print("Testing user login...")
        login_data = {
            "identifier": TEST_USER["email"],
            "password": TEST_USER["password"],
            "user_type": TEST_USER["user_type"]
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Full Name: {data['user']['full_name']}")
            print(f"   User Type: {data['user']['user_type']}")
            
            # Verify token matches
            if data['access_token'] == token:
                print("   Token verification: ⚠️  Same token (expected for immediate login after registration)")
            else:
                print("   Token verification: ✅ New token generated")
                
            return True
        else:
            print(f"❌ Login failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return False

def test_protected_endpoint(token):
    """Test accessing a protected endpoint"""
    try:
        print("Testing protected endpoint access...")
        headers = {"Authorization": f"Bearer {token}"}
        
        # This is a simple test - we'll use the debug endpoint
        response = requests.get(f"{BASE_URL}/debug/users", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Protected endpoint access successful")
            print(f"   Total users in system: {data['total_users']}")
            return True
        else:
            print(f"❌ Protected endpoint access failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error accessing protected endpoint: {e}")
        return False

def main():
    print("=== Authentication System Test ===\n")
    
    # Test backend connection
    if not test_backend_connection():
        print("\n❌ Backend server is not accessible. Please start the backend server first.")
        return
    
    print()
    
    # Test registration
    token = test_registration()
    if not token:
        print("\n❌ Registration test failed. Cannot proceed with login test.")
        return
    
    print()
    
    # Wait a moment
    time.sleep(1)
    
    # Test login
    if not test_login(token):
        print("\n❌ Login test failed.")
        return
    
    print()
    
    # Test protected endpoint
    if not test_protected_endpoint(token):
        print("\n❌ Protected endpoint test failed.")
        return
    
    print("\n=== All Tests Passed ===")
    print("✅ Authentication system is working correctly!")
    print("\nYou can now use the frontend at http://localhost:3000")
    print("Try registering a new user and logging in.")

if __name__ == "__main__":
    main()