from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel

# =======================
# 1. SCHEMAS USER
# =======================

class UserBase(SQLModel):
    email: str
    name: str
    role: str
    contact: str
    # Bank info for Producer
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: datetime
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None

class UserLogin(SQLModel):
    email: str
    password: str

# =======================
# 2. SCHEMAS WASTE
# =======================

class WasteBase(SQLModel):
    title: str
    category: str
    weight: float
    price: float = 0.0
    description: Optional[str] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class WasteCreate(WasteBase):
    pass

class WasteUpdate(SQLModel):
    title: Optional[str] = None
    category: Optional[str] = None
    weight: Optional[float] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class WasteRead(WasteBase):
    id: int
    status: str
    producer_id: int
    created_at: datetime

# =======================
# 3. SCHEMAS TRANSACTION
# =======================

class TransactionCreate(SQLModel):
    waste_id: int
    pickup_date: Optional[str] = None
    pickup_time: Optional[str] = None
    estimated_quantity: Optional[float] = None
    transport_method: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    pickup_address: Optional[str] = None
    notes: Optional[str] = None
    # Delivery location coordinates (for delivery method)
    delivery_latitude: Optional[float] = None
    delivery_longitude: Optional[float] = None

class TransactionRead(SQLModel):
    id: int
    status: str
    waste_id: int
    recycler_id: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    pickup_date: Optional[str] = None
    pickup_time: Optional[str] = None
    estimated_quantity: Optional[float] = None
    transport_method: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    pickup_address: Optional[str] = None
    notes: Optional[str] = None
    # Delivery location coordinates (for delivery method)
    delivery_latitude: Optional[float] = None
    delivery_longitude: Optional[float] = None
    # Payment fields
    payment_method: Optional[str] = None
    payment_status: str = "unpaid"
    payment_proof_url: Optional[str] = None
    waste_cost: Optional[float] = None
    shipping_cost: Optional[float] = None
    total_amount: Optional[float] = None
    payment_date: Optional[datetime] = None
    waste: Optional[WasteRead] = None


class PaymentSubmit(SQLModel):
    payment_method: str  # cash, transfer, qris
    payment_proof_url: str
    waste_cost: float
    shipping_cost: Optional[float] = None
    total_amount: float

# =======================
# 4. SCHEMAS AUTH (TOKEN)
# =======================

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    email: Optional[str] = None