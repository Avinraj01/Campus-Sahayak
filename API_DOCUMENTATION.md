# Campus Management System API Documentation

## Base URL
- Local Development: `http://localhost:8000/api`
- Production: `https://campus-backend-pc26.onrender.com/api`

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
**POST** `/auth/register`

Registers a new user in the system.

#### Request Body
```json
{
  "email": "string",
  "password": "string",
  "user_type": "string", // "student", "faculty", or "general"
  "full_name": "string",
  "phone": "string" // Optional
}
```

#### Response
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": "string",
    "email": "string",
    "full_name": "string",
    "user_type": "string",
    "enrollment_no": "string", // For students
    "teacher_id": "string"     // For faculty
  }
}
```

### Login User
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

#### Request Body
```json
{
  "identifier": "string", // email, enrollment_no, or teacher_id
  "password": "string",
  "user_type": "string" // "student", "faculty", or "general"
}
```

#### Response
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": "string",
    "email": "string",
    "full_name": "string",
    "user_type": "string",
    "enrollment_no": "string", // For students
    "teacher_id": "string"     // For faculty
  }
}
```

## Chat

### Send Chat Message
**POST** `/chat`

Sends a message to the AI chat assistant.

#### Request Body
```json
{
  "message": "string",
  "session_id": "string",
  "language": "string" // Optional: "en", "hi", "gu", "te", "raj", "ur"
}
```

#### Response
```json
{
  "response": "string",
  "language": "string",
  "session_id": "string",
  "suggested_links": [
    {
      "title": "string",
      "url": "string"
    }
  ]
}
```

### Get Chat History
**GET** `/chat/history/{session_id}`

Retrieves the chat history for a specific session.

#### Response
```json
{
  "history": [
    {
      "message": "string",
      "response": "string",
      "timestamp": "string"
    }
  ]
}
```

## Complaints

### Submit Complaint
**POST** `/complaints`

Submits a new complaint.

#### Request Body
```json
{
  "title": "string",
  "description": "string",
  "category": "string" // "academic", "infrastructure", "hostel", etc.
}
```

#### Response
```json
{
  "id": "string",
  "user_id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "status": "string", // "pending", "in_review", "resolved"
  "created_at": "string",
  "updated_at": "string"
}
```

### Get User Complaints
**GET** `/complaints`

Retrieves all complaints submitted by the current user.

#### Response
```json
[
  {
    "id": "string",
    "user_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "status": "string",
    "created_at": "string",
    "updated_at": "string"
  }
]
```

## Forms

### Submit Form
**POST** `/forms`

Submits a new form request.

#### Request Body (Form Data)
```
title: string
description: string
form_type: string // "affidavit", "letter", "certificate", etc.
file: file (optional)
```

#### Response
```json
{
  "message": "Form submitted successfully",
  "id": "string"
}
```

### Get User Forms
**GET** `/forms`

Retrieves all forms submitted by the current user.

#### Response
```json
[
  {
    "id": "string",
    "user_id": "string",
    "title": "string",
    "description": "string",
    "form_type": "string",
    "file_path": "string",
    "status": "string", // "pending", "approved", "rejected"
    "created_at": "string",
    "updated_at": "string"
  }
]
```

## Notices

### Get Notices
**GET** `/notices`

Retrieves all active campus notices.

#### Response
```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "category": "string",
    "target_audience": "string", // "all", "students", "faculty"
    "created_at": "string",
    "is_active": "boolean"
  }
]
```

## Utility Endpoints

### Health Check
**GET** `/health`

Health check endpoint for deployment platforms.

#### Response
```json
{
  "status": "healthy",
  "timestamp": "string",
  "service": "campus-management-backend"
}
```

### API Information
**GET** `/api-info`

Provides information about the API.

#### Response
```json
{
  "message": "Campus Management System API",
  "version": "1.0.0",
  "docs": "/docs",
  "redoc": "/redoc",
  "api_base": "/api",
  "endpoints": {
    "auth_login": "/api/auth/login",
    "auth_register": "/api/auth/register",
    "chat": "/api/chat",
    "chat_history": "/api/chat/history/{session_id}",
    "complaints": "/api/complaints",
    "forms": "/api/forms",
    "notices": "/api/notices"
  },
  "features": [
    "Multilingual support (6 languages)",
    "AI-powered chat assistant",
    "JWT authentication",
    "Student complaints system",
    "Form submissions",
    "Campus notices",
    "Mobile responsive"
  ],
  "languages_supported": ["en", "hi", "gu", "te", "raj", "ur"],
  "contact": {
    "email": "avinyaduvansi123@gmail.com",
    "phone": "+916200060778",
    "whatsapp": "+916200060778"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "string"
}
```

### 401 Unauthorized
```json
{
  "detail": "string"
}
```

### 404 Not Found
```json
{
  "detail": "string"
}
```

### 500 Internal Server Error
```json
{
  "detail": "string"
}
```

## Authentication Flow

1. **User Registration**:
   - Client sends POST request to `/auth/register`
   - Server validates input and creates user
   - Server returns JWT token and user data

2. **User Login**:
   - Client sends POST request to `/auth/login`
   - Server validates credentials
   - Server returns JWT token and user data

3. **Authenticated Requests**:
   - Client includes `Authorization: Bearer <token>` header
   - Server validates token and processes request
   - Server returns requested data

## Chat Flow

1. **Initialize Session**:
   - Generate a unique `session_id` on the client
   - Store it for the duration of the chat session

2. **Send Message**:
   - Send POST request to `/chat` with message and session_id
   - Include language preference if needed

3. **Receive Response**:
   - AI response with suggested links
   - Display response to user

4. **View History**:
   - Send GET request to `/chat/history/{session_id}`
   - Display conversation history

## Data Models

### User
```json
{
  "id": "string",
  "email": "string",
  "full_name": "string",
  "user_type": "string",
  "enrollment_no": "string", // For students
  "teacher_id": "string",    // For faculty
  "phone": "string",
  "created_at": "string",
  "is_active": "boolean"
}
```

### Complaint
```json
{
  "id": "string",
  "user_id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Form Submission
```json
{
  "id": "string",
  "user_id": "string",
  "title": "string",
  "description": "string",
  "form_type": "string",
  "file_path": "string",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Notice
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "category": "string",
  "target_audience": "string",
  "created_at": "string",
  "is_active": "boolean"
}
```

### Chat Message
```json
{
  "id": "string",
  "session_id": "string",
  "user_id": "string",
  "message": "string",
  "response": "string",
  "language": "string",
  "timestamp": "string",
  "context": "object"
}
```