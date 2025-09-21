import os
# Load environment variables from the backend directory
from dotenv import load_dotenv
load_dotenv("backend/.env")

# Get the API key
api_key = os.environ.get("OPENROUTER_API_KEY")
print(f"API Key loaded: {api_key[:20] if api_key else 'None'}...")

if not api_key:
    print("ERROR: OPENROUTER_API_KEY not found in environment variables")
    exit(1)

# Initialize the client
from openai import OpenAI
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

try:
    # Test the API
    print("Testing OpenRouter API...")
    completion = client.chat.completions.create(
        model="openai/gpt-4o",
        messages=[
            {
                "role": "user",
                "content": "What is the capital of India?"
            }
        ],
        max_tokens=100
    )
    
    response = completion.choices[0].message.content
    print(f"Success! Response: {response}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()