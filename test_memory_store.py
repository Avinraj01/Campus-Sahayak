import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Import the in-memory store directly
from backend.server import IN_MEMORY_USERS

print("IN_MEMORY_USERS contents:")
print(IN_MEMORY_USERS)
print(f"Total users: {len(IN_MEMORY_USERS)}")