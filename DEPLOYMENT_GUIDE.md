# Deployment Guide

This guide explains how to deploy the Campus Management System to Render (backend) and Vercel (frontend).

## Backend Deployment to Render

### Prerequisites
1. A Render account
2. MongoDB Atlas account with a database cluster
3. OpenRouter API key

### Steps

1. **Fork or push this repository to GitHub**

2. **Create a new Web Service on Render**
   - Go to https://dashboard.render.com/select-repo?type=web
   - Select your repository
   - Choose "Python" as the runtime

3. **Configure the Web Service**
   - Name: `campus-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Auto-Deploy: Yes

4. **Add Environment Variables**
   Add the following environment variables in the Render dashboard:
   
   | Key | Value | Type |
   |-----|-------|------|
   | `CORS_ORIGINS` | `https://campus-management-system-ten.vercel.app` | Environment |
   | `MONGO_URL` | Your MongoDB connection string | Secret |
   | `DB_NAME` | `campusDB` | Environment |
   | `JWT_SECRET` | A strong secret key | Secret |
   | `OPENROUTER_API_KEY` | Your OpenRouter API key | Secret |

5. **Deploy**
   Click "Create Web Service" and wait for the deployment to complete.

## Frontend Deployment to Vercel

### Prerequisites
1. A Vercel account
2. The backend deployed to Render

### Steps

1. **Fork or push this repository to GitHub**

2. **Create a new Project on Vercel**
   - Go to https://vercel.com/new
   - Select your repository
   - Choose the root directory as the project directory

3. **Configure the Project**
   - Framework Preset: `Create React App`
   - Root Directory: `/` (root of the repository)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Add Environment Variables**
   Add the following environment variable in the Vercel dashboard:
   
   | Key | Value |
   |-----|-------|
   | `REACT_APP_BACKEND_URL` | `/api` (This will use the proxy configured in vercel.json) |

5. **Configure Redirects and Rewrites**
   The [vercel.json](file:///C:/Users/AVIN%20RAJ/Desktop/app_backup/frontend/vercel.json) file is already configured to proxy API requests to your Render backend.

6. **Deploy**
   Click "Deploy" and wait for the deployment to complete.

## Security Considerations

1. **Never commit sensitive files**:
   - `.env` files are excluded via `.gitignore`
   - Always use `.env.example` as a template

2. **Environment Variables**:
   - Use Render's "Secret" type for sensitive variables
   - Never hardcode credentials in the source code

3. **CORS Configuration**:
   - Only allow trusted origins
   - Update `CORS_ORIGINS` environment variable as needed

## Troubleshooting

### Backend Issues

1. **502 Bad Gateway**:
   - Check that all required environment variables are set
   - Verify MongoDB connection string is correct
   - Check Render logs for specific error messages

2. **MongoDB Connection Issues**:
   - Ensure MongoDB Atlas IP whitelist includes Render's IPs
   - Verify database user credentials
   - Check that the database name is correct

### Frontend Issues

1. **API Connection Errors**:
   - Verify that `REACT_APP_BACKEND_URL` is set correctly
   - Check that the backend is running and accessible
   - Ensure CORS is properly configured on the backend

2. **404 Errors for API Endpoints**:
   - Check the proxy configuration in [vercel.json](file:///C:/Users/AVIN%20RAJ/Desktop/app_backup/frontend/vercel.json)
   - Ensure the backend URL in the proxy is correct

## Updating Deployments

### Backend Updates
1. Push changes to your GitHub repository
2. Render will automatically redeploy if auto-deploy is enabled
3. Or manually trigger a deploy from the Render dashboard

### Frontend Updates
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy if auto-deploy is enabled
3. Or manually trigger a deploy from the Vercel dashboard