# Deployment and Environment Configuration

## Project Overview

The Campus Management System is a full-stack web application with:
- **Frontend**: React application deployed on Vercel
- **Backend**: FastAPI server deployed on Render
- **Database**: MongoDB for data persistence

## Environment Variables

### Root Directory (.env.example)
```
# OpenRouter API Key - Get yours at https://openrouter.ai/
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Other environment variables (examples)
JWT_SECRET=your-jwt-secret-key-here
MONGO_URL=mongodb://localhost:27017/campus_management
```

### Backend (.env.example)
```
# CORS Configuration - Add your frontend URLs here
CORS_ORIGINS=https://campus-management-system-gamma.vercel.app,http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000

# MongoDB Configuration
MONGO_URL=your_mongodb_connection_string_here
DB_NAME=campus_management

# JWT Configuration - Change this in production
JWT_SECRET=your_jwt_secret_here

# OpenRouter API Key - Get yours at https://openrouter.ai/
OPENROUTER_API_KEY=your_openrouter_api_key_here

# DeepSeek API Key (optional - for fallback)
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

### Frontend (.env.example)
```
# Backend API URL - Change this for different environments
# For local development:
REACT_APP_BACKEND_URL=http://localhost:8000/api
PORT=3000

# For production deployment:
# REACT_APP_BACKEND_URL=your-production-api-url-here
```

## Local Development Setup

### Prerequisites
1. Python 3.8+
2. Node.js 14+
3. MongoDB (local or cloud)
4. OpenRouter API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example` and fill in your values:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

5. Run the development server:
   ```bash
   python server.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your values:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. Run the development server:
   ```bash
   npm start
   ```

### Running Both Services
To run both frontend and backend simultaneously:

1. In one terminal, start the backend:
   ```bash
   cd backend
   python server.py
   ```

2. In another terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

## Deployment Configuration

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables in Render:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `MONGO_URL`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key
   - `CORS_ORIGINS`: Your frontend URLs (comma-separated)
   - `DB_NAME`: Your database name (default: campus_management)

4. Set the build command:
   ```bash
   pip install -r requirements.txt
   ```

5. Set the start command:
   ```bash
   python server.py
   ```

6. The application will automatically use the PORT environment variable provided by Render

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the following environment variables in Vercel:
   - `REACT_APP_BACKEND_URL`: Your backend API URL (e.g., https://your-app.onrender.com/api)

4. Vercel will automatically detect the React application and set appropriate build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Database Configuration

#### MongoDB Atlas (Recommended for Production)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Add your IP address to the whitelist (or allow access from anywhere for development)
5. Get your connection string from the "Connect" button
6. Update your `MONGO_URL` environment variable with the connection string

#### Local MongoDB
1. Install MongoDB locally
2. Start the MongoDB service
3. Use the default connection string: `mongodb://localhost:27017/campus_management`

## Security Configuration

### API Key Management
1. Never commit API keys to version control
2. Use environment variables for all sensitive data
3. Rotate API keys regularly
4. Use different API keys for development and production

### JWT Configuration
1. Use a strong, random JWT secret in production
2. Rotate JWT secrets periodically
3. Set appropriate token expiration times

### CORS Configuration
1. Only allow trusted origins in production
2. Regularly review and update the CORS origins list
3. Use specific origins rather than wildcards

## Environment-Specific Configurations

### Development Environment
- Local MongoDB instance or MongoDB Atlas free tier
- Development API keys with limited permissions
- Debug logging enabled
- Hot reloading for frontend development

### Production Environment
- MongoDB Atlas cluster
- Production API keys
- Error logging and monitoring
- HTTPS enforced
- Optimized builds

## Monitoring and Logging

### Backend Logging
- Application logs are output to stdout/stderr
- Error logs include stack traces
- Request logging for debugging

### Frontend Logging
- Console logs for debugging
- Error boundaries for catching UI errors
- Network request logging

### Error Handling
- Graceful degradation when services are unavailable
- Fallback mechanisms for critical functionality
- User-friendly error messages

## Backup and Recovery

### Database Backup
- MongoDB Atlas provides automated backups
- Regular export of critical data
- Version control for database schema

### Code Backup
- Git version control
- Regular commits and pushes
- Branch protection for main branches

## Scaling Considerations

### Horizontal Scaling
- Backend: Multiple instances behind a load balancer
- Frontend: CDN distribution through Vercel
- Database: MongoDB sharding for large datasets

### Performance Optimization
- Database indexing for frequently queried fields
- Caching for static content
- Compression of API responses
- Lazy loading for frontend components

## Troubleshooting

### Common Issues

#### Backend Not Starting
1. Check environment variables
2. Verify MongoDB connection
3. Check port availability
4. Review error logs

#### Frontend Not Connecting to Backend
1. Verify REACT_APP_BACKEND_URL is correct
2. Check CORS configuration
3. Ensure backend is running
4. Check network connectivity

#### Authentication Issues
1. Verify JWT secret consistency
2. Check token expiration settings
3. Validate user credentials
4. Review password hashing

### Debugging Steps

#### Backend Debugging
1. Enable debug logging
2. Use print statements for tracing
3. Test endpoints with curl or Postman
4. Check MongoDB connection status

#### Frontend Debugging
1. Use browser developer tools
2. Check network tab for API calls
3. Review console logs
4. Validate environment variables

## Maintenance

### Regular Tasks
- Monitor API usage and costs
- Review and rotate API keys
- Update dependencies
- Backup critical data
- Monitor application performance

### Updates and Upgrades
- Test changes in development environment
- Use feature branches for major changes
- Implement gradual rollouts when possible
- Maintain rollback procedures

## Best Practices

### Security
- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs
- Validate all API requests
- Regular security audits

### Performance
- Optimize database queries
- Minimize API response sizes
- Use efficient algorithms
- Implement caching strategies

### Reliability
- Implement retry mechanisms
- Use fallback approaches
- Monitor service health
- Plan for disaster recovery

This comprehensive deployment and environment configuration guide should help you successfully set up, deploy, and maintain the Campus Management System in both development and production environments.