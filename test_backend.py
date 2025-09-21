import requests
import json

# Test the backend endpoints
def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing backend connectivity...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint status: {response.status_code}")
        if response.status_code == 200:
            print("✓ Backend is running")
        else:
            print("✗ Backend returned error")
    except Exception as e:
        print(f"✗ Backend is not accessible: {e}")
        return
    
    # Test API info endpoint
    try:
        response = requests.get(f"{base_url}/api-info")
        print(f"API info endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ API version: {data.get('version', 'Unknown')}")
        else:
            print("✗ API info endpoint returned error")
    except Exception as e:
        print(f"✗ API info endpoint failed: {e}")
    
    # Test auth endpoints
    try:
        # Test login endpoint (should return 422 for missing data or 401 for invalid credentials)
        response = requests.post(f"{base_url}/api/auth/login", json={})
        print(f"Login endpoint status: {response.status_code}")
        if response.status_code in [422, 401]:
            print("✓ Login endpoint is accessible")
        else:
            print("✗ Login endpoint returned unexpected status")
    except Exception as e:
        print(f"✗ Login endpoint failed: {e}")
    
    try:
        # Test register endpoint (should return 422 for missing data)
        response = requests.post(f"{base_url}/api/auth/register", json={})
        print(f"Register endpoint status: {response.status_code}")
        if response.status_code == 422:
            print("✓ Register endpoint is accessible")
        else:
            print("✗ Register endpoint returned unexpected status")
    except Exception as e:
        print(f"✗ Register endpoint failed: {e}")

if __name__ == "__main__":
    test_backend()