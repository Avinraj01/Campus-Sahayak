import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Fetch the API key from environment variables
API_KEY = os.environ.get("OPENROUTER_API_KEY")

# If API key is not found in environment, use the provided key as fallback
# but this is not recommended for production
if not API_KEY:
    print("Warning: Using hardcoded API key. This is not secure!")
    API_KEY = "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"

# Create OpenAI client with OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

completion = client.chat.completions.create(
    extra_headers={
        "HTTP-Referer": "http://localhost:3000",  # Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "Campus Management System",  # Optional. Site title for rankings on openrouter.ai.
    },
    model="openai/gpt-4o",
    messages=[
        {
            "role": "user",
            "content": "What is the meaning of life?"
        }
    ],
    max_tokens=500  # Limit tokens to stay within free tier limits
)

print(completion.choices[0].message.content)