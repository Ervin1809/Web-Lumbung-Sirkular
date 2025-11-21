from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import Waste, User, Transaction
from app.schemas import WasteCreate, WasteRead, WasteUpdate
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

    new_waste = Waste.from_orm(waste)
    new_waste.producer_id = current_user.id
    new_waste.status = "available"
    
    session.add(new_waste)
    session.commit()
    session.refresh(new_waste)
    return new_waste

# 2. LIHAT SEMUA LIMBAH (Katalog Marketplace)
@router.get("/", response_model=List[WasteRead])
def read_wastes(
    category: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(Waste).where(Waste.status == "available")

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

# 4. 🔥 GET DETAIL LIMBAH BY ID
@router.get("/{waste_id}", response_model=WasteRead)
def get_waste_detail(
    waste_id: int,
    session: Session = Depends(get_session)
):
    waste = session.get(Waste, waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")
    return waste

# 5. 🔥 UPDATE LIMBAH (EDIT) - FITUR BARU!
@router.put("/{waste_id}", response_model=WasteRead)
def update_waste(
    waste_id: int,
    waste_update: WasteUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Cek apakah user adalah producer
    if current_user.role != "producer":
        raise HTTPException(status_code=403, detail="Hanya Producer yang boleh edit")
    
    # Ambil waste dari database
    waste = session.get(Waste, waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")
    
    # Validasi: Pastikan ini limbah milik user yang login
    if waste.producer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Anda tidak berhak mengedit limbah ini")
    
    # ⚠️ VALIDASI BISNIS PENTING: Limbah yang sudah booked/completed tidak boleh diedit!
    if waste.status in ["booked", "completed"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Limbah dengan status '{waste.status}' tidak dapat diedit. Hanya limbah dengan status 'available' yang bisa diubah."
        )
    
    # Update fields yang dikirim (partial update)
    update_data = waste_update.dict(exclude_unset=True)
    print(f"🔍 Updating waste {waste_id} with data: {update_data}")

    for field, value in update_data.items():
        setattr(waste, field, value)
        print(f"  Setting {field} = {value}")

    session.add(waste)
    session.commit()
    session.refresh(waste)
    print(f"✅ Updated waste coordinates: lat={waste.latitude}, lng={waste.longitude}")
    return waste

# 6. 🔥 DELETE LIMBAH - FITUR BARU!
@router.delete("/{waste_id}")
def delete_waste(
    waste_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Cek role
    if current_user.role != "producer":
        raise HTTPException(status_code=403, detail="Hanya Producer yang boleh hapus")
    
    # Ambil waste
    waste = session.get(Waste, waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")
    
    # Validasi ownership
    if waste.producer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Anda tidak berhak menghapus limbah ini")
    
    # ⚠️ VALIDASI BISNIS KRITIS: Tidak boleh hapus limbah yang sudah ada transaksi!
    if waste.status == "booked":
        raise HTTPException(
            status_code=400,
            detail="Limbah ini sudah di-booking. Tidak dapat dihapus. Hubungi recycler untuk membatalkan booking terlebih dahulu."
        )
    
    if waste.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Limbah ini sudah selesai ditransaksikan. Tidak dapat dihapus karena ada data historis."
        )
    
    # Safe to delete (status = available)
    session.delete(waste)
    session.commit()
    
    return {
        "message": "Limbah berhasil dihapus",
        "deleted_id": waste_id
    }

# 7. 🔥 GET PRICE RECOMMENDATION - AI FEATURE (Smart Price Estimator)
@router.get("/recommend/price")
def get_price_recommendation(
    category: str,
    weight: float
):
    """
    Smart Price Recommendation berdasarkan kategori dan berat.
    Ini simulasi AI sederhana (rule-based).
    Di production bisa diganti dengan ML model.
    """
    # Database harga pasar rata-rata per Kg (dalam Rupiah)
    price_per_kg = {
        "Minyak": 0,  # Minyak jelantah biasanya gratis atau sangat murah
        "Plastik": 2000,  # Rp 2.000/Kg
        "Organik": 0,  # Kompos biasanya gratis
        "Kertas": 1500,  # Rp 1.500/Kg
        "Logam": 8000,  # Rp 8.000/Kg (besi/aluminium)
    }
    
    base_price = price_per_kg.get(category, 1000)  # Default 1000 jika kategori tidak ditemukan
    
    # Hitung estimasi
    min_price = base_price * weight * 0.8  # 80% dari harga pasar
    max_price = base_price * weight * 1.2  # 120% dari harga pasar
    recommended_price = base_price * weight
    
    return {
        "category": category,
        "weight_kg": weight,
        "currency": "IDR",
        "price_per_kg": base_price,
        "recommendation": {
            "min": round(min_price),
            "max": round(max_price),
            "recommended": round(recommended_price)
        },
        "market_insight": f"Harga pasar untuk {category} berkisar Rp {int(min_price):,} - Rp {int(max_price):,} untuk {weight} Kg",
        "note": "Harga dapat disesuaikan dengan kondisi dan kualitas limbah"
    }