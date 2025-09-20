#!/usr/bin/env python3
"""
Script to test the deployed backend endpoints
"""

import requests
import time

def test_deployed_backend():
    """Test the deployed backend endpoints"""
    
    # Use the Render deployed URL
    base_url = "https://campus-management-backend-3x1h.onrender.com"
    
    # Test endpoints
    endpoints = [
        ("/", "Root endpoint"),
        ("/healthz", "Health check"),
        ("/api/test", "API test endpoint"),
    ]
    
    print(f"Testing deployed backend at {base_url}...\n")
    
    for endpoint, description in endpoints:
        try:
            url = base_url + endpoint
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                print(f"✅ {description} ({endpoint}): SUCCESS")
                print(f"   Response: {response.json()}")
            else:
                print(f"⚠️  {description} ({endpoint}): HTTP {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ {description} ({endpoint}): CONNECTION FAILED")
        except requests.exceptions.Timeout:
            print(f"❌ {description} ({endpoint}): TIMEOUT")
        except Exception as e:
            print(f"❌ {description} ({endpoint}): ERROR - {str(e)}")
        
        print()  # Empty line for readability
    
    print("Deployed backend testing complete!")

if __name__ == "__main__":
    print("Campus Management System - Deployed Backend Test")
    print("=" * 50)
    test_deployed_backend()