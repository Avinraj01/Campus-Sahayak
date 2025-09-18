import requests
import json

# Test the backend chat endpoint
url = "http://localhost:8000/api/openai-test"

try:
    response = requests.post(url)
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Error:", str(e))