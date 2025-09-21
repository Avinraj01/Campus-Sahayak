#!/usr/bin/env python3
"""
MongoDB connection test script that properly handles event loops.
This script can be run standalone or within an existing event loop.
"""

import os
import sys
import asyncio
from dotenv import load_dotenv
import pymongo.errors

async def test_mongo_connection_async():
    """Test MongoDB connection asynchronously."""
    try:
        # Load environment variables
        load_dotenv()
        
        # Get MongoDB URL from environment
        mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/campus_management")
        db_name = os.getenv("DB_NAME", "campus_management")
        
        print(f"📍 Connecting to MongoDB at: {mongo_url}")
        
        # Use synchronous MongoDB client for testing to avoid event loop conflicts
        from pymongo import MongoClient
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        
        # Test database access
        db = client[db_name]
        collection_names = db.list_collection_names()
        print(f"✅ MongoDB connection successful!")
        print(f"📚 Database '{db_name}' contains collections: {collection_names}")
        
        # Close connection
        client.close()
        return True
        
    except pymongo.errors.ServerSelectionTimeoutError as e:
        print(f"❌ MongoDB connection timeout - check connection string or network")
        print(f"   Error details: {e}")
        return False
    except pymongo.errors.ConfigurationError as e:
        print(f"❌ MongoDB configuration error: {e}")
        return False
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

def test_mongo_connection():
    """Test MongoDB connection, handling both sync and async contexts."""
    try:
        # We'll use synchronous approach to avoid event loop conflicts
        # Load environment variables
        load_dotenv()
        
        # Get MongoDB URL from environment
        mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/campus_management")
        db_name = os.getenv("DB_NAME", "campus_management")
        
        print(f"📍 Connecting to MongoDB at: {mongo_url}")
        
        # Use synchronous MongoDB client for testing to avoid event loop conflicts
        from pymongo import MongoClient
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        
        # Test database access
        db = client[db_name]
        collection_names = db.list_collection_names()
        print(f"✅ MongoDB connection successful!")
        print(f"📚 Database '{db_name}' contains collections: {collection_names}")
        
        # Close connection
        client.close()
        return True
        
    except pymongo.errors.ServerSelectionTimeoutError as e:
        print(f"❌ MongoDB connection timeout - check connection string or network")
        print(f"   Error details: {e}")
        return False
    except pymongo.errors.ConfigurationError as e:
        print(f"❌ MongoDB configuration error: {e}")
        return False
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing MongoDB connection...")
    print("=" * 40)
    
    success = test_mongo_connection()
    
    print("\n" + "=" * 40)
    if success:
        print("✅ MongoDB connection test completed successfully!")
        sys.exit(0)
    else:
        print("❌ MongoDB connection test failed!")
        sys.exit(1)