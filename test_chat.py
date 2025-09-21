import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from the backend directory
load_dotenv("backend/.env")

# Also try loading from the current directory if we're already in backend
if not os.getenv("OPENROUTER_API_KEY"):
    load_dotenv(".env")

# Get the API key from environment
api_key = os.getenv("OPENROUTER_API_KEY")

print("OpenRouter API Key:", api_key[:20] if api_key else "Not set")

if not api_key or api_key == "sk-or-v1-YOUR_VALID_API_KEY_HERE":
    print("Please set a valid OPENROUTER_API_KEY in backend/.env to test the chat functionality")
    print("Get your API key from https://openrouter.ai/")
else:
    # Test the chat endpoint
    url = "http://localhost:8000/api/test-chat"
    headers = {"Content-Type": "application/json"}
    data = {"message": "What is the capital of India?"}

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        print("Status Code:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        print("Error:", str(e))