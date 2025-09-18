# Deployment Guide for Campus Management System

This guide explains how to deploy the Campus Management System to various hosting platforms.

## Prerequisites

1. A hosting platform account (Render, Heroku, AWS, etc.)
2. A MongoDB database (MongoDB Atlas or self-hosted)
3. An OpenRouter API key (https://openrouter.ai/)

## Environment Variables

When deploying to any platform, you must set the following environment variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins | `https://your-frontend-domain.com,http://localhost:3000` |
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `DB_NAME` | Database name | `campus_management` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-random-secret-key` |
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-v1-xxxxxxxxxxxxxxxxxxxx` |

## General Deployment Steps

### 1. Prepare Your Hosting Platform

1. Create an account on your preferred hosting platform
2. Create a new web service or application
3. Connect your GitHub repository or upload your code

### 2. Configure the Service

- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python server.py` or `uvicorn server:app --host 0.0.0.0 --port $PORT`
- **Instance Type**: Free or Standard (based on your needs)

### 3. Set Environment Variables

In your hosting platform's environment configuration section, add all the required variables listed above.

### 4. Configure Auto-Deploy

Enable auto-deploy from your preferred branch (usually `main` or `master`).

### 5. Deploy

Follow your hosting platform's deployment process to start the deployment.

## MongoDB Atlas Setup

If using MongoDB Atlas:

1. Create a new cluster or use an existing one
2. Create a database user with read/write permissions
3. Add your hosting service IP to the IP whitelist (or use 0.0.0.0/0 for testing)
4. Get the connection string and set it as `MONGO_URL` in your hosting platform

## Custom Domain (Optional)

1. In your hosting platform dashboard, go to your web service
2. Look for custom domain settings
3. Add your domain and follow the DNS instructions provided by your platform

## Health Checks

The application includes a health check endpoint at the root (`/`) that returns API information.
Most hosting platforms will automatically use this to check service health.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGINS` includes your frontend domain
2. **Database Connection**: Verify `MONGO_URL` is correct and the database is accessible
3. **API Key Issues**: Check that `OPENROUTER_API_KEY` is valid and has credits
4. **Startup Failures**: Check logs in your hosting platform dashboard for error messages

### Viewing Logs

1. Go to your service in your hosting platform dashboard
2. Look for a "Logs" or "Monitoring" section to view real-time application logs
3. Look for error messages to diagnose issues

## Scaling

For production use, consider:

1. Upgrading to a paid hosting plan for better performance
2. Using a dedicated MongoDB instance
3. Adding monitoring and alerting
4. Setting up backup strategies

## Support

For support, contact: avinyaduvansi123@gmail.com