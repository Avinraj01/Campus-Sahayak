import requests
import json

# Test the chat endpoint
url = "http://localhost:8000/api/test-chat"
payload = {
    "message": "What is the capital of India?"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print("Status Code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", str(e))