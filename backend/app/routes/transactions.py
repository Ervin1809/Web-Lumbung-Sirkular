from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from app.database import get_session
from app.models import Transaction, Waste, User
from app.schemas import TransactionRead, TransactionCreate, PaymentSubmit
from app.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# 1. BOOKING / AMBIL LIMBAH (Khusus Recycler)
# Mendukung partial booking - jika tidak mengambil semua, sisa tetap di marketplace
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

    # Validasi jumlah yang diambil
    estimated_qty = booking_data.estimated_quantity or waste.weight
    if estimated_qty <= 0:
        raise HTTPException(status_code=400, detail="Jumlah yang diambil harus lebih dari 0")
    if estimated_qty > waste.weight:
        raise HTTPException(status_code=400, detail=f"Jumlah yang diambil ({estimated_qty} Kg) melebihi stok ({waste.weight} Kg)")

    # Cek apakah ini partial booking atau full booking
    is_partial = estimated_qty < waste.weight

    if is_partial:
        # PARTIAL BOOKING: Kurangi stok, buat waste baru untuk yang di-booking
        remaining_weight = waste.weight - estimated_qty

        # Hitung harga per Kg untuk proporsional
        price_per_kg = waste.price / waste.weight if waste.weight > 0 else 0
        remaining_price = remaining_weight * price_per_kg
        booked_price = estimated_qty * price_per_kg

        # Update waste original dengan sisa stok (tetap available)
        waste.weight = remaining_weight
        waste.price = remaining_price
        session.add(waste)

        # Buat waste baru untuk yang di-booking
        booked_waste = Waste(
            title=f"{waste.title} (Booking)",
            category=waste.category,
            weight=estimated_qty,
            price=booked_price,
            description=waste.description,
            image_url=waste.image_url,
            status="booked",
            latitude=waste.latitude,
            longitude=waste.longitude,
            producer_id=waste.producer_id
        )
        session.add(booked_waste)
        session.flush()  # Get the new waste ID

        # Buat transaksi untuk waste yang di-booking
        transaction = Transaction(
            waste_id=booked_waste.id,
            recycler_id=current_user.id,
            status="pending",
            pickup_date=booking_data.pickup_date,
            pickup_time=booking_data.pickup_time,
            estimated_quantity=estimated_qty,
            transport_method=booking_data.transport_method,
            contact_person=booking_data.contact_person,
            contact_phone=booking_data.contact_phone,
            pickup_address=booking_data.pickup_address,
            notes=booking_data.notes,
            delivery_latitude=booking_data.delivery_latitude,
            delivery_longitude=booking_data.delivery_longitude
        )
    else:
        # FULL BOOKING: Ambil semua, waste jadi booked
        waste.status = "booked"
        session.add(waste)

        # Buat transaksi untuk waste ini
        transaction = Transaction(
            waste_id=waste_id,
            recycler_id=current_user.id,
            status="pending",
            pickup_date=booking_data.pickup_date,
            pickup_time=booking_data.pickup_time,
            estimated_quantity=estimated_qty,
            transport_method=booking_data.transport_method,
            contact_person=booking_data.contact_person,
            contact_phone=booking_data.contact_phone,
            pickup_address=booking_data.pickup_address,
            notes=booking_data.notes,
            delivery_latitude=booking_data.delivery_latitude,
            delivery_longitude=booking_data.delivery_longitude
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
        "trees_equivalent": round(co2_saved / 21, 1) if co2_saved > 0 else 0,  # 1 pohon menyerap ~21 Kg CO2/tahun
        "available_wastes": available_wastes,
        "pending_transactions": pending_transactions,
        "processing_transactions": processing_transactions,
        "completed_transactions": completed_transactions,
        "message": "Data ini valid dan real-time berdasarkan transaksi selesai."
    }

# 8. CHART DATA API - Monthly Trends & Category Distribution
@router.get("/impact/chart-data")
def get_chart_data(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    from datetime import datetime, timedelta
    from collections import defaultdict

    # Get last 6 months
    today = datetime.now()
    months_data = []

    for i in range(5, -1, -1):  # 5 months ago to current
        target_date = today - timedelta(days=30 * i)
        month_name = target_date.strftime('%b')
        month_key = target_date.strftime('%Y-%m')
        months_data.append({
            'month': month_name,
            'month_key': month_key,
            'limbah': 0.0,
            'co2': 0.0,
            'revenue': 0.0,
            'trees': 0.0
        })

    # Category distribution
    category_stats = defaultdict(float)

    if current_user.role == "producer":
        # Get completed transactions for producer's wastes
        query = select(Transaction, Waste).join(Waste).where(
            Waste.producer_id == current_user.id,
            Transaction.status == "completed"
        )
        results = session.exec(query).all()

        for transaction, waste in results:
            # Aggregate by month
            if transaction.created_at:
                tx_month_key = transaction.created_at.strftime('%Y-%m')
                for m in months_data:
                    if m['month_key'] == tx_month_key:
                        m['limbah'] += float(waste.weight or 0)
                        m['revenue'] += float(waste.price * waste.weight if waste.price else 0)
                        m['co2'] += float(waste.weight or 0) * 0.5
                        m['trees'] += round((waste.weight or 0) * 0.5 / 21, 1)

            # Category distribution
            if waste.category:
                category_stats[waste.category] += float(waste.weight or 0)

    elif current_user.role == "recycler":
        # Get completed transactions for recycler
        query = select(Transaction, Waste).join(Waste).where(
            Transaction.recycler_id == current_user.id,
            Transaction.status == "completed"
        )
        results = session.exec(query).all()

        for transaction, waste in results:
            # Aggregate by month
            if transaction.created_at:
                tx_month_key = transaction.created_at.strftime('%Y-%m')
                for m in months_data:
                    if m['month_key'] == tx_month_key:
                        m['limbah'] += float(waste.weight or 0)
                        m['co2'] += float(waste.weight or 0) * 0.5
                        m['trees'] += round((waste.weight or 0) * 0.5 / 21, 1)

            # Category distribution
            if waste.category:
                category_stats[waste.category] += float(waste.weight or 0)

    # Clean up months_data (remove month_key)
    trend_data = [{'month': m['month'], 'limbah': round(m['limbah'], 2), 'co2': round(m['co2'], 2), 'revenue': round(m['revenue'], 0), 'trees': round(m['trees'], 1)} for m in months_data]

    # Format category data with colors
    category_colors = {
        'Plastik': '#3b82f6',
        'Organik': '#22c55e',
        'Kertas': '#f97316',
        'Minyak Jelantah': '#fbbf24',
        'Logam': '#6b7280',
        'Elektronik': '#8b5cf6',
        'Kaca': '#06b6d4',
        'Tekstil': '#ec4899',
        'B3': '#ef4444',
        'Lainnya': '#9ca3af'
    }

    category_data = [
        {
            'name': cat,
            'value': round(weight, 2),
            'color': category_colors.get(cat, '#9ca3af')
        }
        for cat, weight in category_stats.items()
    ]

    return {
        "trend_data": trend_data,
        "category_data": category_data,
        "has_data": len([t for t in trend_data if t['limbah'] > 0]) > 0 or len(category_data) > 0
    }


# 9. 🔥 SUBMIT PAYMENT - Recycler submits payment proof
@router.post("/{transaction_id}/payment", response_model=TransactionRead)
def submit_payment(
    transaction_id: int,
    payment_data: PaymentSubmit,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Recycler mengirimkan bukti pembayaran.
    Status pembayaran berubah menjadi 'pending_verification'.
    """
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    # Pastikan yang submit adalah recycler yang booking
    if transaction.recycler_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bukan transaksi Anda")

    # Pastikan status masih pending
    if transaction.status not in ["pending"]:
        raise HTTPException(
            status_code=400,
            detail=f"Transaksi dengan status '{transaction.status}' tidak bisa melakukan pembayaran"
        )

    # Update payment info
    transaction.payment_method = payment_data.payment_method
    transaction.payment_proof_url = payment_data.payment_proof_url
    transaction.waste_cost = payment_data.waste_cost
    transaction.shipping_cost = payment_data.shipping_cost
    transaction.total_amount = payment_data.total_amount
    transaction.payment_status = "pending_verification"
    transaction.payment_date = datetime.utcnow()

    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return transaction


# 10. 🔥 VERIFY PAYMENT - Producer verifies payment
@router.patch("/{transaction_id}/verify-payment", response_model=TransactionRead)
def verify_payment(
    transaction_id: int,
    action: str,  # "approve" or "reject"
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Producer memverifikasi bukti pembayaran.
    action: "approve" -> payment_status = "verified"
    action: "reject" -> payment_status = "rejected"
    """
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")

    # Ambil waste untuk validasi
    waste = session.get(Waste, transaction.waste_id)
    if not waste:
        raise HTTPException(status_code=404, detail="Limbah tidak ditemukan")

    # Pastikan yang verifikasi adalah producer pemilik waste
    if waste.producer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Anda bukan pemilik limbah ini")

    # Pastikan payment status sedang pending_verification
    if transaction.payment_status != "pending_verification":
        raise HTTPException(
            status_code=400,
            detail=f"Pembayaran dengan status '{transaction.payment_status}' tidak bisa diverifikasi"
        )

    if action == "approve":
        transaction.payment_status = "verified"
    elif action == "reject":
        transaction.payment_status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="Action harus 'approve' atau 'reject'")

    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return transaction

# 11. 🔥 GET PAYMENT DETAILS (termasuk bank producer)
@router.get("/{transaction_id}/payment-details")
def get_payment_details(
    transaction_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan")
    
    waste = transaction.waste
    if not waste:
        waste = session.get(Waste, transaction.waste_id)
    
    producer = waste.producer
    if not producer:
        producer = session.get(User, waste.producer_id)
    
    return {
        "bank_name": producer.bank_name,
        "bank_account": producer.bank_account,
        "account_holder": producer.name,
        "contact": producer.contact
    }