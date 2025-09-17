# API Key Rotation Instructions

If an OpenRouter API key has been leaked or compromised, follow these steps to revoke and rotate it:

1. **Revoke the compromised key**:
   - Go to your OpenRouter account dashboard at https://openrouter.ai/
   - Navigate to the API keys section
   - Find the compromised key and revoke/delete it immediately

2. **Generate a new key**:
   - In the same API keys section, create a new API key
   - Give it a descriptive name (e.g., "campus-management-app-prod")
   - Copy the new key value

3. **Update your environment**:
   - If using local development:
     - Update your `.env` file with the new key value
     - Restart your application
   - If deployed to a cloud platform:
     - Update the environment variable in your deployment settings
     - Redeploy your application

4. **Verify the new key works**:
   - Test your application's chatbot functionality
   - Confirm that API calls are successful with the new key

5. **Security best practices**:
   - Never commit API keys to version control
   - Rotate keys regularly (every 3-6 months)
   - Use different keys for development and production environments
   - Monitor API usage for unusual activity