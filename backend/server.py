from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# OpenRouter client setup
openrouter_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ['OPENROUTER_API_KEY']
)

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-here-change-in-production')
JWT_ALGORITHM = 'HS256'
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI(title="Campus Management System")

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
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

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
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

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
        "te": "దయచేసి తెలుగులో సమాధానం ఇవ్వండి।",
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
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
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chat Routes
@api_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, current_user: User = Depends(get_current_user)):
    try:
        detected_language = request.language or detect_language(request.message)
        
        # Get conversation history
        history = await db.conversations.find(
            {"session_id": request.session_id}
        ).sort("timestamp", -1).limit(10).to_list(length=10)
        
        conversation_history = []
        for chat in reversed(history):
            conversation_history.extend([
                {"role": "user", "content": chat["message"]},
                {"role": "assistant", "content": chat["response"]}
            ])
        
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
        
        # Call OpenRouter API
        response = openrouter_client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
                "X-Title": "Campus Management System",
            },
            model="deepseek/deepseek-chat-v3.1:free",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        bot_response = response.choices[0].message.content
        
        # Get suggested links
        suggested_links = get_suggested_links(request.message)
        
        # Save conversation
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

@api_router.get("/")
async def root():
    return {"message": "Campus Management System API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
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
    client.close()