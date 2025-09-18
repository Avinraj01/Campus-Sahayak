# Campus Management System

A comprehensive campus management system with AI-powered multilingual chat assistance.

## Project Structure

```
campus-management/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
└── README.md         # This file
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB (local or cloud instance)
- npm or yarn

## Local Development Setup

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

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configuration:
   - Set your MongoDB connection string
   - Add your OpenRouter API key (get one at https://openrouter.ai/)
   - Update CORS origins if needed

6. Run the backend server:
   ```bash
   python server.py
   ```
   
   The backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (use --legacy-peer-deps to avoid conflicts):
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Run the frontend development server:
   ```bash
   npx craco start
   ```
   
   The frontend will be available at http://localhost:3000

## Quick Start Scripts

For easier development, you can use the provided PowerShell scripts:

- `start_backend.ps1` - Starts only the backend server
- `start_frontend.ps1` - Starts only the frontend server
- `start_fresh.ps1` - Attempts to start both servers with a clean state

## Environment Variables

### Backend (.env)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: http://localhost:3000)
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT token generation
- `OPENROUTER_API_KEY`: API key for OpenRouter AI services

### Frontend (.env)
- `REACT_APP_BACKEND_URL`: Base URL for backend API (default: http://localhost:8000/api)

## API Endpoints

The backend API is available at `/api` prefix:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/chat` - AI chat endpoint
- `POST /api/complaints` - Submit complaints
- `GET /api/complaints` - Get user complaints
- `POST /api/forms` - Submit forms
- `GET /api/forms` - Get user forms
- `GET /api/notices` - Get campus notices

## Troubleshooting

### "Not Found" Errors on Login/Signup

1. Ensure the backend server is running on port 8000
2. Check that CORS is properly configured in the backend `.env` file
3. Verify the frontend `.env` file has the correct `REACT_APP_BACKEND_URL`
4. Check browser console for network errors
5. Make sure MongoDB is running and accessible

### Common Issues

1. **CORS Errors**: Make sure `CORS_ORIGINS` in the backend `.env` includes your frontend URL
2. **MongoDB Connection**: Verify MongoDB is running and the connection string is correct
3. **API Key Issues**: Ensure your OpenRouter API key is valid and has credits
4. **Dependency Conflicts**: Use `npm install --legacy-peer-deps` to avoid React version conflicts

## Deployment

For deployment instructions, see [DEPLOYMENT.md](backend/DEPLOYMENT.md).

## Verification

Once both servers are running:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs