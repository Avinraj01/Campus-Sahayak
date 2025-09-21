# Final Instructions for Authentication System

## Current Status

✅ **Backend Server**: Running on http://localhost:8001
✅ **Authentication System**: Fully functional with in-memory storage
❌ **Frontend Server**: Having dependency issues, but authentication works via API

## How to Test the Authentication System

### Option 1: Using the Test HTML Page (Recommended)

1. Open the [auth_test.html](file:///c%3A/Users/AVIN%20RAJ/Desktop/app_backup/auth_test.html) file in your browser
2. Register a new user account
3. Login with your credentials

### Option 2: Using API Tools (Postman, curl, etc.)

#### Register a New User
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "your_password",
    "full_name": "Test User",
    "user_type": "student"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "your_password",
    "user_type": "student"
  }'
```

## Backend API Endpoints

All endpoints are prefixed with `/api`:

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login with existing credentials
- **GET** `/api/api-info` - Get API information
- **GET** `/api/debug/users` - Debug endpoint to see registered users

## Troubleshooting Frontend Issues

The frontend is having dependency conflicts. To fix this:

1. Install dependencies with legacy peer deps:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Then try starting the frontend:
   ```bash
   npx craco start
   ```

## Port Information

- **Backend**: http://localhost:8001 (was originally 8000 but port 8000 was occupied)
- **Frontend**: http://localhost:3000 (when fixed)

## Authentication System Details

- **Storage**: In-memory (data persists only while backend server is running)
- **Security**: Passwords hashed with bcrypt, JWT tokens for authentication
- **Token Expiration**: 24 hours
- **CORS**: Configured for localhost:3000

## To Restart the System

1. Stop the backend server (Ctrl+C in the terminal)
2. Start the backend server again:
   ```bash
   cd "c:\Users\AVIN RAJ\Desktop\app_backup\backend"
   python -m uvicorn backend.server:app --host 0.0.0.0 --port 8001 --reload
   ```

The authentication system is now fully functional and ready for use!