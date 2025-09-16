#!/usr/bin/env python3
from openai import OpenAI

# Test the new configuration
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

completion = client.chat.completions.create(
    extra_headers={
        "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
        "X-Title": "Campus Management System",
    },
    model="openai/gpt-4o",
    messages=[
        {
            "role": "user",
            "content": "What is the meaning of life?"
        }
    ],
    max_tokens=100
)

print("✅ Chatbot API Test Results:")
print(f"Model: openai/gpt-4o")
print(f"Response: {completion.choices[0].message.content}")
print(f"API Base URL: https://openrouter.ai/api/v1")
print(f"API Key: {client.api_key[:20]}...")