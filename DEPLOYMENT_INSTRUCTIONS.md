# Campus Management System - Deployment Instructions

## Render Backend Deployment

### Environment Variables
Set the following environment variables in your Render service:

```
CORS_ORIGINS=https://campus-management-system-ten.vercel.app,https://campus-management-system-git-deploy-r-4b7e77-avin-rajs-projects.vercel.app,https://campus-management-system-jm6ktfcdz-avin-rajs-projects.vercel.app,https://campus-management-system-frontend.vercel.app
DB_NAME=campusDB
JWT_SECRET=Nandini1437@
MONGO_URI=mongodb+srv://avinrajjamia_db_user:zwEGecVQGZffkjkU@cluster0.ulfz9sf.mongodb.net/campusDB?retryWrites=true&w=majority&appName=Cluster0
OPENROUTER_API_KEY=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
```

### Build & Deploy Settings
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `python -m uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/healthz`

## Vercel Frontend Deployment

### Environment Variables
Set the following environment variables in your Vercel project:

```
REACT_APP_BACKEND_URL=https://campus-management-backend-y733.onrender.com
```

### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### vercel.json Configuration
The `vercel.json` file in the frontend directory handles API proxying:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://campus-management-backend-y733.onrender.com/api/:path*"
    }
  ]
}
```

## Local Development

### Backend Setup
1. Navigate to the `backend` directory
2. Create a `.env` file with your configuration:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key
   MONGO_URI=your_mongodb_connection_string
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   ```
3. Install dependencies: `pip install -r requirements.txt`
4. Run the server: `python server.py`

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8000
   PORT=3000
   ```
4. Run the development server: `npm run start`

## Testing the Deployment

After deployment, you can test the following endpoints:

1. **Backend Health Check**: `https://campus-management-backend-y733.onrender.com/healthz`
2. **Frontend**: `https://campus-management-system-ten.vercel.app`
3. **API Test**: `https://campus-management-backend-y733.onrender.com/api/test`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGINS` in Render includes your Vercel frontend URL
2. **API Connection Issues**: Verify the backend URL in Vercel environment variables
3. **MongoDB Connection**: Check that `MONGO_URI` is correctly formatted and accessible
4. **Authentication Errors**: Ensure `JWT_SECRET` is consistent between local and production

### Logs and Monitoring

- Check Render logs for backend issues
- Check Vercel logs for frontend issues
- Monitor the `/healthz` endpoint for service status

## Security Considerations

1. Never commit sensitive environment variables to version control
2. Use strong, unique secrets for `JWT_SECRET`
3. Regularly rotate API keys
4. Ensure MongoDB connection strings are properly secured