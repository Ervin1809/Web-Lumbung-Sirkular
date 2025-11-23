import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Factory, Recycle, AlertCircle, CheckCircle, Building2, CreditCard } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'producer',
    contact: '',
    bank_name: '',
    bank_account: ''
  });

  const bankList = [
    'BCA', 'BNI', 'BRI', 'Mandiri', 'BSI', 'CIMB Niaga', 'Danamon', 'Permata',
    'BTN', 'OCBC NISP', 'Maybank', 'Bank Jago', 'Bank Jenius (BTPN)', 'SeaBank'
  ];
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }
    if (formData.role === 'producer' && (!formData.bank_name || !formData.bank_account)) {
      setError('Mohon lengkapi informasi bank');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#f0f4f8]">
       {/* --- BACKGROUND ANIMATION --- */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-green-400/30 to-teal-300/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-blue-400/30 to-purple-300/30 blur-[120px] animate-pulse"></div>
      </div>

      {/* --- GLASS CARD --- */}
      <div className="max-w-2xl w-full relative z-10">
        <div className="backdrop-blur-2xl bg-white/40 border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl p-6 sm:p-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center p-3 mb-4 rounded-2xl bg-gradient-to-br from-green-500/80 to-emerald-600/80 shadow-lg shadow-green-500/30 text-white">
              <UserPlus className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Buat Akun Baru</h2>
            <p className="text-gray-600/80 font-medium">Bergabunglah dengan ekosistem hijau</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 backdrop-blur-md rounded-xl flex items-center gap-3 animate-slide-down">
              <CheckCircle className="w-6 h-6 text-green-700" />
              <p className="text-sm font-semibold text-green-800">Pendaftaran berhasil! Mengalihkan...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ROLE SELECTION - Glass Tiles */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Pilih Peran Anda</label>
              <div className="grid grid-cols-2 gap-4">
                {['producer', 'recycler'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 group overflow-hidden ${
                      formData.role === r
                        ? 'bg-green-500/10 border-green-500 shadow-inner'
                        : 'bg-white/40 border-white/50 hover:bg-white/60 hover:border-green-300 hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    {/* Active Indicator */}
                    {formData.role === r && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    )}
                    
                    {r === 'producer' ? (
                      <Factory className={`w-8 h-8 transition-colors ${formData.role === r ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`} />
                    ) : (
                      <Recycle className={`w-8 h-8 transition-colors ${formData.role === r ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`} />
                    )}
                    <div className="text-center">
                      <div className={`font-bold ${formData.role === r ? 'text-green-800' : 'text-gray-600'}`}>
                        {r === 'producer' ? 'Producer' : 'Recycler'}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-medium text-gray-500">
                        {r === 'producer' ? 'Penghasil' : 'Pengolah'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <GlassInput 
                label="Nama Lengkap / PT" 
                icon={User} 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="PT. Sinar Jaya" 
              />
              <GlassInput 
                label="Nomor Kontak" 
                icon={Phone} 
                name="contact" 
                value={formData.contact} 
                onChange={handleChange} 
                placeholder="0812..." 
              />
            </div>

            <GlassInput 
              label="Email" 
              icon={Mail} 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="email@perusahaan.com" 
            />

            {formData.role === 'producer' && (
               <div className="p-5 rounded-2xl bg-white/30 border border-white/40 shadow-sm space-y-4 animate-fade-in">
                 <h3 className="text-sm font-bold text-green-800 flex items-center gap-2">
                   <CreditCard size={16} /> Informasi Pembayaran
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 ml-1 mb-1 block">Nama Bank</label>
                      <div className="relative">
                        <select
                          name="bank_name"
                          value={formData.bank_name}
                          onChange={handleChange}
                          className="w-full pl-4 pr-10 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-gray-700 font-medium transition-all cursor-pointer hover:bg-white/70 appearance-none"
                          required
                        >
                          <option value="">Pilih Bank</option>
                          {bankList.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
                        </select>
                        <Building2 className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 ml-1 mb-1 block">No. Rekening</label>
                      <input
                        type="text"
                        name="bank_account"
                        value={formData.bank_account}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-gray-700 font-medium transition-all hover:bg-white/70"
                        placeholder="1234xxx"
                        required
                      />
                    </div>
                 </div>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <GlassInput 
                label="Password" 
                icon={Lock} 
                type="password"
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Min. 6 karakter" 
              />
              <GlassInput 
                label="Konfirmasi" 
                icon={Lock} 
                type="password"
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="Ulangi password" 
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-600/30 rounded-xl py-3.5 text-lg font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
              disabled={loading || success}
            >
              {loading ? 'Sedang Memproses...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-green-700 hover:text-green-500 font-bold transition-colors underline decoration-green-300 underline-offset-4">
                Masuk Disini
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium text-gray-600 hover:bg-white/40 transition-all hover:-translate-y-1">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
      
      <style>{`
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// Helper Component untuk Input Glass yang Konsisten
const GlassInput = ({ label, icon: Icon, className, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wide">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
      </div>
      <Input
        {...props}
        className={`pl-11 bg-white/50 border-white/60 focus:bg-white/80 focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 rounded-xl transition-all duration-300 placeholder:text-gray-400 text-gray-800 font-medium w-full ${className}`}
      />
    </div>
  </div>
);

export default Register;