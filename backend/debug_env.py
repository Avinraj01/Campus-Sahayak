import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

print("OPENROUTER_API_KEY from env:", os.environ.get('OPENROUTER_API_KEY'))
print("Length of API key:", len(os.environ.get('OPENROUTER_API_KEY', '')))