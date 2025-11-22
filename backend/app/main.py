import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import create_db_and_tables
# Import routers yang baru dibuat
from app.routes import auth, wastes, transactions, upload

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Lumbung Sirkular API")

# Get allowed origins from environment or use defaults
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
if not ALLOWED_ORIGINS or ALLOWED_ORIGINS == [""]:
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Add common Vercel domains if in production
ALLOWED_ORIGINS.extend([
    "https://lumbung-sirkular.vercel.app",
    "https://web-lumbung-sirkular.vercel.app",
    "https://lumbung-sirkulartrio-ayam-jantan.vercel.app",
])

# Remove empty strings and duplicates
ALLOWED_ORIGINS = list(set(filter(None, ALLOWED_ORIGINS)))

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Welcome to Lumbung Sirkular API!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}

# Pasang Router
app.include_router(auth.router)
app.include_router(wastes.router)
app.include_router(transactions.router)
app.include_router(upload.router)

# Mount static files untuk serve gambar yang diupload
# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
