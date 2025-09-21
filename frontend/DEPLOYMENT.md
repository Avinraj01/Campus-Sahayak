# Deployment Instructions

## Vercel Deployment

This application is configured to be deployed on Vercel with serverless functions for the backend API.

### Environment Variables

Before deploying, make sure to set the following environment variables in your Vercel project settings:

1. `OPENROUTER_API_KEY` - Your OpenRouter API key (get it from https://openrouter.ai/)
2. `MONGO_URL` - Your MongoDB connection string
3. `DB_NAME` - Your MongoDB database name
4. `JWT_SECRET` - A secret key for JWT token generation

### Deployment Steps

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. In the project settings, go to "Environment Variables" and add the required variables listed above
6. Deploy the project

### Local Development

For local development, create a `.env.local` file in the frontend directory with the following variables:

```
MONGO_URL=your_mongodb_connection_string
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Security Checklist

- [ ] The OpenRouter API key is only stored in Vercel environment variables, never in the code
- [ ] The frontend never sees the API key - only the serverless functions in `/api` have access
- [ ] All secrets are in `.gitignore` and not committed to the repository
- [ ] JWT_SECRET is changed from the default in production

### API Endpoints

The following API endpoints are available:

- `/api/auth/login` - POST - User login
- `/api/auth/register` - POST - User registration
- `/api/chat` - POST - Chat with AI assistant
- `/api/complaints` - GET/POST - Get user complaints / Submit new complaint
- `/api/forms` - GET/POST - Get user forms / Submit new form
- `/api/notices` - GET - Get campus notices

All endpoints (except `/api/notices` and authentication endpoints) require a valid JWT token in the Authorization header.