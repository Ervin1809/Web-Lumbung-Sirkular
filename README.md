# ♻️ Lumbung Sirkular API

API REST yang dirancang untuk mendukung transformasi digital dalam ekonomi sirkular (Circular Economy). API ini berfungsi sebagai jembatan B2B (Business-to-Business) antara penghasil limbah industri (Produsen) dan pengolah limbah (Recycler), lengkap dengan fitur pelacakan transaksi dan kalkulasi dampak lingkungan (*Impact Dashboard*) secara real-time.

Dibuat untuk **Web Development Competition UINIC 7.0 #2025**.

## 🏗️ Tech Stack

- **Framework**: FastAPI (High performance, easy to learn)
- **Database**: SQLModel (Kombinasi SQLAlchemy + Pydantic)
- **Database Engine**: SQLite (Development) / PostgreSQL (Production ready)
- **Autentikasi**: JWT (JSON Web Token) & Bcrypt hashing
- **Dokumentasi API**: Swagger UI & ReDoc (Otomatis)
- **Bahasa**: Python 3.9+

---

## 🔧 Fitur Unggulan (Lomba)

### 1. Impact Tracker Real-time
Berbeda dengan marketplace biasa, Lumbung Sirkular menghitung metrik keberlanjutan (Sustainability Metrics) seperti "Total Kg Terolah" dan "Estimasi Jejak Karbon Berkurang" secara otomatis dari data transaksi.

### 2. End-to-End Traceability
Setiap limbah memiliki status yang jelas mulai dari `available` -> `booked` -> `completed`, memastikan transparansi rantai pasok daur ulang.

### 3. Business-to-Business (B2B) Focus
Difokuskan untuk volume besar (industri/bisnis) yang memberikan dampak lingkungan lebih signifikan dibanding limbah rumah tangga.

---

## 🚀 Memulai (Setup & Instalasi)

Ikuti langkah-langkah berikut untuk menjalankan server backend di komputer lokal Anda.

### Prasyarat
- Python 3.9 atau lebih baru
- Pip (Python Package Manager)

### 1. Masuk ke Folder Backend
Pastikan terminal Anda berada di dalam folder `backend`.
```bash
cd backend
````

### 2\. Buat & Aktifkan Virtual Environment (Wajib)

Agar library tidak bentrok, gunakan virtual environment.

**Windows:**

```bash
# Buat environment
python -m venv venv

# Aktifkan
.\venv\Scripts\activate
```

**macOS / Linux:**

```bash
# Buat environment
python3 -m venv venv

# Aktifkan
source venv/bin/activate
```

*(Tanda berhasil: Akan muncul tulisan `(venv)` di terminal)*

### 3\. Install Library

Download semua kebutuhan aplikasi.

```bash
pip install -r requirements.txt
```

### 4\. Aturan Git & Keamanan (.gitignore)

Sebelum melakukan commit, pastikan file `.gitignore` Anda sudah dikonfigurasi untuk mengabaikan file sensitif dan folder environment. File `.gitignore` harus berisi:

```
# Abaikan Virtual Environment
venv/
env/
.venv/
sirkular_env/

# Abaikan Database Lokal
*.db
*.sqlite3
backend/*.db

# Abaikan Cache Python
__pycache__/
*.pyc

# Abaikan Konfigurasi Env (Password/API Key)
.env
```

### 5\. Jalankan Server

```bash
uvicorn app.main:app --reload
```

API akan berjalan di `http://localhost:8000`

-----

## 🔌 Endpoint API & Dokumentasi

Anda dapat mencoba API secara langsung tanpa aplikasi tambahan melalui Swagger UI di browser:
👉 **http://localhost:8000/docs**

### A. Autentikasi (`/auth`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/auth/register` | Daftar akun baru (Producer/Recycler) |
| `POST` | `/auth/login` | Login & dapatkan JWT Token |

**Contoh Register:**

```json
{
  "email": "kedaikopi@example.com",
  "password": "rahasia_banget",
  "name": "Kopi Senja Tebet",
  "role": "producer",
  "contact": "081234567890"
}
```

### B. Manajemen Limbah (`/wastes`)

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| `POST` | `/wastes/` | Upload limbah baru ke katalog | Producer |
| `GET` | `/wastes/` | Lihat semua limbah `available` | Public |
| `GET` | `/wastes/me` | Lihat daftar limbah milik saya | Producer |

**Parameter Query:**

  - `category`: Filter jenis limbah. Contoh: `GET /wastes/?category=Plastik`

### C. Transaksi & Dampak (`/transactions`)

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| `POST` | `/transactions/book/{id}` | Booking limbah dari katalog | Recycler |
| `PATCH` | `/transactions/{id}/complete` | Konfirmasi barang diterima | Recycler |
| `GET` | `/transactions/impact/me` | **🔥 Impact Dashboard Data** | All Users |

**Response Impact Dashboard:**

```json
{
  "user_name": "Bank Sampah Jaya",
  "role": "recycler",
  "total_waste_managed_kg": 150.5,
  "co2_emissions_prevented_kg": 75.25,
  "message": "Data ini valid dan real-time berdasarkan transaksi selesai."
}
```

-----

## 📊 Skema Database

### 1\. Tabel Users

Menyimpan data pengguna dengan pemisahan peran yang ketat.

| Field | Type | Deskripsi |
|-------|------|-----------|
| `id` | Integer | Primary key |
| `email` | String | Email unik (Login) |
| `password_hash` | String | Encrypted (Bcrypt) |
| `role` | String | `"producer"` atau `"recycler"` |

### 2\. Tabel Wastes (Limbah)

Katalog komoditas limbah ("Marketplace").

| Field | Type | Deskripsi |
|-------|------|-----------|
| `id` | Integer | Primary key |
| `producer_id` | Integer | Pemilik barang |
| `category` | String | Organik, Plastik, Minyak, dll |
| `weight` | Float | Berat (Kg) - **Kunci perhitungan Impact** |
| `status` | String | `"available"`, `"booked"`, `"completed"` |

### 3\. Tabel Transactions

Mencatat perpindahan tangan limbah.

| Field | Type | Deskripsi |
|-------|------|-----------|
| `id` | Integer | Primary key |
| `waste_id` | Integer | Barang yang diambil |
| `recycler_id` | Integer | Siapa yang mengambil |
| `status` | String | `"pending"` -\> `"completed"` |

-----

## 🔒 Keamanan & Otorisasi

### Role-Based Access Control (RBAC)

  - **Producer**: Hanya bisa Upload, tidak bisa Booking.
  - **Recycler**: Hanya bisa Booking, tidak bisa Upload.

### Standar Keamanan

  - Password di-hash menggunakan **Bcrypt**.
  - Setiap request sensitif wajib menyertakan Header: `Authorization: Bearer <token>`.

-----

## 🎯 Kasus Penggunaan (Use Cases)

### Skenario 1: Penghasil Limbah (Restoran)

1.  Login sebagai `producer`.
2.  Upload foto dan data "Ampas Kopi 10kg".
3.  Limbah muncul di katalog publik.
4.  Memantau dashboard untuk melihat total limbah yang sudah terambil.

### Skenario 2: Pengolah Limbah (Peternak Maggot)

1.  Login sebagai `recycler`.
2.  Cari limbah kategori "Organik".
3.  Klik "Book" pada limbah yang diinginkan.
4.  Menjemput barang ke lokasi.
5.  Klik "Selesaikan Transaksi" di aplikasi.
6.  Point dampak lingkungan bertambah di Dashboard.

-----

**Lumbung Sirkular Backend** - Building Sustainable Web Solutions to Drive Digital Transformation 🌍♻️