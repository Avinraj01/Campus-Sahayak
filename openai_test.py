from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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",
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