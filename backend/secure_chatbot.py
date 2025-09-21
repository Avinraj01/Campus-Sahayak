# Security Note: Never commit API keys or other secrets to version control.
# If a key is leaked, immediately revoke it and generate a new one.
# Rotate keys regularly for enhanced security.

import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Fetch API key from environment variable
API_KEY = os.getenv("OPENROUTER_API_KEY")

# Check if API key is available
if not API_KEY:
    raise RuntimeError(
        "OPENROUTER_API_KEY environment variable not set. "
        "Please create a .env file with your API key or set the environment variable. "
        "Example: OPENROUTER_API_KEY=sk-or-v1-...your-api-key-here..."
    )

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=API_KEY,
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "<YOUR_SITE_URL>", 
    "X-Title": "<YOUR_SITE_NAME>", 
  },
  model="openai/gpt-4o",
  messages=[
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
)

print(completion.choices[0].message.content)