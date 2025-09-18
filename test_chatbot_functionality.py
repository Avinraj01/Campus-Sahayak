from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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",
)

completion = client.chat.completions.create(
  extra_headers={
    "HTTP-Referer": "http://localhost:3000", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "Campus Management System", # Optional. Site title for rankings on openrouter.ai.
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