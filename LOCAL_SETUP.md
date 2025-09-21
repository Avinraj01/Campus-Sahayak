# Local Development Setup

## Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB (local or cloud)

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   # CORS Configuration
   CORS_ORIGINS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000

   # MongoDB Configuration
   MONGO_URL=mongodb://localhost:27017/campus_management
   DB_NAME=campus_management

   # JWT Configuration
   JWT_SECRET=your-secret-key-here-change-in-production

   # OpenRouter API Key (optional for AI features)
   OPENROUTER_API_KEY=your-openrouter-api-key-here
   ```

4. Start the backend server:
   ```
   python server.py
   ```
   
   The backend will be available at: http://localhost:8000

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
   Or if using yarn:
   ```
   yarn install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the frontend development server:
   ```
   npm start
   ```
   
   The frontend will be available at: http://localhost:3000

## Testing Login/Signup

1. Open your browser and go to: http://localhost:3000/login

2. You can either:
   - Sign up for a new account
   - Use the test account (if you've created one)

### Test Credentials
- Email: test@example.com
- Password: password123
- User Type: student

## Common Issues and Solutions

### CORS Errors
If you encounter CORS errors, make sure:
1. The backend `.env` file has the correct CORS configuration
2. Both frontend and backend are running
3. The frontend `.env` file points to the correct backend URL

### Database Connection Issues
If you can't connect to MongoDB:
1. Make sure MongoDB is running locally or update the MONGO_URL in your `.env` file
2. Check that the MongoDB service is accessible

### Login/Signup Not Working
If login/signup fails:
1. Check the browser console for errors
2. Check the backend terminal for error messages
3. Verify that both services are running on the correct ports

## API Endpoints

- Login: POST http://localhost:8000/api/auth/login
- Register: POST http://localhost:8000/api/auth/register
- Chat: POST http://localhost:8000/api/chat

## Local URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Backend API: http://localhost:8000/api
- Backend Docs: http://localhost:8000/docs