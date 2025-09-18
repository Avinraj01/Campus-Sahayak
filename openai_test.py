import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.environ.get("OPENROUTER_API_KEY"),
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "Campus Management System", # Optional. Site title for rankings on openrouter.ai.
  },
  model="openai/gpt-4o",
  messages=[
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ],
  max_tokens=500  # Reduce token limit to stay within credit limits
)

print(completion.choices[0].message.content)