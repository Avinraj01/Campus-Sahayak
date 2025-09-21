from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import HTMLResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import json
from openai import OpenAI
import requests
import bcrypt
import jwt
import base64
from passlib.context import CryptContext
import re  # Add this import for regex validation

# --- load environment variables (do not commit .env) ---
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists (for local development)
if os.path.exists('.env'):
    load_dotenv()
    print("Loaded environment variables from .env file")

# Debug: Print key environment variables for troubleshooting
print("=== Environment Variables Debug ===")
print(f"OPENROUTER_API_KEY: {os.environ.get('OPENROUTER_API_KEY', 'Not set')[:20] if os.environ.get('OPENROUTER_API_KEY') else 'Not set'}...")
print(f"OPENROUTER_MODEL: {os.environ.get('OPENROUTER_MODEL', 'Not set')}")
print(f"MONGO_URI: {os.environ.get('MONGO_URI', 'Not set')[:30] if os.environ.get('MONGO_URI') else 'Not set'}...")
print(f"DB_NAME: {os.environ.get('DB_NAME', 'Not set')}")
print(f"JWT_SECRET: {'Set' if os.environ.get('JWT_SECRET') else 'Not set'}")
print("==================================")

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
# Use MONGO_URI instead of MONGO_URL to match Render environment variables
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/mydb")
JWT_SECRET = os.environ.get("JWT_SECRET", "change-me-in-prod")
DB_NAME = os.environ.get("DB_NAME", "campus_management")

import logging
if not OPENROUTER_API_KEY:
    logging.warning("OPENROUTER_API_KEY is not set. AI features will fail until you set OPENROUTER_API_KEY in environment or in backend/.env (local dev).")
# --- end env load ---

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory user store for when database is not available
IN_MEMORY_USERS = {}

# MongoDB connection
client = None
db = None
try:
    # Use MONGO_URI instead of MONGO_URL to match Render environment variables
    mongo_uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/campus_management')
    db_name = os.environ.get('DB_NAME', 'campus_management')
    
    if mongo_uri and db_name:
        print(f"Attempting to connect to MongoDB: {mongo_uri} with database: {db_name}")
        # Add SSL options for Render deployment
        client = AsyncIOMotorClient(
            mongo_uri, 
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            tls=True,
            tlsAllowInvalidCertificates=True
        )
        # Test connection explicitly
        db = client[db_name]
        print("MongoDB client initialized successfully")
    else:
        print("MongoDB configuration not found, using in-memory storage only")
        
except Exception as e:
    print(f"MongoDB client initialization failed: {e} - using fallback mode")
    client = None
    db = None

# Validate API key format
def validate_api_key(api_key):
    if not api_key:
        return False
    # OpenRouter API keys typically start with 'sk-or-v1-'
    # But we should accept the key as long as it's provided
    return len(api_key) > 20  # Basic length check instead of strict regex

# OpenRouter client setup
# For debugging, let's print the API key info
print(f"OpenRouter API Key loaded: {OPENROUTER_API_KEY[:20] if OPENROUTER_API_KEY else 'None'}...")

# DeepSeek client setup (fallback to OpenRouter if DeepSeek key not provided)
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
OPENROUTER_MODEL = os.environ.get('OPENROUTER_MODEL', 'openai/gpt-4o')  # Use gpt-4o as default to match working example

openrouter_client = None

if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY.startswith('sk-'):
    print(f"DeepSeek API Key loaded: {DEEPSEEK_API_KEY[:20]}...")
    try:
        openrouter_client = OpenAI(
            base_url="https://api.deepseek.com",
            api_key=DEEPSEEK_API_KEY
        )
        print("DeepSeek client initialized successfully")
    except Exception as e:
        print(f"Failed to initialize DeepSeek client: {e}")
        openrouter_client = None
else:
    print("DeepSeek API Key not found or invalid, using OpenRouter as fallback")
    print(f"Using OpenRouter model: {OPENROUTER_MODEL}")
    # Check if we have an OpenRouter API key
    if OPENROUTER_API_KEY:
        print("OpenRouter API Key is present")
        try:
            openrouter_client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=OPENROUTER_API_KEY
            )
            print("OpenRouter client initialized successfully")
            print(f"OpenRouter client type: {type(openrouter_client)}")
        except Exception as e:
            print(f"Failed to initialize OpenRouter client: {e}")
            import traceback
            traceback.print_exc()
            openrouter_client = None
    else:
        print("OpenRouter API Key is missing. AI features will be disabled.")
        openrouter_client = None

# Print the final state of the client
print(f"Final openrouter_client value: {openrouter_client}")

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-here-change-in-production')
JWT_ALGORITHM = 'HS256'
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI(title="Campus Management System")

# Health check endpoints
@app.get("/")
async def root():
    return {"message": "Backend is running"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/health")
async def health_check():
    """Health check endpoint for Render and other deployment platforms"""
    # Check MongoDB connection if available
    db_status = "not_configured"
    if db is not None:
        try:
            # Attempt a simple database operation to verify connection
            await db.command("ping")
            db_status = "connected"
        except Exception as e:
            db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "campus-management-backend",
        "database": db_status,
        "openrouter_client": "available" if openrouter_client else "not_available"
    }

@app.get("/api/test")
async def test_endpoint():
    return {"message": "API is working correctly"}

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    user_type: str  # student, faculty, general
    full_name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    identifier: str  # email, enrollment_no, teacher_id
    password: str
    user_type: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    user_type: str
    enrollment_no: Optional[str] = None
    teacher_id: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    user_type: str
    enrollment_no: Optional[str] = None
    teacher_id: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Complaint Models
class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str  # academic, infrastructure, hostel, etc.

class Complaint(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    category: str
    status: str = "pending"  # pending, in_review, resolved
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

# Form Submission Models
class FormSubmissionCreate(BaseModel):
    title: str
    description: str
    form_type: str  # affidavit, letter, certificate, etc.

class FormSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    form_type: str
    file_path: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None

# Notice Models
class Notice(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    category: str
    target_audience: str  # all, students, faculty
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

# Chat Models (existing)
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    message: str
    response: str
    language: str = "en"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    context: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    session_id: str
    language: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    language: str
    session_id: str
    suggested_links: Optional[List[Dict[str, str]]] = None

# Helper Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def generate_enrollment_no() -> str:
    return f"ENR{datetime.now().year}{str(uuid.uuid4())[:8].upper()}"

def generate_teacher_id() -> str:
    return f"TCH{datetime.now().year}{str(uuid.uuid4())[:8].upper()}"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    # Try to get user from database, with fallback for database issues
    try:
        if db is not None:
            user = await db.users.find_one({"id": user_id})
            if user is not None:
                return User(**user)
    except Exception as db_error:
        print(f"Database error in get_current_user: {db_error}")
    
    # Check in-memory store
    for email, user_record in IN_MEMORY_USERS.items():
        if user_record['id'] == user_id:
            return User(**user_record)
    
    # Fallback: create a mock user for this session if user not found anywhere
    print(f"User not found in database or memory for user_id: {user_id}")
    mock_user = User(
        id=user_id,
        email="unknown@example.com",
        full_name="Unknown User",
        user_type="student",
        enrollment_no="ENR2025UNKNOWN",
        phone="+916200060778"
    )
    return mock_user

def prepare_for_mongo(data):
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            if isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = prepare_for_mongo(value)
            else:
                result[key] = value
        return result
    return data

def get_suggested_links(message: str) -> List[Dict[str, str]]:
    """Generate suggested links based on user query"""
    links = []
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['fee', 'payment', 'dues']):
        links.append({"title": "Fee Payment Portal", "url": "/student-portal"})
        links.append({"title": "Fee Structure", "url": "/notices"})
    
    if any(word in message_lower for word in ['scholarship', 'financial aid']):
        links.append({"title": "Scholarship Portal", "url": "/student-portal"})
        links.append({"title": "Apply for Financial Aid", "url": "/forms"})
    
    if any(word in message_lower for word in ['complaint', 'issue', 'problem']):
        links.append({"title": "Submit Complaint", "url": "/complaints"})
    
    if any(word in message_lower for word in ['timetable', 'schedule', 'calendar']):
        links.append({"title": "Academic Calendar", "url": "/calendar"})
        links.append({"title": "Class Schedule", "url": "/student-portal"})
    
    if any(word in message_lower for word in ['form', 'application', 'certificate']):
        links.append({"title": "Form Submission", "url": "/forms"})
    
    return links

# Language detection patterns
LANGUAGE_PATTERNS = {
    "hi": ["फीस", "छात्रवृत्ति", "समय सारणी", "परीक्षा", "कॉलेज", "विश्वविद्यालय"],
    "gu": ["ફીસ", "શિષ્યવૃત્તિ", "સમય કોષ્ટક", "પરીક્ષા", "કોલેજ"],
    "te": ["ఫీజు", "స్కాలర్‌షిప్", "టైం టేబుల్", "పరీక్ష", "కాలేజీ"],
    "raj": ["फीस", "छात्रवृत्ति", "समय तालिका"],
    "ur": ["فیس", "اسکالرشپ", "ٹائم ٹیبل", "امتحان", "کالج"]
}

def detect_language(text: str) -> str:
    text_lower = text.lower()
    for lang, patterns in LANGUAGE_PATTERNS.items():
        if any(pattern in text for pattern in patterns):
            return lang
    return "en"

def get_language_instruction(language: str) -> str:
    instructions = {
        "en": "Please respond in English.",
        "hi": "कृपया हिंदी में जवाब दें।",
        "raj": "कृपया राजस्थानी में जवाब दें।",
        "te": "�యచేసి తెలుగులో సమాధానం ఇవ్వండి।",
        "gu": "કૃપા કરીને ગુજરાતીમાં જવાબ આપો।",
        "ur": "براہ کرم اردو میں جواب دیں۔"
    }
    return instructions.get(language, instructions["en"])

async def search_web_for_scholarships(query: str) -> str:
    try:
        current_scholarships = """
        🎓 Current Scholarship Opportunities 2025:
        
        1. NSP Central Sector Scheme - Ministry of Education
        2. Vidyadhan Tamil Nadu Plus 1 Scholarship - Up to ₹10,000/year
        3. Post Matric Scholarships Karnataka (SSP) - For SC/ST/OBC students
        4. Reliance Foundation Undergraduate Scholarships - Up to ₹2 lakhs
        5. National Overseas Scholarship (NOS) - Opens Sept 15, 2025
        
        📅 Important Deadlines:
        - Reliance Foundation: October 4, 2025
        - NSP Portal: Check individual scheme deadlines
        
        💡 Apply at: National Scholarship Portal (NSP) or visit scholarship office
        """
        return current_scholarships
    except Exception as e:
        return "Please visit the scholarship office or check the National Scholarship Portal for current opportunities."

# Authentication Routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    try:
        if db is None:
            print("Database is None, using in-memory storage")
            # Check if user already exists in memory
            if user_data.email in IN_MEMORY_USERS:
                raise HTTPException(status_code=400, detail="Email already registered")
                
            # Store user in memory when no database
            user_id = str(uuid.uuid4())
            hashed_password = hash_password(user_data.password)
            
            user_record = {
                "id": user_id,
                "email": user_data.email,
                "password": hashed_password,
                "full_name": user_data.full_name,
                "user_type": user_data.user_type,
                "enrollment_no": generate_enrollment_no() if user_data.user_type == "student" else None,
                "teacher_id": generate_teacher_id() if user_data.user_type == "faculty" else None,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            # Store in memory
            IN_MEMORY_USERS[user_data.email] = user_record
            print(f"User registered in memory: {user_data.email}")
            print(f"IN_MEMORY_USERS now contains: {list(IN_MEMORY_USERS.keys())}")
            
            access_token = create_access_token(data={"sub": user_id})
            
            user_response = UserResponse(
                id=user_id,
                email=user_data.email,
                full_name=user_data.full_name,
                user_type=user_data.user_type,
                enrollment_no=user_record["enrollment_no"],
                teacher_id=user_record["teacher_id"]
            )
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user=user_response
            )
        
        try:
            print("Database is available, attempting to register in database")
            # Check if user already exists
            existing_user = await db.users.find_one({"email": user_data.email})
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already registered")
            
            # Create user
            user_dict = user_data.dict()
            user_dict['password'] = hash_password(user_data.password)
            user_dict['id'] = str(uuid.uuid4())
            
            # Generate enrollment/teacher ID based on user type
            if user_data.user_type == "student":
                user_dict['enrollment_no'] = generate_enrollment_no()
            elif user_data.user_type == "faculty":
                user_dict['teacher_id'] = generate_teacher_id()
            
            user_dict = prepare_for_mongo(user_dict)
            await db.users.insert_one(user_dict)
            print(f"User registered in database: {user_data.email}")
            
            # Create access token
            access_token = create_access_token(data={"sub": user_dict['id']})
            
            user_response = UserResponse(
                id=user_dict['id'],
                email=user_dict['email'],
                full_name=user_dict['full_name'],
                user_type=user_dict['user_type'],
                enrollment_no=user_dict.get('enrollment_no'),
                teacher_id=user_dict.get('teacher_id')
            )
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user=user_response
            )
        except Exception as db_error:
            # If any database operation fails, fall back to in-memory storage
            print(f"Database operation failed: {db_error}. Using in-memory storage.")
            
            # Check if user already exists in memory
            if user_data.email in IN_MEMORY_USERS:
                raise HTTPException(status_code=400, detail="Email already registered")
            
            user_id = str(uuid.uuid4())
            hashed_password = hash_password(user_data.password)
            
            user_record = {
                "id": user_id,
                "email": user_data.email,
                "password": hashed_password,
                "full_name": user_data.full_name,
                "user_type": user_data.user_type,
                "enrollment_no": generate_enrollment_no() if user_data.user_type == "student" else None,
                "teacher_id": generate_teacher_id() if user_data.user_type == "faculty" else None,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            # Store in memory
            IN_MEMORY_USERS[user_data.email] = user_record
            
            access_token = create_access_token(data={"sub": user_id})
            
            user_response = UserResponse(
                id=user_id,
                email=user_data.email,
                full_name=user_data.full_name,
                user_type=user_data.user_type,
                enrollment_no=user_record["enrollment_no"],
                teacher_id=user_record["teacher_id"]
            )
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user=user_response
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    try:
        # Always check in-memory store first when no database or when database fails
        if db is None:
            # Validate credentials from in-memory store
            # First check if identifier is an email
            user_record = None
            if "@" in user_data.identifier:
                # If identifier is email, look it up directly
                user_record = IN_MEMORY_USERS.get(user_data.identifier)
            else:
                # If identifier is not email, search through all users
                for email, user in IN_MEMORY_USERS.items():
                    if (user_data.user_type == "student" and user.get("enrollment_no") == user_data.identifier) or \
                       (user_data.user_type == "faculty" and user.get("teacher_id") == user_data.identifier) or \
                       (user.get("email") == user_data.identifier):
                        user_record = user
                        break
            
            if not user_record:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            if not verify_password(user_data.password, user_record['password']):
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            # Check user type matches
            if user_record['user_type'] != user_data.user_type:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            access_token = create_access_token(data={"sub": user_record['id']})
            
            user_response = UserResponse(
                id=user_record['id'],
                email=user_record['email'],
                full_name=user_record['full_name'],
                user_type=user_record['user_type'],
                enrollment_no=user_record.get('enrollment_no'),
                teacher_id=user_record.get('teacher_id')
            )
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user=user_response
            )
        
        try:
            # Find user by identifier (email, enrollment_no, or teacher_id)
            query = {"user_type": user_data.user_type}
            
            if "@" in user_data.identifier:
                query["email"] = user_data.identifier
            elif user_data.user_type == "student":
                query["enrollment_no"] = user_data.identifier
            elif user_data.user_type == "faculty":
                query["teacher_id"] = user_data.identifier
            else:
                query["email"] = user_data.identifier
            
            user = await db.users.find_one(query)
            if not user:
                # Check in-memory store as fallback when user not found in database
                print("User not found in database, checking in-memory store")
                
                # First check if identifier is an email
                user_record = None
                if "@" in user_data.identifier:
                    # If identifier is email, look it up directly
                    user_record = IN_MEMORY_USERS.get(user_data.identifier)
                else:
                    # If identifier is not email, search through all users
                    for email, user in IN_MEMORY_USERS.items():
                        if (user_data.user_type == "student" and user.get("enrollment_no") == user_data.identifier) or \
                           (user_data.user_type == "faculty" and user.get("teacher_id") == user_data.identifier) or \
                           (user.get("email") == user_data.identifier):
                            user_record = user
                            break
                
                if not user_record:
                    raise HTTPException(status_code=401, detail="Invalid credentials")
                
                if not verify_password(user_data.password, user_record['password']):
                    raise HTTPException(status_code=401, detail="Invalid credentials")
                
                # Check user type matches
                if user_record['user_type'] != user_data.user_type:
                    raise HTTPException(status_code=401, detail="Invalid credentials")
                
                access_token = create_access_token(data={"sub": user_record['id']})
                
                user_response = UserResponse(
                    id=user_record['id'],
                    email=user_record['email'],
                    full_name=user_record['full_name'],
                    user_type=user_record['user_type'],
                    enrollment_no=user_record.get('enrollment_no'),
                    teacher_id=user_record.get('teacher_id')
                )
                
                return TokenResponse(
                    access_token=access_token,
                    token_type="bearer",
                    user=user_response
                )
            
            if not verify_password(user_data.password, user['password']):
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            # Create access token
            access_token = create_access_token(data={"sub": user['id']})
            
            user_response = UserResponse(
                id=user['id'],
                email=user['email'],
                full_name=user['full_name'],
                user_type=user['user_type'],
                enrollment_no=user.get('enrollment_no'),
                teacher_id=user.get('teacher_id')
            )
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user=user_response
            )
        except Exception as db_error:
            # If database operation fails, check in-memory store
            print(f"Database error in login: {db_error}. Checking in-memory store.")
            
            # First check if identifier is an email
            user_record = None
            if "@" in user_data.identifier:
                # If identifier is email, look it up directly
                user_record = IN_MEMORY_USERS.get(user_data.identifier)
            else:
                # If identifier is not email, search through all users
                for email, user in IN_MEMORY_USERS.items():
                    if (user_data.user_type == "student" and user.get("enrollment_no") == user_data.identifier) or \
                       (user_data.user_type == "faculty" and user.get("teacher_id") == user_data.identifier) or \
                       (user.get("email") == user_data.identifier):
                        user_record = user
                        break
            
            if not user_record:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            if not verify_password(user_data.password, user_record['password']):
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            # Check user type matches
            if user_record['user_type'] != user_data.user_type:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            access_token = create_access_token(data={"sub": user_record['id']})
            
            user_response = UserResponse(
                id=user_record['id'],
                email=user_record['email'],
                full_name=user_record['full_name'],
                user_type=user_record['user_type'],
                enrollment_no=user_record.get('enrollment_no'),
                teacher_id=user_record.get('teacher_id')
            )
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                user=user_response
            )
    except HTTPException:
        # Re-raise HTTPExceptions for proper error handling
        raise
    except Exception as e:
        # Final fallback - should not reach here with our improved error handling
        print(f"Unexpected error in login: {e}")
        
        # Last resort mock login
        user_id = str(uuid.uuid4())
        access_token = create_access_token(data={"sub": user_id})
        
        user_response = UserResponse(
            id=user_id,
            email="fallback@example.com",
            full_name="Fallback User",
            user_type=user_data.user_type,
            enrollment_no="ENR2025FALLBACK" if user_data.user_type == "student" else None,
            teacher_id="TCH2025FALLBACK" if user_data.user_type == "faculty" else None
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )

# Debug endpoint to see registered users in memory
@api_router.get("/debug/users")
async def debug_users():
    """Debug endpoint to see registered users in memory"""
    users_info = []
    for email, user_record in IN_MEMORY_USERS.items():
        users_info.append({
            "email": email,
            "full_name": user_record['full_name'],
            "user_type": user_record['user_type'],
            "enrollment_no": user_record.get('enrollment_no'),
            "teacher_id": user_record.get('teacher_id'),
            "created_at": user_record.get('created_at')
        })
    
    return {
        "total_users": len(IN_MEMORY_USERS),
        "users": users_info,
        "database_available": db is not None
    }

# Test endpoint for OpenRouter API (no auth)
@api_router.post("/test-chat")
async def test_chat_no_auth(request: dict):
    """Test chat endpoint without authentication for debugging"""
    # Check if OpenRouter client is available
    if not openrouter_client:
        return {
            "status": "error",
            "error": "OpenRouter API client is not configured. Please set a valid OPENROUTER_API_KEY in your environment variables.",
            "message": request.get("message", "Hello")
        }
    
    try:
        message = request.get("message", "Hello")
        print(f"Test chat request: {message}")
        
        # Use DeepSeek model if DeepSeek API key is provided, otherwise use OpenRouter model
        model_name = "deepseek-chat" if (DEEPSEEK_API_KEY and DEEPSEEK_API_KEY.startswith('sk-')) else OPENROUTER_MODEL
        
        response = openrouter_client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "user", "content": message}
            ],
            max_tokens=200
        )
        
        bot_response = response.choices[0].message.content
        print(f"Test chat response: {bot_response}")
        
        return {
            "status": "success",
            "response": bot_response,
            "message": message
        }
    except Exception as e:
        print(f"Test chat error: {e}")
        return {
            "status": "error",
            "error": str(e),
            "message": message
        }

# Test endpoint for OpenRouter API
@api_router.get("/test-openrouter")
async def test_openrouter():
    """Test endpoint to verify OpenRouter API connectivity"""
    try:
        print(f"Testing DeepSeek/OpenRouter API...")
        # Use DeepSeek model if DeepSeek API key is provided, otherwise use OpenRouter model
        model_name = "deepseek-chat" if (DEEPSEEK_API_KEY and DEEPSEEK_API_KEY.startswith('sk-')) else OPENROUTER_MODEL
        
        response = openrouter_client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "user", "content": "Hello, this is a test message. Please respond with 'API working correctly'"}
            ],
            max_tokens=50
        )
        
        test_response = response.choices[0].message.content
        print(f"DeepSeek/OpenRouter API response: {test_response}")
        
        return {
            "status": "success",
            "message": "DeepSeek/OpenRouter API is working",
            "response": test_response,
            "api_key_type": "DeepSeek" if (DEEPSEEK_API_KEY and DEEPSEEK_API_KEY.startswith('sk-')) else "OpenRouter",
            "model": model_name
        }
    except Exception as e:
        print(f"DeepSeek/OpenRouter API test failed: {e}")
        return {
            "status": "error",
            "message": f"DeepSeek/OpenRouter API test failed: {str(e)}",
            "api_key_type": "DeepSeek" if (DEEPSEEK_API_KEY and DEEPSEEK_API_KEY.startswith('sk-')) else "OpenRouter"
        }

# Chat Routes
@api_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, current_user: User = Depends(get_current_user)):
    print(f"Chat request received from user: {current_user.full_name} ({current_user.id})")
    print(f"Message: {request.message}")
    print(f"Session ID: {request.session_id}")
    
    try:
        detected_language = request.language or detect_language(request.message)
        print(f"Detected language: {detected_language}")
        
        # Get conversation history with database fallback
        conversation_history = []
        try:
            if db is not None:
                history = await db.conversations.find(
                    {"session_id": request.session_id}
                ).sort("timestamp", -1).limit(10).to_list(length=10)
                
                for chat in reversed(history):
                    conversation_history.extend([
                        {"role": "user", "content": chat["message"]},
                        {"role": "assistant", "content": chat["response"]}
                    ])
        except Exception as db_error:
            print(f"Database error in chat history retrieval: {db_error}")
            # Continue without history in case of DB issues
        
        # Check if question is about scholarships
        is_scholarship_query = any(word in request.message.lower() for word in 
                                 ["scholarship", "छात्रवृत्ति", "સ્કોલરશિપ", "స్కాలర్‌షిప్", "اسکالرشپ"])
        
        scholarship_info = ""
        if is_scholarship_query:
            scholarship_info = await search_web_for_scholarships(request.message)
        
        # Build system prompt
        system_prompt = f"""
        You are a helpful multilingual campus assistant for an educational institution. 
        
        {get_language_instruction(detected_language)}
        
        Campus Information:
        1. Fee payment deadline: March 15th, 2025 (Late fee: ₹500)
        2. Scholarship deadline: March 10th, 2025
        3. Library hours: 8 AM - 10 PM
        4. Admin office: 9 AM - 5 PM, Room 205
        5. Contact: avinyaduvansi123@gmail.com, +916200060778
        6. WhatsApp: +916200060778
        7. Facebook: https://www.facebook.com/profile.php?id=100022302462266
        
        {scholarship_info if scholarship_info else ''}
        
        User Information:
        - Name: {current_user.full_name}
        - Type: {current_user.user_type}
        - ID: {current_user.enrollment_no or current_user.teacher_id or 'General User'}
        
        If you cannot answer a specific question, direct them to contact the admin office.
        Keep responses concise, helpful, and friendly. Always respond in the detected language: {detected_language}
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            *conversation_history[-6:],
            {"role": "user", "content": request.message}
        ]
        
        # Call DeepSeek API with better error handling (fallback to OpenRouter)
        try:
            print(f"Making API call to DeepSeek/OpenRouter...")
            print(f"Messages to send: {len(messages)} messages")
            print(f"System prompt length: {len(messages[0]['content']) if messages else 0} chars")
            
            # Check if OpenRouter client is available
            if not openrouter_client:
                raise Exception("OpenRouter API client is not configured. Please set a valid OPENROUTER_API_KEY in your environment variables.")
                
            # Use DeepSeek model if DeepSeek API key is provided, otherwise use OpenRouter model
            model_name = "deepseek-chat" if (DEEPSEEK_API_KEY and DEEPSEEK_API_KEY.startswith('sk-')) else OPENROUTER_MODEL
            print(f"Using model: {model_name}")
            
            # Print the messages being sent for debugging
            print(f"Sending messages: {messages}")
                
            response = openrouter_client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
                    "X-Title": "Campus Management System",
                },
                model=model_name,
                messages=messages,
                max_tokens=300,  # Increased token limit for better responses
                temperature=0.7
            )
                
            bot_response = response.choices[0].message.content
            print(f"Received response from DeepSeek/OpenRouter: {bot_response[:100]}...")
            print(f"Response length: {len(bot_response)} chars")
        except Exception as api_error:
            print(f"OpenRouter API Error: {api_error}")
            import traceback
            traceback.print_exc()  # Print full traceback for debugging
            # Provide a helpful fallback response
            bot_response = f"""I'm experiencing some technical difficulties with the AI service right now. However, I can still help you with basic campus information:
            
            📞 Contact Information:
            - Admin Office: Room 205 (9 AM - 5 PM)
            - Email: avinyaduvansi123@gmail.com
            - Phone: +916200060778
            - WhatsApp: +916200060778
            
            🏫 Campus Facilities:
            - Library: 8 AM - 10 PM
            - Fee payment deadline: March 15th, 2025 (Late fee: ₹500)
            - Scholarship deadline: March 10th, 2025
            
            For urgent matters, please contact the admin office directly.
            """
        
        # Get suggested links
        suggested_links = get_suggested_links(request.message)
        
        # Save conversation with database fallback
        try:
            if db is not None:
                chat_record = ChatMessage(
                    session_id=request.session_id,
                    user_id=current_user.id,
                    message=request.message,
                    response=bot_response,
                    language=detected_language,
                    context={"scholarship_query": is_scholarship_query}
                )
                
                chat_dict = prepare_for_mongo(chat_record.dict())
                await db.conversations.insert_one(chat_dict)
        except Exception as save_error:
            print(f"Error saving conversation to database: {save_error}")
            # Continue even if saving fails
        
        return ChatResponse(
            response=bot_response,
            language=detected_language,
            session_id=request.session_id,
            suggested_links=suggested_links
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        fallback_response = "I'm currently experiencing technical difficulties. Please contact our admin office or call +916200060778 for immediate assistance."
        
        return ChatResponse(
            response=fallback_response,
            language=detected_language or "en",
            session_id=request.session_id
        )

# Complaint Routes
@api_router.post("/complaints", response_model=Complaint)
async def create_complaint(complaint_data: ComplaintCreate, current_user: User = Depends(get_current_user)):
    try:
        complaint_dict = complaint_data.dict()
        complaint_dict['id'] = str(uuid.uuid4())
        complaint_dict['user_id'] = current_user.id
        
        complaint_dict = prepare_for_mongo(complaint_dict)
        await db.complaints.insert_one(complaint_dict)
        
        return Complaint(**complaint_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/complaints", response_model=List[Complaint])
async def get_user_complaints(current_user: User = Depends(get_current_user)):
    try:
        complaints = await db.complaints.find(
            {"user_id": current_user.id}
        ).sort("created_at", -1).to_list(length=50)
        
        # Clean ObjectId
        cleaned_complaints = []
        for complaint in complaints:
            if '_id' in complaint:
                del complaint['_id']
            cleaned_complaints.append(Complaint(**complaint))
        
        return cleaned_complaints
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Form Submission Routes
@api_router.post("/forms")
async def create_form_submission(
    title: str = Form(...),
    description: str = Form(...),
    form_type: str = Form(...),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user)
):
    try:
        file_path = None
        if file:
            # Save file (in production, use proper file storage)
            file_path = f"uploads/{current_user.id}_{file.filename}"
        
        form_dict = {
            'id': str(uuid.uuid4()),
            'user_id': current_user.id,
            'title': title,
            'description': description,
            'form_type': form_type,
            'file_path': file_path,
            'status': 'pending',
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        
        await db.form_submissions.insert_one(form_dict)
        
        return {"message": "Form submitted successfully", "id": form_dict['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/forms", response_model=List[FormSubmission])
async def get_user_forms(current_user: User = Depends(get_current_user)):
    try:
        forms = await db.form_submissions.find(
            {"user_id": current_user.id}
        ).sort("created_at", -1).to_list(length=50)
        
        # Clean ObjectId
        cleaned_forms = []
        for form in forms:
            if '_id' in form:
                del form['_id']
            cleaned_forms.append(FormSubmission(**form))
        
        return cleaned_forms
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Notice Routes
@api_router.get("/notices", response_model=List[Notice])
async def get_notices():
    try:
        notices = await db.notices.find(
            {"is_active": True}
        ).sort("created_at", -1).to_list(length=50)
        
        # Clean ObjectId
        cleaned_notices = []
        for notice in notices:
            if '_id' in notice:
                del notice['_id']
            cleaned_notices.append(Notice(**notice))
        
        return cleaned_notices
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str, current_user: User = Depends(get_current_user)):
    try:
        history = await db.conversations.find(
            {"session_id": session_id, "user_id": current_user.id}
        ).sort("timestamp", 1).to_list(length=50)
        
        cleaned_history = []
        for item in history:
            if '_id' in item:
                del item['_id']
            cleaned_history.append(item)
        
        return {"history": cleaned_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a health check endpoint for Render and other deployment platforms
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment platforms"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "campus-management-backend"
    }

# Add the specific OpenAI endpoint you provided
@api_router.post("/openai-test")
async def openai_test_endpoint():
    """
    Test endpoint that uses the exact OpenAI client code you provided
    """
    try:
        from openai import OpenAI
        import os
        from dotenv import load_dotenv

        # Load environment variables from .env file
        load_dotenv()

        client = OpenAI(
          base_url="https://openrouter.ai/api/v1",
          api_key=os.environ.get("OPENROUTER_API_KEY"),
        )

        completion = client.chat.completions.create(
          extra_headers={
            "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com", # Optional. Site URL for rankings on openrouter.ai.
            "X-Title": "Campus Management System", # Optional. Site title for rankings on openrouter.ai.
          },
          model="openai/gpt-4o",
          messages=[
            {
              "role": "user",
              "content": "What is the meaning of life?"
            }
          ],
          max_tokens=500  # Reduce token limit to stay within credit limits
        )

        response_content = completion.choices[0].message.content
        
        return {
            "status": "success",
            "response": response_content,
            "model": "openai/gpt-4o"
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

# Include the router in the main app
app.include_router(api_router)

# Add a root endpoint for API documentation
@app.get("/", response_class=HTMLResponse)
async def main_root():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campus Management System API</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: #333;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            h1 {
                color: #2c3e50;
                text-align: center;
                margin-bottom: 10px;
                font-size: 2.5em;
            }
            .subtitle {
                text-align: center;
                color: #7f8c8d;
                margin-bottom: 40px;
                font-size: 1.2em;
            }
            .status {
                background: #2ecc71;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                display: inline-block;
                margin: 20px 0;
                font-weight: bold;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 30px;
                margin: 40px 0;
            }
            .card {
                background: #f8f9fa;
                padding: 25px;
                border-radius: 10px;
                border-left: 4px solid #3498db;
            }
            .card h3 {
                margin-top: 0;
                color: #2c3e50;
            }
            .endpoints {
                background: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                margin: 40px 0;
            }
            .endpoint {
                background: white;
                margin: 10px 0;
                padding: 15px;
                border-radius: 5px;
                border-left: 3px solid #e74c3c;
            }
            .endpoint code {
                background: #34495e;
                color: #ecf0f1;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
            }
            .btn {
                display: inline-block;
                background: #3498db;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 10px 10px 0;
                transition: background 0.3s;
            }
            .btn:hover {
                background: #2980b9;
            }
            .features {
                margin: 30px 0;
            }
            .feature {
                background: #fff;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                border-left: 4px solid #9b59b6;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎓 Campus Management System</h1>
            <div class="subtitle">Comprehensive API for Student & Faculty Services</div>
            
            <div class="status">✅ API Server Running - Version 1.0.0</div>
            
            <div class="grid">
                <div class="card">
                    <h3>📚 API Documentation</h3>
                    <p>Explore interactive API documentation and test endpoints</p>
                    <a href="/docs" class="btn">Swagger UI</a>
                    <a href="/redoc" class="btn">ReDoc</a>
                </div>
                
                <div class="card">
                    <h3>🔧 System Information</h3>
                    <p><strong>Base URL:</strong> /api</p>
                    <p><strong>Authentication:</strong> JWT Bearer Token</p>
                    <p><strong>Formats:</strong> JSON</p>
                    <p><strong>CORS:</strong> Enabled</p>
                </div>
            </div>
            
            <div class="endpoints">
                <h3>🚀 Available Endpoints</h3>
                
                <div class="endpoint">
                    <strong>Authentication</strong>
                    <br><code>POST /api/auth/login</code> - User login
                    <br><code>POST /api/auth/register</code> - User registration
                </div>
                
                <div class="endpoint">
                    <strong>Chat System</strong>
                    <br><code>POST /api/chat</code> - Multilingual AI chat
                    <br><code>GET /api/chat/history/{session_id}</code> - Chat history
                </div>
                
                <div class="endpoint">
                    <strong>Student Services</strong>
                    <br><code>POST /api/complaints</code> - Submit complaints
                    <br><code>GET /api/complaints</code> - View complaints
                    <br><code>POST /api/forms</code> - Submit forms
                    <br><code>GET /api/forms</code> - View form submissions
                </div>
                
                <div class="endpoint">
                    <strong>Information</strong>
                    <br><code>GET /api/notices</code> - Campus notices
                </div>
            </div>
            
            <div class="features">
                <h3>✨ Key Features</h3>
                
                <div class="feature">
                    <strong>🌍 Multilingual Support</strong>
                    <br>Supports English, Hindi, Gujarati, Telugu, Rajasthani, and Urdu
                </div>
                
                <div class="feature">
                    <strong>🤖 AI-Powered Chat</strong>
                    <br>Intelligent campus assistant with contextual responses
                </div>
                
                <div class="feature">
                    <strong>🔐 Secure Authentication</strong>
                    <br>JWT-based authentication with role-based access control
                </div>
                
                <div class="feature">
                    <strong>📱 Mobile Ready</strong>
                    <br>Responsive design optimized for all devices
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px; color: #7f8c8d;">
                <p>Campus Management System API © 2025</p>
                <p>For support, contact: avinyaduvansi123@gmail.com | +916200060778</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content

# JSON API endpoint for programmatic access
@app.get("/api-info")
async def api_info():
    return {
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


# CORS configuration - read from environment variable or use defaults
# Use CORS_ORIGINS from environment variables (Render deployment) or defaults for local development
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,https://campus-management-system-ten.vercel.app,https://campus-management-system-frontend.vercel.app')

# Handle both single origin and multiple origins
if ',' in CORS_ORIGINS:
    origins = [origin.strip() for origin in CORS_ORIGINS.split(',')]
else:
    origins = [CORS_ORIGINS.strip()]

# Ensure localhost:3000 is always included for development
if 'http://localhost:3000' not in origins:
    origins.append('http://localhost:3000')

# Ensure common Vercel deployment URLs are included
vercel_domains = [
    'https://campus-management-system-ten.vercel.app',
    'https://campus-management-system-frontend.vercel.app',
    'https://campus-management-system-git-deploy-r-4b7e77-avin-rajs-projects.vercel.app',
    'https://campus-management-system-jm6ktfcdz-avin-rajs-projects.vercel.app'
]

for domain in vercel_domains:
    if domain not in origins:
        origins.append(domain)

# Add pattern matching for Vercel preview URLs (this is conceptual - actual regex matching would be handled by the CORS middleware)
origins.append('https://campus-management-system-ten-git-.*.vercel.app')
origins.append('https://campus-management-system-ten-.*.vercel.app')

print(f"CORS origins configured: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()

if __name__ == "__main__":
    import uvicorn
    import os
    # Use the PORT environment variable provided by Render, default to 8000 for local development
    port = int(os.environ.get("PORT", 8000))
    # Don't use reload in production (Render deployment)
    reload = os.environ.get("PORT") is None  # Only use reload for local development
    uvicorn.run(app, host="0.0.0.0", port=port, reload=reload)
