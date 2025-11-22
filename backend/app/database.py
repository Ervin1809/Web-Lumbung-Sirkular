# app/database.py
import os
from pathlib import Path
from sqlmodel import SQLModel, create_engine, Session

# Try to load .env file (for local development)
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / '.env'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        print("[Database] Loaded .env file")
except ImportError:
    pass  # dotenv not installed, use system env vars

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set! Please check your .env file.")

# Debug: Print to verify correct URL is loaded (hide password)
url_display = DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else DATABASE_URL
print(f"[Database] Connecting to: ...@{url_display}")

# Handle Heroku/Railway style postgres:// URLs (convert to postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine with connection pool settings for production
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for debugging SQL queries
    pool_pre_ping=True,  # Check connection health before using
    pool_recycle=300,  # Recycle connections after 5 minutes
)

def create_db_and_tables():
    """Create all database tables based on SQLModel metadata"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session
