from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from app.database import get_session
from app.models import Transaction, Waste, User
from app.schemas import TransactionRead
from app.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# 1. BOOKING / AMBIL LIMBAH (Khusus Recycler)
@router.post("/book/{waste_id}", response_model=TransactionRead)
def book_waste(
    waste_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Cek Role
    if current_user.role != "recycler":
        raise HTTPException(status_code=403, detail="Hanya Pengolah Limbah yang boleh mengambil")

    # Cek Barang Ada atau Tidak
    waste = session.get(Waste, waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")
    if waste.status != "available":
        raise HTTPException(status_code=400, detail="Limbah sudah diambil orang lain")

    # Mulai Transaksi
    # 1. Update Status Waste
    waste.status = "booked"
    session.add(waste)

    # 2. Buat Transaksi Baru
    transaction = Transaction(
        waste_id=waste_id,
        recycler_id=current_user.id,
        status="pending"
    )
    session.add(transaction)
    
    session.commit()
    session.refresh(transaction)
    return transaction

# 2. SELESAIKAN TRANSAKSI (Barang Diterima)
@router.patch("/{transaction_id}/complete", response_model=TransactionRead)
def complete_transaction(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Cari transaksi
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    # Pastikan yang menyelesaikan adalah yang me-request (Recycler)
    if transaction.recycler_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bukan transaksi Anda")

    # Update Status Transaksi
    transaction.status = "completed"
    transaction.completed_at = datetime.utcnow()
    session.add(transaction)

    # Update Status Waste juga jadi completed
    waste = session.get(Waste, transaction.waste_id)
    waste.status = "completed"
    session.add(waste)

    session.commit()
    session.refresh(transaction)
    return transaction

# ==========================================
# 🔥 3. FITUR JUARA: IMPACT DASHBOARD API 🔥
# ==========================================
@router.get("/impact/me")
def get_my_impact(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    total_weight = 0.0
    
    if current_user.role == "producer":
        # Hitung total berat limbah milik user ini yang statusnya 'completed'
        query = select(func.sum(Waste.weight)).where(
            Waste.producer_id == current_user.id,
            Waste.status == "completed"
        )
        result = session.exec(query).first()
        total_weight = result if result else 0.0

    elif current_user.role == "recycler":
        # Hitung total berat dari transaksi yang user ini lakukan & completed
        # Kita join Transaction -> Waste
        query = select(func.sum(Waste.weight)).join(Transaction).where(
            Transaction.recycler_id == current_user.id,
            Transaction.status == "completed"
        )
        result = session.exec(query).first()
        total_weight = result if result else 0.0

    # Rumus Dampak (Asumsi)
    # Misal: 1 Kg sampah yang diolah = Mencegah 0.5 Kg CO2eq
    co2_saved = total_weight * 0.5 

    return {
        "user_name": current_user.name,
        "role": current_user.role,
        "total_waste_managed_kg": total_weight,
        "co2_emissions_prevented_kg": co2_saved,
        "message": "Data ini valid dan real-time berdasarkan transaksi selesai."
    }