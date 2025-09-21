import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Fetch the API key from environment variables
API_KEY = os.environ.get("OPENROUTER_API_KEY")

# If API key is not found in environment, use the provided key as fallback
# but this is not recommended for production
if not API_KEY:
    print("Warning: Using hardcoded API key. This is not secure!")
    API_KEY = "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"

# Create OpenAI client with OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

def get_ai_response(question):
    """
    Get response from AI for a given question
    """
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "http://localhost:3000",  # Optional. Site URL for rankings on openrouter.ai.
                "X-Title": "Campus Management System",  # Optional. Site title for rankings on openrouter.ai.
            },
            model="openai/gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": question
                }
            ],
            max_tokens=500  # Limit tokens to stay within free tier limits
        )
        return completion.choices[0].message.content
    except Exception as e:
        # Return fallback response if AI service is unavailable
        return f"I'm experiencing some technical difficulties with the AI service right now. However, I can still help you with basic campus information:\n\n" \
               f"📞 Contact Information:\n" \
               f"- Admin Office: Room 205 (9 AM - 5 PM)\n" \
               f"- Email: avinyaduvansi123@gmail.com\n" \
               f"- Phone: +916200060778\n" \
               f"- WhatsApp: +916200060778\n\n" \
               f"🏫 Campus Facilities:\n" \
               f"- Library: 8 AM - 10 PM\n" \
               f"- Fee payment deadline: March 15th, 2025 (Late fee: ₹500)\n" \
               f"- Scholarship deadline: March 10th, 2025\n\n" \
               f"For urgent matters, please contact the admin office directly."

def main():
    print("AI Campus Assistant")
    print("Ask me anything! (Type 'quit' to exit)")
    print("\n")
    
    while True:
        try:
            question = input("Your question: ").strip()
            
            if question.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not question:
                continue
                
            print("Thinking...")
            response = get_ai_response(question)
            print(f"\n{response}\n")
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()