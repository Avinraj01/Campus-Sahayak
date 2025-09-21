# Vercel Deployment Instructions for Campus Management System Frontend

## Project Configuration

Your Vercel project is configured with the following settings:

- **Project Name**: campus-management-system-frontend
- **Project ID**: prj_DI1MIUtthBG9HwFJy1CnvuqSDm5Q
- **Framework**: Create React App (using CRACO)
- **Root Directory**: frontend

## Build and Deployment Settings

### Framework Settings
- **Build Command**: `craco build` (Note: Vercel shows "carco build" which is a typo - should be "craco build")
- **Output Directory**: `build`
- **Install Command**: `yarn install --frozen-lockfile`
- **Development Command**: `react-scripts start`
- **Node.js Version**: 22.x

### Environment Variables
```
REACT_APP_BACKEND_URL=https://campus-management-backend-3x1h.onrender.com
PORT=3000
```

## Required Changes

### 1. Fix Build Command Typo
In your Vercel project settings, make sure the Build Command is:
```
craco build
```
Not "carco build" as currently shown.

### 2. Verify Environment Variables
Ensure these environment variables are set in your Vercel project:
```
REACT_APP_BACKEND_URL=https://campus-management-backend-3x1h.onrender.com
PORT=3000
```

### 3. Check vercel.json Configuration
The [vercel.json](file:///C:/Users/AVIN%20RAJ/Desktop/Campus-Management-System-deploy-render-vercel-ready/frontend/vercel.json) file in your frontend directory should contain:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://campus-management-backend-3x1h.onrender.com/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Credentials",
          "value": "true"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://campus-management-system-frontend.vercel.app"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
        }
      ]
    }
  ]
}
```

## Domain Configuration

Your production domain is:
- **Production**: https://campus-management-system-frontend.vercel.app

## Git Integration

- **Connected Repository**: Avinraj01/Campus-Management-System
- **Branch Tracking**: main branch for production

## Troubleshooting

### Common Issues and Solutions

1. **Build Failures**:
   - Ensure all dependencies are in [yarn.lock](file:///C:/Users/AVIN%20RAJ/Desktop/Campus-Management-System-deploy-render-vercel-ready/frontend/yarn.lock)
   - Check that the Build Command is `craco build` (not "carco build")

2. **API Connection Issues**:
   - Verify [REACT_APP_BACKEND_URL](file:///C:/Users/AVIN%20RAJ/Desktop/Campus-Management-System-deploy-render-vercel-ready/frontend/.env#L1-L2) is set to `https://campus-management-backend-3x1h.onrender.com`
   - Check that the Render backend is running and accessible

3. **CORS Errors**:
   - Ensure the Render backend has your Vercel domain in CORS_ORIGINS:
     `https://campus-management-system-frontend.vercel.app`

4. **Environment Variables Not Loading**:
   - Make sure environment variables are prefixed with `REACT_APP_`
   - Restart the Vercel deployment after changing environment variables

### Testing Your Deployment

After deployment:
1. Visit https://campus-management-system-frontend.vercel.app
2. Try to register a new user account
3. Log in with your credentials
4. Test the AI chat functionality
5. Check browser console for any errors

## Local Development

To run locally:
```bash
cd frontend
yarn install
yarn start
```

The application will be available at http://localhost:3000

## Support

If you encounter issues:
1. Check Vercel logs for build errors
2. Verify all environment variables are correctly set
3. Ensure the Render backend is running
4. Check browser developer tools for network/API errors