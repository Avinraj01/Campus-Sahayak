import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Fetch the API key from environment variables
API_KEY = os.environ.get("OPENROUTER_API_KEY")

# Check if API key is available
if not API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY not found in environment variables. Please set it in your .env file.")

# Create OpenAI client with OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

# Create completion
completion = client.chat.completions.create(
    extra_headers={
        "HTTP-Referer": "<YOUR_SITE_URL>",  # Optional
        "X-Title": "<YOUR_SITE_NAME>",      # Optional
    },
    model="openai/gpt-4o",
    messages=[
        {"role": "user", "content": "What is the meaning of life?"}
    ]
)

# Print the response
print(completion.choices[0].message.content)