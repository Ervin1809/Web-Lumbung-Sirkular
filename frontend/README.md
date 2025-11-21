# 🌍 Lumbung Sirkular - Frontend

Frontend React untuk platform Marketplace B2B Ekonomi Sirkular. Dibuat untuk **Web Development Competition UINIC 7.0 #2025**.

## 🎯 Tema
**"Building Sustainable Web Solutions to Drive Digital Transformation"**

Platform digital yang menghubungkan produsen limbah industri dengan pengolah limbah untuk menciptakan ekonomi sirkular yang berkelanjutan.

---

## ✨ Fitur Unggulan

### 🔐 Autentikasi & Multi-Role
- Register dengan role selection (Producer/Recycler)
- Login dengan JWT Token
- Role-based access control

### ♻️ Marketplace Limbah
- Katalog limbah digital dengan kartu yang menarik
- Filter berdasarkan kategori
- Search functionality
- Real-time availability status

### 📊 Impact Dashboard (★ FITUR JUARA)
- Real-time metrics: Total limbah terolah, CO₂ yang dicegah
- Visual progress bars
- Achievement badges
- Role-specific statistics

### 🏭 Producer Features
- Upload limbah dengan form lengkap
- Manajemen limbah pribadi
- Status tracking (Available/Booked/Completed)

### ♻️ Recycler Features
- Browse dan booking limbah
- Transaction management
- Impact tracking

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Build Tool**: Create React App

---

## 📦 Instalasi & Setup

### Prerequisites
- Node.js v16+ 
- npm atau yarn
- Backend FastAPI sudah running di `http://127.0.0.1:8000`

### Langkah Instalasi

1. **Clone atau masuk ke direktori frontend**
```bash
cd lumbung-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Konfigurasi API Base URL (Opsional)**
Jika backend Anda berjalan di URL yang berbeda, edit file `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

4. **Jalankan development server**
```bash
npm start
```

Aplikasi akan terbuka otomatis di `http://localhost:3000`

---

## 📁 Struktur Proyek

```
lumbung-frontend/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/           # Auth components (belum dipakai, bisa expand)
│   │   ├── common/         # Reusable components
│   │   │   ├── Button.jsx
│   │   │   └── Input.jsx
│   │   ├── layout/
│   │   │   └── Navbar.jsx  # Navigation bar
│   │   └── waste/
│   │       └── WasteCard.jsx # Kartu limbah
│   ├── pages/
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Register dengan role selection
│   │   ├── Marketplace.jsx # Katalog limbah
│   │   ├── Dashboard.jsx   # Impact dashboard
│   │   └── MyWastes.jsx    # Manajemen limbah (Producer)
│   ├── context/
│   │   └── AuthContext.jsx # State management auth
│   ├── services/
│   │   └── api.js          # Axios configuration & API calls
│   ├── App.jsx             # Main app dengan routing
│   ├── index.js            # Entry point
│   └── index.css           # Global styles + Tailwind
├── package.json
├── tailwind.config.js      # Tailwind configuration
└── README.md
```

---

## 🚀 Build untuk Production

```bash
npm run build
```

File production akan dibuat di folder `build/`

---

## 🎨 Design Highlights

### Color Palette
- **Primary Green**: `#16a34a` (Sustainability)
- **Accent Blue**: `#2563eb` (Technology)
- **Gradients**: Green-to-Blue untuk modern look

### Typography
- Font: Inter (Google Fonts)
- Responsive sizing

### UI/UX Principles
- ✅ Mobile-first responsive design
- ✅ Smooth animations & transitions
- ✅ Accessible (keyboard navigation, focus states)
- ✅ Loading states & error handling
- ✅ Intuitive navigation
- ✅ Clear CTAs (Call-to-Actions)

---

## 🔗 Integration dengan Backend

### API Endpoints yang Digunakan:

**Auth**
- `POST /auth/register` - Registrasi user
- `POST /auth/login` - Login & dapatkan JWT token

**Wastes**
- `GET /wastes/` - Ambil semua limbah (public)
- `GET /wastes/me` - Ambil limbah milik user (Producer)
- `POST /wastes/` - Upload limbah baru (Producer)

**Transactions**
- `POST /transactions/book/{id}` - Booking limbah (Recycler)
- `GET /transactions/impact/me` - **Impact Dashboard Data**

### Authentication Flow
1. User login → Dapat JWT token
2. Token disimpan di `localStorage`
3. Setiap request API otomatis menyertakan token di header
4. Token valid 24 jam

---

## 🏆 Nilai Jual untuk Lomba

### 1. **Functionality** (30%) ✅
- CRUD lengkap dan berfungsi
- Role-based access bekerja sempurna
- Real-time data update

### 2. **Innovation** (30%) ✅
- Impact Dashboard dengan live metrics
- Sustainable Development Goals integration
- B2B focus (bukan B2C biasa)

### 3. **UI/UX Design** (15%) ✅
- Modern, clean, professional
- Responsive di semua device
- Smooth animations

### 4. **Technical Quality** (20%) ✅
- Clean code architecture
- Component reusability
- Proper state management
- API error handling

### 5. **Relevance to Theme** (5%) ✅
- Langsung menjawab SDGs (Sustainability)
- Digital Transformation nyata (Paper → Digital)

---

## 📸 Screenshots

*(Kalau mau lebih bagus, tambahin screenshot di README)*

### Home Page
- Hero section dengan CTA yang jelas
- Feature highlights
- Statistics showcase

### Marketplace
- Grid layout yang rapi
- Filtering & search
- Waste cards dengan info lengkap

### Dashboard
- Impact metrics dengan visualization
- Progress bars
- Achievement badges

---

## 👥 Tim Developer

**Web Development Competition UINIC 7.0 #2025**
- Rezka Wildan Nurhadi Bakri
- Andi Aisar Saputra Dwi Anna
- M. Ervin

---

## 📝 Notes untuk Presentasi

### Key Points untuk Juri:
1. **Problem**: Limbah industri menumpuk di TPA, pengolah kesulitan akses bahan baku
2. **Solution**: Platform B2B digital yang menghubungkan keduanya
3. **Impact**: Real-time tracking dampak lingkungan (CO₂ saved, waste managed)
4. **Tech**: Modern stack (React + FastAPI), scalable, maintainable
5. **UX**: Intuitive, responsive, accessible

### Demo Flow:
1. Landing page → Jelaskan value proposition
2. Register sebagai Producer & Recycler (2 akun berbeda)
3. Upload limbah (Producer)
4. Browse & book (Recycler)
5. Show Impact Dashboard (★ WOW FACTOR)

---

## 📄 License

Project ini dibuat untuk keperluan kompetisi **UINIC 7.0 Web Development Competition 2025**.

---

## 🙏 Acknowledgments

- HMPS Informatika UIN Sunan Kalijaga
- UINIC 7.0 Competition Committee
- Sustainable Development Goals (SDGs) inspiration

---

**Built with 💚 for a Sustainable Future**