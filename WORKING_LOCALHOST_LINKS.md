# Working Localhost Links

## Application URLs

- **Frontend (Login/Signup Page)**: http://localhost:3000/login
- **Frontend (Main Application)**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Backend Documentation**: http://localhost:8000/docs
- **Backend Alternative Documentation**: http://localhost:8000/redoc

## API Endpoints

- **Login**: POST http://localhost:8000/api/auth/login
- **Register**: POST http://localhost:8000/api/auth/register
- **Chat**: POST http://localhost:8000/api/chat
- **Complaints**: GET/POST http://localhost:8000/api/complaints
- **Forms**: GET/POST http://localhost:8000/api/forms
- **Notices**: GET http://localhost:8000/api/notices

## Test Credentials

You can use these credentials for testing:

### For Login:
- Email: test@example.com
- Password: password123
- User Type: student

### For Signup:
- Email: [your-email@example.com]
- Password: [your-password]
- Full Name: [Your Name]
- User Type: student/faculty/general

## How to Access

1. Make sure both the frontend and backend servers are running:
   - Backend: `cd backend && python server.py`
   - Frontend: `cd frontend && npm start`

2. Open your browser and go to http://localhost:3000/login

3. You can either sign up for a new account or log in with test credentials

## Troubleshooting

If you encounter any issues:

1. **CORS Errors**: Make sure both servers are running and the .env files are properly configured
2. **Port Conflicts**: If ports 3000 or 8000 are in use, stop the conflicting processes
3. **Database Issues**: The application will work with in-memory storage if MongoDB is not available
4. **API Connection Errors**: Check that the frontend .env file points to http://localhost:8000/api

Both the login and signup functionality should now be working correctly at http://localhost:3000/login