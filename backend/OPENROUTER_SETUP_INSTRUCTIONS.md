# OpenRouter API Key Setup Instructions

## How to Get Your OpenRouter API Key

1. **Sign up for an OpenRouter account**:
   - Go to https://openrouter.ai/
   - Click on "Sign Up" to create an account

2. **Get your API key**:
   - After logging in, go to your account dashboard
   - Look for the "API Keys" section
   - Generate a new API key
   - Copy the API key (it will look something like `sk-or-v1-...`)

3. **Configure your .env file**:
   - Open the `.env` file in the `backend` directory
   - Replace `your_actual_api_key_here` with your actual API key
   - Save the file

## Example .env Configuration

```
# OpenRouter API Key - Get yours at https://openrouter.ai/
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

## Testing Your Setup

1. **Restart the backend server**:
   - Stop the current backend server (Ctrl+C)
   - Start it again with `python server.py`

2. **Test the chat functionality**:
   - Open your frontend application
   - Try asking a question in the chat
   - You should now get a proper AI response instead of the fallback message

## Troubleshooting

If you're still getting the fallback message:

1. **Check that your API key is correct**:
   - Make sure you copied the entire key
   - Ensure there are no extra spaces

2. **Verify the .env file is being loaded**:
   - Check the backend console output when starting the server
   - You should see a message like "OpenRouter API Key loaded: sk-or-v1-..."

3. **Check your internet connection**:
   - Ensure your server can reach https://openrouter.ai/api/v1

4. **Verify your API key has credits**:
   - Check your OpenRouter dashboard to ensure your key has available credits

## Security Note

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore` to prevent accidental commits
- Rotate your API keys regularly for security