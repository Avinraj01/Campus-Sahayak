import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Fetch the API key from environment variables
API_KEY = os.environ.get("OPENROUTER_API_KEY")

print(f"API Key loaded: {'Yes' if API_KEY else 'No'}")
if API_KEY:
    print(f"API Key: {API_KEY[:10]}...{API_KEY[-5:]}")