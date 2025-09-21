import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Get the API key from environment variables
api_key = os.getenv("OPENROUTER_API_KEY")

print(f"API Key loaded: {api_key[:20]}..." if api_key else "No API key found")

# Initialize the OpenAI client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

try:
    print("Testing OpenRouter API...")
    completion = client.chat.completions.create(
        extra_headers={
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Campus Management System",
        },
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
    print("API Test Successful!")
    print(f"Response: {response}")
    
except Exception as e:
    print(f"API Test Failed: {e}")