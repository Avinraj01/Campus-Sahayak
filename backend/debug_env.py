import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Print all environment variables related to our app
print("Environment Variables:")
print(f"OPENROUTER_API_KEY: {os.getenv('OPENROUTER_API_KEY')}")
print(f"MONGO_URL: {os.getenv('MONGO_URL')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"JWT_SECRET: {os.getenv('JWT_SECRET')}")

# Check if .env file exists
import os.path
env_path = os.path.join(os.path.dirname(__file__), '.env')
print(f"\n.env file exists: {os.path.exists(env_path)}")
if os.path.exists(env_path):
    print(f".env file path: {env_path}")
    # Read and print first few lines of .env file
    with open(env_path, 'r') as f:
        lines = f.readlines()
        print("\nFirst 10 lines of .env file:")
        for i, line in enumerate(lines[:10]):
            print(f"{i+1}: {line.strip()}")