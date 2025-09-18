# Campus Management System Authentication Guide

## System Status
✅ Both frontend (http://localhost:3000) and backend (http://localhost:8000) servers are running
✅ Authentication system is working correctly
✅ User database is active

## How to Register and Login

### Method 1: Using the Web Interface (Recommended)

1. **Open your browser** and go to http://localhost:3000/login

2. **For Registration (Sign Up)**:
   - Click on the "Sign Up" tab
   - Fill in the form:
     * Full Name: Your full name
     * Email: A unique email address (not already registered)
     * Password: Your chosen password
     * User Type: Select Student/Faculty/General
     * Phone: Optional
   - Click "Sign Up"
   - You'll be automatically logged in and redirected to the dashboard

3. **For Login**:
   - Click on the "Login" tab
   - Fill in the form:
     * User Type: Must match what you selected during registration
     * Email/ID: Your email address (or enrollment number for students, teacher ID for faculty)
     * Password: The password you created during registration
   - Click "Login"
   - You'll be redirected to the dashboard

### Method 2: Using the Test Script

You can also test registration and login using the provided script:

```bash
cd frontend
node credentials-test.js
```

This will register and login a test user with these credentials:
- Email: myuser@example.com
- Password: mypassword123
- User Type: student
- Full Name: My Test User

## Working Credentials

Here are some credentials that are confirmed to work:

### Test User 1:
- Email: freshuser@example.com
- Password: freshpassword123
- User Type: student

### Test User 2:
- Email: myuser@example.com
- Password: mypassword123
- User Type: student

## Common Issues and Solutions

### Issue 1: "Email already registered"
**Solution**: Use a different email address that hasn't been used before
- Try: yourname123@example.com
- Try: uniquename@example.com
- Try: firstname.lastname@example.com

### Issue 2: "Invalid credentials"
**Solution**: Check these common causes:
1. Make sure your user type matches what you selected during registration
2. Verify your email/password is correct (case-sensitive)
3. For students, try using your enrollment number instead of email
4. For faculty, try using your teacher ID instead of email

### Issue 3: Cannot access http://localhost:3000
**Solution**: Make sure both servers are running:
1. Backend server on port 8000
2. Frontend server on port 3000

## User Types Explained

1. **Student**: Can use email or enrollment number for login
2. **Faculty**: Can use email or teacher ID for login
3. **General**: Can only use email for login

## Security Notes

- Passwords are securely hashed and stored
- Authentication tokens expire after 24 hours
- Always use strong, unique passwords
- Never share your credentials with others

## Troubleshooting

If you're having persistent issues:

1. **Clear browser cache and cookies**
2. **Restart both servers**:
   ```bash
   # Stop all servers first
   Stop-Process -Name "node" -Force
   Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process -Force
   
   # Start backend
   cd backend
   python server.py
   
   # Start frontend (in a new terminal)
   cd frontend
   npm start
   ```

3. **Check server logs** for any error messages

## Need Help?

If you continue to have issues:
1. Make sure you're using a unique email address
2. Double-check your credentials
3. Verify the user type matches your registration
4. Contact support with specific error messages

The authentication system is now fully functional and ready for use!