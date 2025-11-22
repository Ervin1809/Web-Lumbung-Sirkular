from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

# --- TABEL USER ---
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    name: str
    role: str  # "producer" atau "recycler"
    contact: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    wastes: List["Waste"] = Relationship(back_populates="producer")
    transactions: List["Transaction"] = Relationship(back_populates="recycler")


# --- TABEL WASTE (LIMBAH) ---
class Waste(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    category: str       
    weight: float       
    price: float = Field(default=0) 
    description: Optional[str] = None
    image_url: Optional[str] = None
    
    # 🔥 UPDATE: Status sekarang bisa: available, booked, completed
    status: str = Field(default="available") 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # 🔥 FITUR BARU: Koordinat untuk peta (latitude, longitude)
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    producer_id: Optional[int] = Field(default=None, foreign_key="user.id")
    producer: Optional[User] = Relationship(back_populates="wastes")
    
    transaction: Optional["Transaction"] = Relationship(back_populates="waste")


# --- TABEL TRANSACTION (TRANSAKSI) ---
class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # 🔥 UPDATE: Status sekarang bisa: 
    # - pending (baru booking, belum diambil)
    # - waiting_confirmation (recycler sudah ambil, menunggu konfirmasi producer)
    # - completed (producer sudah konfirmasi)
    # - cancelled (dibatalkan)
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

    # Booking Details
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

    waste_id: int = Field(foreign_key="waste.id")
    waste: Optional[Waste] = Relationship(back_populates="transaction")

    recycler_id: int = Field(foreign_key="user.id")
    recycler: Optional[User] = Relationship(back_populates="transactions")