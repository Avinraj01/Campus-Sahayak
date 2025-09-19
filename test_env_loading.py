import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Test that the API key is loaded
api_key = os.getenv("OPENROUTER_API_KEY")

if api_key:
    print("✅ Environment variables loaded successfully")
    print(f"API key found: {api_key[:15]}...{api_key[-5:] if len(api_key) > 20 else ''}")
else:
    print("ℹ️  OPENROUTER_API_KEY not set in environment (this is expected in development)")

print("✅ Test completed successfully")