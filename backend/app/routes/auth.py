# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.database import get_session
from app.models import User
from app.schemas import UserCreate, UserRead, Token
from app.auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])

# 1. REGISTER USER BARU
@router.post("/register", response_model=UserRead)
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    # Cek apakah email sudah ada?
    statement = select(User).where(User.email == user.email)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash Password sebelum simpan ke DB
    hashed_pwd = get_password_hash(user.password)
    
    # Buat Object User Baru
    new_user = User(
        email=user.email,
        password_hash=hashed_pwd, # Simpan yang sudah di-hash!
        name=user.name,
        role=user.role,
        contact=user.contact
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return new_user

# 2. LOGIN (DAPAT TOKEN)
@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    # Cari user berdasarkan email (form_data.username diisi email)
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    # Validasi User & Password
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Jika sukses, buat Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}