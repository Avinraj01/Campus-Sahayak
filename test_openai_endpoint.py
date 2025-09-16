import requests
import json

# Test the new OpenAI endpoint
url = "http://localhost:8000/api/openai-test"

print("Testing the OpenAI endpoint...")
print(f"Sending POST request to: {url}")

try:
    response = requests.post(url)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("Response:")
        print(json.dumps(data, indent=2))
    else:
        print(f"Error: {response.text}")
        
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
except Exception as e:
    print(f"An error occurred: {e}")