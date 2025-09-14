from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import json
from openai import OpenAI
import requests

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

# Create the main app without a prefix
app = FastAPI(title="Campus Multilingual Chatbot")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Campus FAQ Database
CAMPUS_FAQ = {
    "en": {
        "fees": {
            "deadline": "Fee payment deadline is March 15th, 2025",
            "late_fee": "Late fee of ₹500 applies after the deadline",
            "payment_methods": "Payment can be made through online portal, bank transfer, or campus office",
            "structure": "Fee structure is available on the student portal"
        },
        "scholarships": {
            "deadline": "Scholarship application deadline is March 10th, 2025",
            "types": "Merit-based and need-based scholarships are available",
            "documents": "Required documents: Income certificate, academic transcripts",
            "process": "Apply through student portal or visit scholarship office"
        },
        "timetables": {
            "classes": "Class schedules are updated weekly on student portal",
            "exams": "Exam timetables are released 2 weeks before exams",
            "labs": "Lab schedules are available with course coordinators"
        },
        "contact": {
            "office_hours": "Admin office hours: 9 AM - 5 PM",
            "library": "Library hours: 8 AM - 10 PM",
            "phone": "+91 98765 43210",
            "email": "support@campus-connect.edu",
            "address": "Admin Building, Room 205"
        }
    },
    "hi": {
        "fees": {
            "deadline": "फीस भुगतान की अंतिम तिथि 15 मार्च, 2025 है",
            "late_fee": "देर से फीस जमा करने पर ₹500 का जुर्माना लगेगा",
            "payment_methods": "भुगतान ऑनलाइन पोर्टल, बैंक ट्रांसफर, या कैंपस कार्यालय के माध्यम से किया जा सकता है",
            "structure": "फीस संरचना छात्र पोर्टल पर उपलब्ध है"
        }
    }
}

# Language detection patterns
LANGUAGE_PATTERNS = {
    "hi": ["फीस", "छात्रवृत्ति", "समय सारणी", "परीक्षा", "कॉलेज", "विश्वविद्यालय"],
    "gu": ["ફીસ", "શિષ્યવૃત્તિ", "સમય કોષ્ટક", "પરીક્ષા", "કોલેજ"],
    "te": ["ఫీజు", "స్కాలర్‌షిప్", "టైం టేబుల్", "పరీక్ష", "కాలేజీ"],
    "raj": ["फीस", "छात्रवृत्ति", "समय तालिका"],
    "ur": ["فیس", "اسکالرشپ", "ٹائم ٹیبل", "امتحان", "کالج"]
}

def detect_language(text: str) -> str:
    """Detect language based on text patterns"""
    text_lower = text.lower()
    
    for lang, patterns in LANGUAGE_PATTERNS.items():
        if any(pattern in text for pattern in patterns):
            return lang
    
    return "en"  # Default to English

def get_language_instruction(language: str) -> str:
    """Get language-specific instructions"""
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
    """Search for current scholarship information"""
    try:
        # Use a web search API or scraping - for now, return static updated info
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

# Define Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
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

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Helper function to prepare data for MongoDB
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

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Campus Multilingual Chatbot API"}

@api_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Detect language if not provided
        detected_language = request.language or detect_language(request.message)
        
        # Get conversation history
        history = await db.conversations.find(
            {"session_id": request.session_id}
        ).sort("timestamp", -1).limit(10).to_list(length=10)
        
        # Build conversation context
        conversation_history = []
        for chat in reversed(history):
            conversation_history.extend([
                {"role": "user", "content": chat["message"]},
                {"role": "assistant", "content": chat["response"]}
            ])
        
        # Check if question is about scholarships for web search
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
        5. Contact: support@campus-connect.edu, +91 98765 43210
        
        {scholarship_info if scholarship_info else ''}
        
        If you cannot answer a specific question, direct them to contact the admin office.
        Keep responses concise, helpful, and friendly. Always respond in the detected language: {detected_language}
        """
        
        # Prepare messages for OpenRouter API
        messages = [
            {"role": "system", "content": system_prompt},
            *conversation_history[-6:],  # Last 3 exchanges
            {"role": "user", "content": request.message}
        ]
        
        # Call OpenRouter API
        response = openrouter_client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://campus-lingua.preview.emergentagent.com",
                "X-Title": "Campus Multilingual Chatbot",
            },
            model="deepseek/deepseek-chat-v3.1:free",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        bot_response = response.choices[0].message.content
        
        # Save conversation to database
        chat_record = ChatMessage(
            session_id=request.session_id,
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
            session_id=request.session_id
        )
        
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        fallback_response = "I'm currently experiencing technical difficulties. Please contact our admin office at Admin Building, Room 205, or call +91 98765 43210 for immediate assistance."
        
        return ChatResponse(
            response=fallback_response,
            language=detected_language or "en",
            session_id=request.session_id
        )

@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    try:
        history = await db.conversations.find(
            {"session_id": session_id}
        ).sort("timestamp", 1).to_list(length=50)
        
        # Remove MongoDB ObjectId from response to prevent serialization errors
        cleaned_history = []
        for item in history:
            if '_id' in item:
                del item['_id']
            cleaned_history.append(item)
        
        return {"history": cleaned_history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    status_dict = prepare_for_mongo(status_obj.dict())
    _ = await db.status_checks.insert_one(status_dict)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

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