import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Fetch the API key from environment variables
API_KEY = os.environ.get("OPENROUTER_API_KEY")

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