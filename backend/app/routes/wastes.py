from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import Waste, User
from app.schemas import WasteCreate, WasteRead
from app.auth import get_current_user

router = APIRouter(prefix="/wastes", tags=["Wastes"])

# 1. UPLOAD LIMBAH BARU (Khusus Producer)
@router.post("/", response_model=WasteRead)
def create_waste(
    waste: WasteCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "producer":
        raise HTTPException(status_code=403, detail="Hanya Penghasil Limbah yang boleh upload")

    # Konversi dari Schema ke Model Database
    new_waste = Waste.from_orm(waste)
    new_waste.producer_id = current_user.id # Set pemilik otomatis
    new_waste.status = "available" # Default status
    
    session.add(new_waste)
    session.commit()
    session.refresh(new_waste)
    return new_waste

# 2. LIHAT SEMUA LIMBAH (Katalog Marketplace)
@router.get("/", response_model=List[WasteRead])
def read_wastes(
    category: Optional[str] = None, # Bisa filter ?category=Plastik
    session: Session = Depends(get_session)
    # Tidak perlu autentikasi - siapa saja bisa lihat katalog
):
    # Query dasar: Cari yang available saja
    query = select(Waste).where(Waste.status == "available")

    # Jika ada filter kategori
    if category:
        query = query.where(Waste.category == category)

    results = session.exec(query).all()
    return results

# 3. LIHAT LIMBAH SAYA (Dashboard Producer)
@router.get("/me", response_model=List[WasteRead])
def read_my_wastes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "producer":
        raise HTTPException(status_code=403, detail="Anda bukan Producer")
        
    query = select(Waste).where(Waste.producer_id == current_user.id)
    results = session.exec(query).all()
    return results