from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from app.database import get_session
from app.models import Transaction, Waste, User
from app.schemas import TransactionRead, TransactionCreate
from app.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# 1. BOOKING / AMBIL LIMBAH (Khusus Recycler)
@router.post("/book/{waste_id}", response_model=TransactionRead)
def book_waste(
    waste_id: int,
    booking_data: TransactionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "recycler":
        raise HTTPException(status_code=403, detail="Hanya Pengolah Limbah yang boleh mengambil")

    waste = session.get(Waste, waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")
    if waste.status != "available":
        raise HTTPException(status_code=400, detail="Limbah sudah diambil orang lain")

    # Update Status Waste
    waste.status = "booked"
    session.add(waste)

    # Buat Transaksi Baru
    transaction = Transaction(
        waste_id=waste_id,
        recycler_id=current_user.id,
        status="pending",  # Status awal pending (menunggu pickup)
        pickup_date=booking_data.pickup_date,
        pickup_time=booking_data.pickup_time,
        estimated_quantity=booking_data.estimated_quantity,
        transport_method=booking_data.transport_method,
        contact_person=booking_data.contact_person,
        contact_phone=booking_data.contact_phone,
        pickup_address=booking_data.pickup_address,
        notes=booking_data.notes
    )
    session.add(transaction)

    session.commit()
    session.refresh(transaction)
    return transaction

# 2. 🔥 RECYCLER KLAIM SUDAH AMBIL BARANG (Step 1 of 2)
@router.patch("/{transaction_id}/claim-received", response_model=TransactionRead)
def recycler_claim_received(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Recycler mengklaim bahwa barang sudah diambil.
    Status berubah menjadi 'waiting_confirmation'.
    Producer harus konfirmasi sebelum transaksi benar-benar completed.
    """
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    # Pastikan yang klaim adalah recycler yang booking
    if transaction.recycler_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bukan transaksi Anda")

    # Pastikan status masih pending
    if transaction.status != "pending":
        raise HTTPException(
            status_code=400, 
            detail=f"Transaksi dengan status '{transaction.status}' tidak bisa diklaim"
        )

    # Update status ke waiting_confirmation
    transaction.status = "waiting_confirmation"
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    
    return transaction

# 3. PRODUCER KONFIRMASI SERAH TERIMA (Step 2 of 2)
@router.patch("/{transaction_id}/confirm-handover", response_model=TransactionRead)
def producer_confirm_handover(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Producer mengkonfirmasi bahwa barang benar sudah diserahkan ke recycler.
    Setelah ini transaksi status jadi 'completed'.
    """
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    # Ambil waste untuk validasi
    waste = session.get(Waste, transaction.waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")

    # Pastikan yang konfirmasi adalah producer pemilik waste
    if waste.producer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Anda bukan pemilik limbah ini")

    # Pastikan status sedang waiting_confirmation
    if transaction.status != "waiting_confirmation":
        raise HTTPException(
            status_code=400,
            detail=f"Transaksi dengan status '{transaction.status}' tidak bisa dikonfirmasi. Status harus 'waiting_confirmation'"
        )

    # Update status ke completed
    transaction.status = "completed"
    transaction.completed_at = datetime.utcnow()
    session.add(transaction)

    # Update status waste juga
    waste.status = "completed"
    session.add(waste)

    session.commit()
    session.refresh(transaction)
    return transaction

# 4. 🔥 CANCEL BOOKING - FITUR BARU!
@router.delete("/{transaction_id}/cancel")
def cancel_booking(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Membatalkan booking.
    - Recycler bisa cancel jika status masih pending atau waiting_confirmation
    - Producer bisa cancel jika recycler tidak jadi ambil
    """
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    waste = session.get(Waste, transaction.waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")

    # Cek siapa yang cancel
    is_recycler = (transaction.recycler_id == current_user.id)
    is_producer = (waste.producer_id == current_user.id)

    if not (is_recycler or is_producer):
        raise HTTPException(status_code=403, detail="Anda tidak berhak membatalkan transaksi ini")

    # Tidak boleh cancel jika sudah completed
    if transaction.status == "completed":
        raise HTTPException(status_code=400, detail="Transaksi yang sudah selesai tidak bisa dibatalkan")

    # Update status
    transaction.status = "cancelled"
    session.add(transaction)

    # Kembalikan waste ke status available
    waste.status = "available"
    session.add(waste)

    session.commit()

    return {
        "message": "Booking berhasil dibatalkan",
        "transaction_id": transaction_id,
        "waste_id": waste.id,
        "cancelled_by": current_user.role
    }

# 5. GET TRANSACTION DETAIL by WASTE ID (untuk Producer)
@router.get("/waste/{waste_id}")
def get_transaction_by_waste(
    waste_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    waste = session.get(Waste, waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")

    if waste.producer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bukan limbah Anda")

    query = select(Transaction).where(Transaction.waste_id == waste_id)
    transaction = session.exec(query).first()

    if not transaction:
        return None

    recycler = session.get(User, transaction.recycler_id)

    return {
        "transaction": transaction,
        "recycler": {
            "id": recycler.id,
            "name": recycler.name,
            "email": recycler.email,
            "contact": recycler.contact
        }
    }

# 6. 🔥 GET MY TRANSACTIONS (untuk Recycler)
@router.get("/my-bookings", response_model=List[TransactionRead])
def get_my_bookings(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Recycler bisa melihat semua transaksi/booking yang pernah dibuat
    """
    if current_user.role != "recycler":
        raise HTTPException(status_code=403, detail="Hanya recycler yang bisa akses endpoint ini")
    
    query = select(Transaction).where(Transaction.recycler_id == current_user.id)
    transactions = session.exec(query).all()
    return transactions

# 7. IMPACT DASHBOARD API (Real-time Metrics)
@router.get("/impact/me")
def get_my_impact(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    total_weight = 0.0

    if current_user.role == "producer":
        # Total berat limbah yang sudah completed
        query = select(func.sum(Waste.weight)).where(
            Waste.producer_id == current_user.id,
            Waste.status == "completed"
        )
        result = session.exec(query).first()
        total_weight = result if result else 0.0

        # Hitung jumlah limbah berdasarkan status
        available_query = select(func.count(Waste.id)).where(
            Waste.producer_id == current_user.id,
            Waste.status == "available"
        )
        available_wastes = session.exec(available_query).first() or 0

        # Hitung transaksi berdasarkan status (dari limbah producer)
        pending_query = select(func.count(Transaction.id)).join(Waste).where(
            Waste.producer_id == current_user.id,
            Transaction.status == "pending"
        )
        pending_transactions = session.exec(pending_query).first() or 0

        waiting_query = select(func.count(Transaction.id)).join(Waste).where(
            Waste.producer_id == current_user.id,
            Transaction.status == "waiting_confirmation"
        )
        processing_transactions = session.exec(waiting_query).first() or 0

        completed_query = select(func.count(Transaction.id)).join(Waste).where(
            Waste.producer_id == current_user.id,
            Transaction.status == "completed"
        )
        completed_transactions = session.exec(completed_query).first() or 0

    elif current_user.role == "recycler":
        # Total berat limbah yang sudah di-recycle (completed)
        query = select(func.sum(Waste.weight)).join(Transaction).where(
            Transaction.recycler_id == current_user.id,
            Transaction.status == "completed"
        )
        result = session.exec(query).first()
        total_weight = result if result else 0.0

        # Untuk recycler tidak ada available wastes
        available_wastes = 0

        # Hitung booking berdasarkan status
        pending_query = select(func.count(Transaction.id)).where(
            Transaction.recycler_id == current_user.id,
            Transaction.status == "pending"
        )
        pending_transactions = session.exec(pending_query).first() or 0

        processing_query = select(func.count(Transaction.id)).where(
            Transaction.recycler_id == current_user.id,
            Transaction.status == "waiting_confirmation"
        )
        processing_transactions = session.exec(processing_query).first() or 0

        completed_query = select(func.count(Transaction.id)).where(
            Transaction.recycler_id == current_user.id,
            Transaction.status == "completed"
        )
        completed_transactions = session.exec(completed_query).first() or 0

    # Rumus Dampak: 1 Kg sampah = 0.5 Kg CO2 dicegah
    co2_saved = total_weight * 0.5

    return {
        "user_name": current_user.name,
        "role": current_user.role,
        "total_waste_managed_kg": total_weight,
        "co2_emissions_prevented_kg": co2_saved,
        "trees_equivalent": int(co2_saved / 21) if co2_saved > 0 else 0,  # 1 pohon menyerap ~21 Kg CO2/tahun
        "available_wastes": available_wastes,
        "pending_transactions": pending_transactions,
        "processing_transactions": processing_transactions,
        "completed_transactions": completed_transactions,
        "message": "Data ini valid dan real-time berdasarkan transaksi selesai."
    }