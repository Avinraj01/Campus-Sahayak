from openai import OpenAI
import os

# Using the API key from environment variables
api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise ValueError("OPENROUTER_API_KEY environment variable not set")

print(f"Using API key: {api_key[:20]}...")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

try:
    completion = client.chat.completions.create(
        extra_headers={
            "HTTP-Referer": "http://localhost:3000",  # Optional: your site URL
            "X-Title": "Campus Management System",      # Optional: your site name
        },
        model="openai/gpt-4o-mini",  # Using gpt-4o-mini as it's more cost-effective
        messages=[
            {
                "role": "user",
                "content": "What is the meaning of life?"
            }
        ],
        max_tokens=150  # Limit tokens to stay within free tier
    )

    print("API Response:")
    print(completion.choices[0].message.content)
    
except Exception as e:
    print(f"Error occurred: {e}")
    print(f"Error type: {type(e)}")