import os

print("=== Environment Variables ===")
for key, value in os.environ.items():
    if 'MONGO' in key or 'DB' in key:
        # Mask sensitive values
        if 'KEY' in key or 'SECRET' in key or 'PASSWORD' in key:
            print(f"{key}: {'*' * len(value) if value else 'Not set'}")
        else:
            print(f"{key}: {value}")

print("\n=== Specific Variables ===")
print(f"MONGO_URI: {os.environ.get('MONGO_URI', 'Not set')}")
print(f"MONGO_URL: {os.environ.get('MONGO_URL', 'Not set')}")
print(f"DB_NAME: {os.environ.get('DB_NAME', 'Not set')}")