# Campus Management System

A comprehensive campus management system with AI-powered multilingual chatbot assistance.

## Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── server.py           # Main application file
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variables template
│   ├── .gitignore          # Git ignore rules
│   └── render.yaml         # Render deployment configuration
├── frontend/               # React frontend
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   ├── .env.example        # Environment variables template
│   ├── .gitignore          # Git ignore rules
│   └── vercel.json         # Vercel deployment configuration
├── .gitignore              # Root git ignore
└── README.md              # This file
```

## Local Development

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

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example` and fill in your values

5. Run the development server:
   ```bash
   python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your values

4. Run the development server:
   ```bash
   npm start
   ```

## Deployment

See [DEPLOYMENT_GUIDE.md](file:///C:/Users/AVIN%20RAJ/Desktop/app_backup/DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Backend (Render)
- Runtime: Python
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`

## Environment Variables

### Backend
Create a `.env` file in the `backend/` directory with the following variables:
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENROUTER_API_KEY`: OpenRouter API key for AI features

### Frontend
Create a `.env` file in the `frontend/` directory with the following variables:
- `REACT_APP_BACKEND_URL`: Backend API URL (use `/api` for production with proxy)

## Security

- Never commit `.env` files to version control
- Use strong, random values for secrets
- Regularly rotate API keys
- Keep dependencies up to date

## Features

- Multilingual AI chatbot (English, Hindi, Gujarati, Telugu, Rajasthani, Urdu)
- User authentication (students, faculty, general users)
- Complaint management system
- Form submission system
- Campus notices
- Academic calendar
- Responsive design for all devices

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat
- `POST /api/chat` - AI chat interface

### Complaints
- `POST /api/complaints` - Submit a complaint
- `GET /api/complaints` - Get user's complaints

### Forms
- `POST /api/forms` - Submit a form
- `GET /api/forms` - Get user's forms

### Notices
- `GET /api/notices` - Get campus notices

## Support

For issues or questions, please contact the development team.