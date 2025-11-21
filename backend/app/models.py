# app/models.py
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

    # Relasi (Back Populates) - Agar bisa akses data terkait dengan mudah
    wastes: List["Waste"] = Relationship(back_populates="producer")
    transactions: List["Transaction"] = Relationship(back_populates="recycler")


# --- TABEL WASTE (LIMBAH) ---
class Waste(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    category: str       
    weight: float       
    
    # --- UPDATE DI SINI ---
    # Kita set default=0. Artinya kalau user gak isi harga, otomatis jadi Gratis.
    price: float = Field(default=0) 
    # ----------------------

    description: Optional[str] = None
    image_url: Optional[str] = None
    status: str = Field(default="available") 
    created_at: datetime = Field(default_factory=datetime.utcnow)

    producer_id: Optional[int] = Field(default=None, foreign_key="user.id")
    producer: Optional[User] = Relationship(back_populates="wastes")
    
    transaction: Optional["Transaction"] = Relationship(back_populates="waste")


# --- TABEL TRANSACTION (TRANSAKSI) ---
class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    status: str = Field(default="pending") # pending, completed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

    # Booking Details
    pickup_date: Optional[str] = None
    pickup_time: Optional[str] = None
    estimated_quantity: Optional[float] = None
    transport_method: Optional[str] = None  # pickup / delivery
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    pickup_address: Optional[str] = None
    notes: Optional[str] = None

    # Foreign Key ke Waste (Barang apa yang ditransaksikan)
    waste_id: int = Field(foreign_key="waste.id")
    waste: Optional[Waste] = Relationship(back_populates="transaction")

    # Foreign Key ke Recycler (Siapa yang mengambil)
    recycler_id: int = Field(foreign_key="user.id")
    recycler: Optional[User] = Relationship(back_populates="transactions")