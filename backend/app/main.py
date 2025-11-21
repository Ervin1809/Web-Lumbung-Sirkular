from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import create_db_and_tables
# Import routers yang baru dibuat
from app.routes import auth, wastes, transactions, upload

app = FastAPI(title="Lumbung Sirkular API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Welcome to Lumbung Sirkular API!"}

# Pasang Router
app.include_router(auth.router)
app.include_router(wastes.router)
app.include_router(transactions.router)
app.include_router(upload.router)

# Mount static files untuk serve gambar yang diupload
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")