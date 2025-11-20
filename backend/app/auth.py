# app/auth.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from app.database import get_session
from app.models import User

# --- KONFIGURASI KEAMANAN ---
# Di production, SECRET_KEY harus panjang dan rahasia (simpan di .env)
# Untuk lomba, hardcode begini tidak apa-apa.
SECRET_KEY = "rahasia_ilahi_lumbung_sirkular_2025"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # Token berlaku 24 jam

# Setup Hashing Password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Setup Scheme Auth untuk Swagger UI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# --- FUNGSI UTILITY ---

def verify_password(plain_password, hashed_password):
    """Cek apakah password inputan cocok dengan hash di DB"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Ubah password biasa jadi kode acak (Hash)"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Membuat JWT Token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """
    Fungsi SAKTI. Dipakai di Route lain untuk:
    1. Cek apakah user kirim token?
    2. Apakah tokennya asli?
    3. Siapa pemilik token ini?
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Cari user di database
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    
    if user is None:
        raise credentials_exception
        
    return user