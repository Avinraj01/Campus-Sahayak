import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Get the API key from environment variables
api_key = os.getenv("OPENROUTER_API_KEY")

print(f"API Key from environment: {api_key[:20] if api_key else 'None'}...")

# Test the fix we implemented in the chat endpoint
def test_chat_endpoint_fix():
    # This is the same approach we used in the chat endpoint
    current_api_key = os.getenv("OPENROUTER_API_KEY")
    print(f"Current API key from env in test: {current_api_key[:20] if current_api_key else 'None'}...")
    
    # Reinitialize the client with the current API key
    current_openrouter_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=current_api_key or ""
    )
    
    try:
        print("Testing OpenRouter API with fixed client...")
        completion = current_openrouter_client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
                "X-Title": "Campus Management System",
            },
            model="openai/gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": "What is the capital of India?"
                }
            ],
            max_tokens=100
        )
        
        response = completion.choices[0].message.content
        print("API Test with fix Successful!")
        print(f"Response: {response}")
        
    except Exception as e:
        print(f"API Test with fix Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_chat_endpoint_fix()