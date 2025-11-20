from fastapi import FastAPI
from app.database import create_db_and_tables
# Import routers yang baru dibuat
from app.routes import auth, wastes, transactions 

app = FastAPI(title="Lumbung Sirkular API")

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