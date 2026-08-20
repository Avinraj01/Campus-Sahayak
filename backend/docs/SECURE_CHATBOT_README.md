# Secure Chatbot Implementation

This implementation removes the hard-coded OpenRouter API key and loads it from an environment variable instead.

## Changes Made

1. ✅ Removed the hard-coded API key
2. ✅ Added code to load the API key from an environment variable called `OPENROUTER_API_KEY`
3. ✅ Used `load_dotenv()` and `os.getenv("OPENROUTER_API_KEY")` to fetch the key
4. ✅ Created a `.env.example` file with:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
5. ✅ Verified `.env` is listed in `.gitignore` so it won't be committed
6. ✅ Kept the rest of the code structure the same

## Usage

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace `your_api_key_here` with your actual OpenRouter API key

3. Run the chatbot:
   ```bash
   python secure_chatbot.py
   ```

## Security

- The `.env` file is included in `.gitignore` and will not be committed to version control
- API keys are loaded from environment variables using `python-dotenv`
- Never hardcode sensitive credentials in the source code