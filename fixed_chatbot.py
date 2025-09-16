import os
from dotenv import load_dotenv
from openai import OpenAI
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

def create_chatbot_client():
    """
    Create and return an OpenAI client configured for OpenRouter
    """
    api_key = os.environ.get("OPENROUTER_API_KEY")
    
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment variables!")
    
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
    
    return client

def send_message_to_chatbot(client, message, model="openai/gpt-4o-mini"):
    """
    Send a message to the chatbot and return the response
    
    Args:
        client: OpenAI client instance
        message (str): User's message
        model (str): Model to use for completion
    
    Returns:
        str: Assistant's response or fallback message if error occurs
    """
    try:
        logger.info(f"Sending message to chatbot: {message}")
        
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
                "X-Title": "Campus Management System",
            },
            model=model,
            messages=[
                {"role": "user", "content": message}
            ],
            max_tokens=300
        )
        
        response = completion.choices[0].message.content
        logger.info(f"Received response from chatbot: {response}")
        return response
        
    except Exception as e:
        logger.error(f"Error communicating with OpenRouter API: {e}")
        # Return a fallback message only when API fails
        return "I'm currently experiencing technical difficulties with the AI service. Please contact our admin office at +916200060778 for immediate assistance."

def main():
    """
    Main function to demonstrate the chatbot functionality
    """
    try:
        # Create the chatbot client
        client = create_chatbot_client()
        print("✅ Chatbot client initialized successfully")
        
        # Test message
        user_message = "What is the meaning of life?"
        print(f"📤 Sending message: {user_message}")
        
        # Get response from chatbot
        response = send_message_to_chatbot(client, user_message)
        print(f"📥 Chatbot response: {response}")
        
    except ValueError as ve:
        print(f"❌ Configuration Error: {ve}")
        print("Please ensure you have set the OPENROUTER_API_KEY in your .env file")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

if __name__ == "__main__":
    main()