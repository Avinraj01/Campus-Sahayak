# Campus Management System - Complete Architecture and Functionality Overview

## Project Structure

```
app_backup/
├── backend/
│   ├── server.py              # Main FastAPI backend server
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Backend environment variables template
│   └── api/                   # Backend API modules
│       ├── auth/              # Authentication endpoints
│       ├── chat/              # Chat functionality
│       ├── complaints/        # Complaint management
│       ├── forms/             # Form submission system
│       └── notices/           # Campus notices
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React application
│   │   ├── components/        # UI components
│   │   │   ├── StudentPortalPage.js
│   │   │   ├── ComplaintsPage.js
│   │   │   ├── CalendarPage.js
│   │   │   ├── NoticesPage.js
│   │   │   ├── ContactPage.js
│   │   │   └── FormsPage.js
│   │   ├── api/               # Frontend API integration
│   │   └── utils/
│   │       └── api.js         # Axios API client configuration
│   ├── .env.example           # Frontend environment variables template
│   └── package.json           # Frontend dependencies
│
├── campus_assistant_chatbot.py  # Standalone Python chatbot
├── .env.example               # Root environment variables template
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## System Architecture

### Backend (Python/FastAPI)
- **Framework**: FastAPI for high-performance REST API
- **Database**: MongoDB with Motor driver for async operations
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **AI Integration**: OpenRouter API for multilingual chatbot
- **Deployment**: Configured for Render with dynamic port assignment

### Frontend (React)
- **Framework**: React with React Router for SPA navigation
- **UI Library**: Custom UI components with Tailwind CSS styling
- **State Management**: React Context API for authentication state
- **API Client**: Axios with interceptors for request/response handling
- **Deployment**: Configured for Vercel

### Database
- **MongoDB**: Document-based database for user profiles, complaints, forms, and chat history
- **Schema**: Flexible schema with fallback to in-memory storage when MongoDB is unavailable
- **Collections**:
  - users: Student and faculty profiles
  - complaints: Campus issue tracking
  - forms: Document submissions
  - notices: Campus announcements
  - conversations: Chat history

## Core Functionality

### 1. Authentication System
- **User Registration**: Multi-user type support (student, faculty, general)
- **User Login**: JWT token-based authentication with "Remember Me" option
- **Password Security**: Bcrypt hashing for secure password storage
- **Profile Management**: Automatic enrollment/teacher ID generation

### 2. AI-Powered Chat Assistant
- **Multilingual Support**: English, Hindi, Gujarati, Telugu, Rajasthani, Urdu
- **Context Awareness**: Access to user profile and campus information
- **Smart Responses**: AI-generated responses with fallback mechanisms
- **Conversation History**: Persistent chat history storage

### 3. Student Portal
- **Profile Management**: Personal and academic information display
- **Academic Records**: Semester grades, attendance tracking
- **Fee Management**: Payment status and installment tracking
- **Document Center**: Access to academic documents

### 4. Campus Services
- **Complaint System**: Submit and track campus issues
- **Form Submissions**: Request certificates, affidavits, and other documents
- **Notice Board**: View campus announcements
- **Calendar**: Academic schedule and event management

### 5. Communication Features
- **Contact Information**: Integrated campus contact details
- **WhatsApp Integration**: Direct communication channel
- **Suggested Links**: Context-aware navigation suggestions

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat
- `POST /api/chat` - AI chat interface
- `GET /api/chat/history/{session_id}` - Chat history retrieval

### Complaints
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints` - Retrieve user complaints

### Forms
- `POST /api/forms` - Submit new form
- `GET /api/forms` - Retrieve user forms

### Notices
- `GET /api/notices` - Retrieve campus notices

### Utilities
- `GET /health` - Health check endpoint
- `GET /api-info` - API documentation endpoint

## Environment Configuration

### Backend Environment Variables
- `OPENROUTER_API_KEY`: AI service API key
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `CORS_ORIGINS`: Allowed frontend origins

### Frontend Environment Variables
- `REACT_APP_BACKEND_URL`: Backend API base URL

## Security Features

1. **API Key Protection**: All sensitive keys stored in environment variables
2. **JWT Authentication**: Secure token-based user authentication
3. **Password Hashing**: Bcrypt encryption for user passwords
4. **CORS Protection**: Controlled cross-origin resource sharing
5. **Input Validation**: Pydantic models for request validation

## Deployment Configuration

### Backend (Render)
- Dynamic port assignment using `PORT` environment variable
- MongoDB Atlas integration for production database
- Health check endpoint for deployment monitoring

### Frontend (Vercel)
- Environment variable configuration for API connection
- Build optimization for performance
- Automatic HTTPS provisioning

## Connection Flow

1. **Frontend Initialization**:
   - Load environment variables
   - Configure Axios client with backend URL
   - Set up authentication context

2. **User Authentication**:
   - User submits login credentials
   - Frontend sends request to `/api/auth/login`
   - Backend validates credentials and returns JWT token
   - Frontend stores token and user data

3. **API Communication**:
   - Axios interceptor automatically adds JWT token to requests
   - All API calls use `/api` prefix
   - Backend validates JWT token for protected endpoints

4. **AI Chat Interaction**:
   - User submits chat message
   - Frontend sends to `/api/chat` with JWT token
   - Backend retrieves user context and chat history
   - Backend calls OpenRouter API with campus-specific prompt
   - Response returned to frontend with suggested links

5. **Data Persistence**:
   - MongoDB stores all persistent data
   - In-memory fallback for database connectivity issues
   - Automatic retry mechanisms for failed operations

This comprehensive system provides a full-featured campus management solution with secure authentication, AI-powered assistance, and integrated campus services, all designed for easy deployment to cloud platforms.