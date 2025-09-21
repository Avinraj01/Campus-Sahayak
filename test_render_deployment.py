import os
import pymongo
from dotenv import load_dotenv

# Load environment variables
load_dotenv("backend/.env")

print("=== Render Deployment Configuration Test ===")

# Test MongoDB connection
MONGO_URI = os.environ.get("MONGO_URI")
DB_NAME = os.environ.get("DB_NAME", "campusDB")

print(f"MONGO_URI: {MONGO_URI[:30] if MONGO_URI else 'Not set'}...")
print(f"DB_NAME: {DB_NAME}")

if MONGO_URI:
    try:
        print("Testing MongoDB connection...")
        client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        print("✓ MongoDB connection successful")
        
        # Test database access
        db = client[DB_NAME]
        print(f"✓ Database '{DB_NAME}' accessible")
        
        # List collections
        collections = db.list_collection_names()
        print(f"✓ Collections: {collections}")
        
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
else:
    print("✗ MONGO_URI not set")

# Test environment variables
required_vars = ["OPENROUTER_API_KEY", "JWT_SECRET"]
for var in required_vars:
    value = os.environ.get(var)
    if value:
        print(f"✓ {var}: Set (length: {len(value)})")
    else:
        print(f"✗ {var}: Not set")

print("=== Configuration Test Complete ===")