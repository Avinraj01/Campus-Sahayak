import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Test that the API key is loaded
api_key = os.environ.get("OPENROUTER_API_KEY")
if api_key:
    print("✅ API key loaded successfully")
    print(f"Key preview: {api_key[:15]}...{api_key[-5:]}")
else:
    print("❌ API key not found")

# Check if .env file exists
if os.path.exists(".env"):
    print("✅ .env file exists")
else:
    print("❌ .env file not found")

# Additional validation
if api_key and api_key.startswith("sk-or-v1-"):
    print("✅ API key format looks correct")
else:
    print("⚠️  API key format may be incorrect")

# Test DeepSeek API key if it exists
deepseek_key = os.environ.get("DEEPSEEK_API_KEY")
if deepseek_key:
    print("✅ DeepSeek API key found")
    print(f"DeepSeek key preview: {deepseek_key[:15]}...{deepseek_key[-5:]}")
else:
    print("ℹ️  DeepSeek API key not found (optional)")