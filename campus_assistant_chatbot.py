import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Fetch the API key from environment variables
API_KEY = os.environ.get("OPENROUTER_API_KEY")

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
    print("Ask me anything!")
    print("\n")
    
    # Example question from your query
    question = "name the pm of india ?"
    print(f"Question: {question}")
    
    response = get_ai_response(question)
    print(f"\n{response}")

if __name__ == "__main__":
    main()