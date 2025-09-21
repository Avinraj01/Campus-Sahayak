#!/usr/bin/env python3
"""
Script to verify that the backend server is running properly
"""

import requests
import time

def test_backend_endpoints():
    """Test various backend endpoints to verify functionality"""
    
    base_url = "http://localhost:8000"
    
    # Test endpoints
    endpoints = [
        ("/", "Root endpoint"),
        ("/healthz", "Health check"),
        ("/health", "Alternative health check"),
        ("/api/test", "API test endpoint"),
        ("/docs", "API documentation"),
    ]
    
    print("Testing backend endpoints...\n")
    
    for endpoint, description in endpoints:
        try:
            url = base_url + endpoint
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                print(f"✅ {description} ({endpoint}): SUCCESS")
                if endpoint in ["/", "/api/test", "/healthz", "/health"]:
                    print(f"   Response: {response.json()}")
            else:
                print(f"⚠️  {description} ({endpoint}): HTTP {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ {description} ({endpoint}): CONNECTION FAILED - Server may not be running")
        except requests.exceptions.Timeout:
            print(f"❌ {description} ({endpoint}): TIMEOUT - Server may be unresponsive")
        except Exception as e:
            print(f"❌ {description} ({endpoint}): ERROR - {str(e)}")
        
        print()  # Empty line for readability
    
    print("Backend verification complete!")

if __name__ == "__main__":
    print("Campus Management System - Backend Verification")
    print("=" * 50)
    test_backend_endpoints()