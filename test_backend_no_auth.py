import requests
import json

# Test the backend test-chat endpoint (no auth required)
url = "http://localhost:8000/api/test-chat"

data = {
    "message": "who is the pm of india"
}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Error:", str(e))