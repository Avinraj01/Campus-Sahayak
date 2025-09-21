# Complete Authentication System Restart Guide

This guide will help you completely restart the authentication system with a clean state, fixing the "Email already registered" and "Invalid credentials" errors.

## Understanding the Current System

The authentication system uses:
- **Frontend**: React application running on port 3000
- **Backend**: FastAPI server running on port 8000
- **Storage**: In-memory storage (since MongoDB is not available)
- **Authentication**: JWT-based with localStorage for token storage

## Step-by-Step Restart Process

### 1. Stop Any Running Servers

First, make sure no servers are currently running on ports 3000 or 8000:

```bash
# In PowerShell, check for processes on these ports
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

If you see any processes, kill them using:
```bash
# Replace PID with the actual process ID from the netstat command
Stop-Process -Id PID
```

### 2. Clear Browser Data

Clear your browser's localStorage to remove any cached authentication tokens:

1. Open your browser's developer tools (F12)
2. Go to Application/Storage tab
3. Clear Site Data or manually delete localStorage for localhost:3000

### 3. Start the Backend Server

Navigate to the backend directory and start the server:

```bash
cd backend
python server.py
```

The backend server should start on http://localhost:8000

### 4. Start the Frontend Server

In a new terminal, navigate to the frontend directory and start the server:

```bash
cd frontend
yarn start
```

The frontend server should start on http://localhost:3000

### 5. Verify Clean State

Check that the authentication system is clean by visiting:
- Frontend: http://localhost:3000
- Backend API info: http://localhost:8000/api-info

## Testing the Authentication

### Registration

1. Go to http://localhost:3000
2. Click on the "Sign Up" tab
3. Enter your details:
   - Full Name
   - Email (use a unique email)
   - Password
   - User Type (Student/Faculty/General)
4. Click "Sign Up"

### Login

1. After successful registration, you'll be logged in automatically
2. To test login separately:
   - Click "Logout"
   - Click on the "Login" tab
   - Enter your credentials
   - Click "Login"

## Troubleshooting Common Issues

### "Email already registered" Error

This error occurs when:
1. The email is already in the in-memory storage
2. Browser cache still contains old data

**Solution:**
1. Use a different email address
2. Clear browser cache and localStorage
3. Restart both servers

### "Invalid credentials" Error

This error occurs when:
1. Wrong email/password combination
2. User type mismatch
3. User doesn't exist

**Solution:**
1. Double-check your email and password
2. Ensure user type matches what you selected during registration
3. Try using enrollment number (for students) or teacher ID (for faculty) instead of email

## How the Authentication Works

### Registration Process

1. User submits registration form
2. Backend checks if email already exists in memory
3. If not, creates new user with hashed password
4. Generates JWT token and returns it
5. Frontend stores token in localStorage
6. User is redirected to dashboard

### Login Process

1. User submits login form
2. Backend searches for user by identifier (email/enrollment/teacher ID)
3. Verifies password against hashed password
4. Generates new JWT token and returns it
5. Frontend stores token in localStorage
6. User is redirected to dashboard

### In-Memory Storage

Since MongoDB is not available, the system uses in-memory storage:
- Users are stored in the `IN_MEMORY_USERS` dictionary
- Data persists only while the backend server is running
- Restarting the backend clears all user data

## Security Notes

- Passwords are securely hashed using bcrypt
- JWT tokens are used for authentication
- Tokens expire after 24 hours
- CORS is configured for localhost:3000

## Need Help?

If you continue to experience issues:

1. Check the browser console for errors (F12)
2. Check the backend terminal for error messages
3. Verify both servers are running
4. Clear browser cache and try again

For further assistance, contact the development team.