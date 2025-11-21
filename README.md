# ♻️ Lumbung Sirkular API

API REST yang dirancang untuk mendukung transformasi digital dalam ekonomi sirkular (*Circular Economy*). API ini berfungsi sebagai jembatan B2B (*Business-to-Business*) antara penghasil limbah industri (Produsen) dan pengolah limbah (Recycler), lengkap dengan fitur pelacakan transaksi dan kalkulasi dampak lingkungan (**Impact Dashboard**) secara real-time.

> Dibuat untuk **Web Development Competition UINIC 7.0 #2025**.
> **Tema:** "Building Sustainable Web Solutions to Drive Digital Transformation"

---

## 🏗️ Tech Stack

- **Framework**: FastAPI (High performance, async support)
- **Database**: SQLModel (SQLAlchemy + Pydantic)
- **Database Engine**: SQLite (Development)
- **Autentikasi**: JWT (JSON Web Token) & Bcrypt Hashing
- **Dokumentasi API**: Swagger UI & ReDoc (Auto-generated)
- **Bahasa**: Python 3.9+

---

## 🔧 Fitur Unggulan (Key Features)

### 1. 🌍 Impact Tracker Real-time
Berbeda dengan marketplace biasa, Lumbung Sirkular menghitung metrik keberlanjutan (*Sustainability Metrics*) seperti "Total Kg Terolah" dan "Estimasi Jejak Karbon Berkurang" secara otomatis dari data transaksi yang selesai.

### 2. 🔗 End-to-End Traceability
Setiap limbah memiliki status perjalanan yang jelas: `available` → `booked` → `completed`. Ini memastikan transparansi rantai pasok daur ulang.

### 3. 🏢 B2B Focused Marketplace
Difokuskan untuk volume besar (Limbah Industri/Restoran) yang memberikan dampak lingkungan lebih signifikan dibanding limbah rumah tangga eceran.

---

## ⚙️ Setup & Instalasi (Wajib Dibaca)

Ikuti langkah ini agar environment laptop Anda tidak bentrok.

### 1. Masuk ke Folder Backend
```bash
cd backend
````

### 2\. Buat & Aktifkan Virtual Environment

**Windows:**

```bash
python -m venv venv
.\venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

*(Tanda berhasil: Muncul tulisan `(venv)` di terminal)*

### 3\. Install Library

```bash
pip install -r requirements.txt
```

### 4\. Jalankan Server

```bash
uvicorn app.main:app --reload
```

Server berjalan di: `http://127.0.0.1:8000`

-----

## 🤝 Panduan Git (Branching Workflow)

Agar kode `main` tetap aman dan tidak rusak, **DILARANG push langsung ke main**. Gunakan alur kerja berikut:

### 1\. Ambil Kode Terbaru

```bash
git checkout main
git pull origin main
```

### 2\. Buat Branch Baru

Gunakan format: `backend` atau `frontend`.

```bash
git checkout -b backend
```

### 3\. Coding & Commit

Setelah selesai coding:

```bash
git add .
git commit -m "Menambahkan tabel user dan waste"
```

### 4\. Push ke Branch Sendiri

```bash
git push -u origin backend
```

### 5\. Pull Request (PR)

Buka GitHub, lalu buat **Pull Request** dari branch Anda ke branch `main`. Minta teman tim untuk me-review sebelum di-merge.

-----

## 🛡️ Keamanan Repository (.gitignore)

File `.gitignore` telah disiapkan di root folder. Pastikan file tersebut berisi konfigurasi berikut agar folder environment dan database lokal **TIDAK** ter-upload ke GitHub:

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
.env
```

-----

## 🔌 Endpoint API & Dokumentasi

Coba API langsung tanpa Postman di: **https://www.google.com/search?q=http://127.0.0.1:8000/docs**

### A. Autentikasi (`/auth`)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/auth/register` | Daftar akun (Pilih role: `producer` / `recycler`) |
| `POST` | `/auth/login` | Login & dapatkan **JWT Token** |

### B. Manajemen Limbah (`/wastes`)

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| `POST` | `/wastes/` | Upload limbah baru | Producer |
| `GET` | `/wastes/` | Lihat katalog limbah | Public |
| `GET` | `/wastes/me` | Lihat limbah milik saya | Producer |

**Contoh Body Upload:**

```json
{
  "title": "Minyak Jelantah 20 Liter",
  "category": "Minyak",
  "weight": 20.5,
  "price": 50000,
  "description": "Bekas gorengan ayam, sudah disaring."
}
```

### C. Transaksi & Dampak (`/transactions`)

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| `POST` | `/transactions/book/{id}` | Booking limbah | Recycler |
| `PATCH` | `/transactions/{id}/complete` | Konfirmasi terima barang | Recycler |
| `GET` | `/transactions/impact/me` | **🔥 Impact Dashboard** | All Users |

**Response Dashboard:**

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

### 1\. Users

Menyimpan data pengguna dengan Role-Based Access Control.

  - `role`: Menentukan apakah user adalah **Producer** (Penghasil) atau **Recycler** (Pengolah).

### 2\. Wastes

Katalog limbah.

  - `weight`: Atribut krusial untuk perhitungan dampak lingkungan.
  - `status`: Mengatur visibilitas (`available`, `booked`, `completed`).

### 3\. Transactions

Mencatat sejarah perpindahan limbah. Data di tabel ini yang menjadi sumber perhitungan **Impact Dashboard**.

-----


**Lumbung Sirkular Backend** - Building Sustainable Web Solutions to Drive Digital Transformation 🌍♻️