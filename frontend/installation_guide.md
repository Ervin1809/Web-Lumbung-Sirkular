# 🏆 PANDUAN INSTALASI LENGKAP - Lumbung Sirkular
## Web Development Competition UINIC 7.0 #2025

---

## 📋 Daftar Isi
1. [Prerequisites](#prerequisites)
2. [Instalasi Backend](#instalasi-backend)
3. [Instalasi Frontend](#instalasi-frontend)
4. [Fitur-Fitur Baru](#fitur-fitur-baru)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Pastikan sudah terinstall:
- **Python 3.9+**
- **Node.js 16+**
- **npm atau yarn**
- **Git**

---

## 🚀 INSTALASI BACKEND

### Step 1: Setup Virtual Environment

```bash
cd backend
python -m venv venv

# Aktivasi (Windows)
.\venv\Scripts\activate

# Aktivasi (Mac/Linux)
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
pip install fastapi uvicorn sqlmodel passlib[bcrypt] python-jose[cryptography] python-multipart
```

### Step 3: Setup Environment Variables

Buat file `.env` di folder `backend/`:

```bash
# backend/.env
SECRET_KEY=rahasia_ilahi_lumbung_sirkular_2025_YOUR_UNIQUE_KEY_HERE
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./lumbung_sirkular.db
```

**⚠️ PENTING untuk KEAMANAN:**
- Ganti `SECRET_KEY` dengan string random yang panjang
- Jangan commit file `.env` ke Git!

### Step 4: Update Backend Files

**Replace file-file berikut dengan versi improved:**

#### ✅ `backend/app/models.py`
- Copy dari `backend_models_improved.py`
- Tambahan: field `latitude` dan `longitude` untuk peta
- Status transaction yang lebih lengkap

#### ✅ `backend/app/schemas.py`
- Copy dari `backend_schemas_improved.py`
- Tambahan: `WasteUpdate` schema untuk edit

#### ✅ `backend/app/routes/wastes.py`
- Copy dari `backend_wastes_improved.py`
- Fitur baru: Edit, Delete, Price Recommendation

#### ✅ `backend/app/routes/transactions.py`
- Copy dari `backend_transactions_improved.py`
- Fitur baru: Double confirmation, Cancel booking

#### ✅ `backend/app/auth.py`
- Update dengan environment variables:

```python
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
```

### Step 5: Database Migration

```bash
# Delete old database (jika ada)
rm lumbung_sirkular.db

# Jalankan server (database akan otomatis dibuat)
uvicorn app.main:app --reload
```

Server akan jalan di: `http://127.0.0.1:8000`

**Cek dokumentasi API di:** `http://127.0.0.1:8000/docs`

---

## 🎨 INSTALASI FRONTEND

### Step 1: Install Dependencies

```bash
cd frontend
npm install

# atau jika pakai yarn
yarn install
```

### Step 2: Install Additional Libraries (WOW FACTOR!)

```bash
npm install leaflet jspdf react-hot-toast
npm install react-leaflet@4 leaflet@1.9.4

# atau
yarn add react-leaflet leaflet jspdf react-hot-toast
```

### Step 3: Update Frontend Files

#### ✅ `frontend/src/services/api.js`
- Copy dari `frontend_api_improved.js`
- Tambahan: CRUD functions, confirmation endpoints

#### ✅ `frontend/src/pages/Dashboard.jsx`
- Copy dari `frontend_Dashboard_Enhanced.jsx`
- Fitur baru: Recharts, PDF Certificate

#### ✅ `frontend/src/pages/MyWastes.jsx`
- Copy dari `frontend_MyWastes_Improved.jsx`
- Fitur baru: Edit, Delete, View Booking

#### ✅ Tambah Components Baru:

**1. PDF Certificate Generator**
```bash
mkdir -p frontend/src/components/impact
```
Copy `frontend_PDFCertificate.jsx` ke `frontend/src/components/impact/PDFCertificateGenerator.jsx`

**2. Interactive Map**
```bash
mkdir -p frontend/src/components/map
```
Copy `frontend_InteractiveMap.jsx` ke `frontend/src/components/map/InteractiveMap.jsx`

**3. Loading Skeletons**
Copy `frontend_LoadingSkeleton.jsx` ke `frontend/src/components/common/LoadingSkeleton.jsx`

### Step 4: Import Leaflet CSS

Tambahkan di `frontend/public/index.html` (di dalam `<head>`):

```html
<!-- Leaflet CSS -->
<link 
  rel="stylesheet" 
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin=""
/>
```

### Step 5: Environment Variables (Optional)

Buat file `.env` di folder `frontend/`:

```bash
# frontend/.env
REACT_APP_API_URL=http://127.0.0.1:8000
```

### Step 6: Run Development Server

```bash
npm start

# atau
yarn start
```

Frontend akan jalan di: `http://localhost:3000`

---

## ✨ FITUR-FITUR BARU

### 🔥 Backend Improvements

#### 1. Complete CRUD untuk Waste
- ✅ **Edit Limbah** - `PUT /wastes/{id}`
  - Validasi: hanya limbah `available` yang bisa diedit
  - Validasi: hanya owner yang bisa edit

- ✅ **Delete Limbah** - `DELETE /wastes/{id}`
  - Validasi: limbah `booked`/`completed` tidak bisa dihapus
  - Validasi: hanya owner yang bisa delete

#### 2. Double Confirmation System
- ✅ **Recycler Claim** - `PATCH /transactions/{id}/claim-received`
  - Status: `pending` → `waiting_confirmation`
  
- ✅ **Producer Confirm** - `PATCH /transactions/{id}/confirm-handover`
  - Status: `waiting_confirmation` → `completed`

#### 3. Cancel Booking
- ✅ **Cancel** - `DELETE /transactions/{id}/cancel`
  - Both recycler & producer bisa cancel
  - Waste status kembali ke `available`

#### 4. Smart Price Recommendation
- ✅ **Price AI** - `GET /wastes/recommend/price?category=Plastik&weight=10`
  - Rule-based recommendation
  - Berdasarkan harga pasar per kategori

### 🎨 Frontend Wow Factors

#### 1. Interactive Map (react-leaflet)
- ✅ Peta dengan marker untuk setiap limbah
- ✅ Custom colored pins berdasarkan kategori
- ✅ Popup dengan detail lengkap
- ✅ Auto-center ke semua marker

#### 2. PDF Certificate (jsPDF)
- ✅ Generate sertifikat impact profesional
- ✅ Desain gradient dengan border
- ✅ 3 metrics utama (Limbah, CO2, Pohon)
- ✅ Verification code
- ✅ Watermark

#### 3. Charts Visualization (Recharts)
- ✅ Line Chart - Trend 6 bulan
- ✅ Pie Chart - Distribusi kategori
- ✅ Progress Bars - Target achievement

#### 4. Loading Skeletons
- ✅ Smooth skeleton loading
- ✅ Shimmer animation
- ✅ Component-specific skeletons

---

## 🎯 Cara Demo untuk Presentasi

### 1. Registrasi Akun (5 akun)

**3 Producer:**
```
Email: restoran@sarirasanusantara.com
Password: producer123
Nama: PT Sari Rasa Nusantara
Role: producer
Contact: 081234567001
```

**2 Recycler:**
```
Email: banksampah@hijaulestari.com
Password: recycler123
Nama: Bank Sampah Hijau Lestari
Role: recycler
Contact: 081234567011
```

### 2. Upload Limbah (Producer)

Gunakan data dari `datadummy.md` file.

**PENTING:** Tambahkan koordinat untuk demo peta!

Contoh koordinat Kendari:
- Latitude: -3.9800 hingga -3.9950
- Longitude: 122.5100 hingga 122.5250

### 3. Booking & Confirmation (Recycler)

1. Login sebagai Recycler
2. Book limbah
3. Klik "Claim Received"
4. Login sebagai Producer
5. Klik "Confirm Handover"

### 4. Show Impact Dashboard

1. Dashboard dengan charts
2. Download PDF Certificate
3. Show interactive map

---

## 🐛 Troubleshooting

### Backend Error: "Module not found"

```bash
pip install -r requirements.txt
```

### Frontend Error: "Cannot find module 'leaflet'"

```bash
cd frontend
npm install react-leaflet leaflet
```

### Map tidak muncul / blank

1. Pastikan Leaflet CSS sudah diimport
2. Cek console browser untuk error
3. Pastikan ada data waste dengan koordinat

### Database Error: "Table doesn't exist"

```bash
# Delete dan recreate database
rm backend/lumbung_sirkular.db
uvicorn app.main:app --reload
```

### CORS Error

Pastikan di `backend/app/main.py` ada:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Kriteria Penilaian Lomba

### 1. Inovasi dan Relevansi (30%)
✅ Interactive Map - UNIQUE!
✅ Double Confirmation System - SECURE!
✅ PDF Certificate - PROFESSIONAL!
✅ Smart Price Recommendation - AI-POWERED!

### 2. Kesesuaian Kebutuhan (20%)
✅ Complete CRUD with validation
✅ Role-based access control
✅ Real-time impact tracking

### 3. Kualitas Teknis (20%)
✅ Clean code architecture
✅ Proper error handling
✅ Security best practices (JWT, hashing, env variables)

### 4. Desain UI/UX (15%)
✅ Modern, responsive design
✅ Smooth loading states (skeletons)
✅ Intuitive user flow

### 5. Dokumentasi (15%)
✅ Comprehensive README
✅ API documentation (Swagger)
✅ Code comments

---

## 🏆 Tips Memenangkan Lomba

### Saat Presentasi:

1. **Opening (2 menit)**
   - Problem statement yang kuat
   - Unique value proposition

2. **Demo Features (8 menit)**
   - Show CRUD operations
   - Show double confirmation
   - **WOW MOMENT:** Interactive Map
   - **WOW MOMENT:** Download PDF Certificate
   - Show charts & visualizations

3. **Technical Excellence (3 menit)**
   - Explain security measures
   - Show code quality
   - Mention scalability

4. **Q&A (5 menit)**
   - Siap jawab tentang architecture
   - Siap jelaskan business logic
   - Tunjukkan enthusiasm!

### Key Points untuk Juri:

✅ "Kami mengimplementasikan **double confirmation system** untuk memastikan **traceability** dan **accountability** dalam transaksi limbah"

✅ "**Interactive map** memudahkan recycler menemukan limbah terdekat, meningkatkan **efisiensi logistik**"

✅ "**PDF certificate** dapat digunakan untuk **laporan CSR** perusahaan, memberikan **nilai tambah** bagi user"

✅ "Sistem kami **secure by design** dengan JWT authentication, password hashing, dan environment variables untuk sensitive data"

---

## 📞 Support

Jika ada error atau pertanyaan:
1. Cek log error di terminal
2. Cek console browser (F12)
3. Cek API documentation di `/docs`

---

**Good luck! Semoga Juara 1! 🏆🎉**

---

**Built with 💚 for Sustainable Future**
**Web Development Competition UINIC 7.0 #2025**