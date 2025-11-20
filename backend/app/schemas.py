from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel

# =======================
# 1. SCHEMAS USER
# =======================

# Base: Field yang sama di Input maupun Output
class UserBase(SQLModel):
    email: str
    name: str
    role: str  # "producer" atau "recycler"
    contact: str

# Create: Apa yang user kirim saat Register (Ada password)
class UserCreate(UserBase):
    password: str

# Read: Apa yang kita kembalikan ke Frontend (Password HILANG)
class UserRead(UserBase):
    id: int
    created_at: datetime

# Login: Khusus untuk validasi saat Login
class UserLogin(SQLModel):
    email: str
    password: str

# =======================
# 2. SCHEMAS WASTE
# =======================

# Base: Field dasar limbah
class WasteBase(SQLModel):
    title: str
    category: str
    weight: float
    price: float = 0.0 # Default 0 (Gratis)
    description: Optional[str] = None
    image_url: Optional[str] = None

# Create: Input saat upload limbah (Sama persis dengan Base)
class WasteCreate(WasteBase):
    pass 

# Read: Output lengkap dengan ID, Status, dan siapa pemiliknya
class WasteRead(WasteBase):
    id: int
    status: str
    producer_id: int
    created_at: datetime

# =======================
# 3. SCHEMAS TRANSACTION
# =======================

# Create: Sebenarnya user cuma kirim ID waste via URL, 
# tapi kalau butuh body request bisa pakai ini.
class TransactionCreate(SQLModel):
    waste_id: int

# Read: Output detail transaksi
class TransactionRead(SQLModel):
    id: int
    status: str
    waste_id: int
    recycler_id: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    # Optional: Jika ingin menampilkan detail limbah di dalam transaksi (Nested)
    waste: Optional[WasteRead] = None

# =======================
# 4. SCHEMAS AUTH (TOKEN)
# =======================
# Ini standar output saat login sukses
class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    email: Optional[str] = None