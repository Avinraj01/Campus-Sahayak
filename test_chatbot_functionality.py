from openai import OpenAI
import os

# Get API key from environment variables
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    raise ValueError("OPENROUTER_API_KEY environment variable not set")

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=api_key,
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "http://localhost:3000", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "Campus Management System", # Optional. Site title for rankings on openrouter.ai.
  },
  model="openai/gpt-4o-mini",  # Changed to gpt-4o-mini for cost-effectiveness
  messages=[
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ],
  max_tokens=150  # Reduced tokens to stay within free tier limits
)

print(completion.choices[0].message.content)