import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserPlus, Mail, Lock, User, Phone, Factory, Recycle, AlertCircle, CheckCircle, Building2, CreditCard } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'producer', // default
    contact: '',
    bank_name: '',
    bank_account: ''
  });

  // Daftar bank Indonesia
  const bankList = [
    'BCA', 'BNI', 'BRI', 'Mandiri', 'BSI', 'CIMB Niaga', 'Danamon', 'Permata',
    'BTN', 'OCBC NISP', 'Maybank', 'Bank Jago', 'Bank Jenius (BTPN)',
    'SeaBank', 'Bank Neo Commerce'
  ];
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
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

    // 🔥 Validasi Bank Khusus Producer
    if (formData.role === 'producer' && (!formData.bank_name || !formData.bank_account)) {
      setError('Mohon lengkapi informasi bank untuk keperluan pembayaran');
      setLoading(false);
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
        {/* Animated Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>

        {/* Geometric Patterns */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="absolute top-20 left-10 w-16 h-16 border-4 border-green-300 rounded-lg transform rotate-45 animate-spin-slow opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-20 h-20 border-4 border-blue-300 rounded-full animate-pulse opacity-20"></div>
          <div className="absolute top-32 right-16 w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-bounce-slow opacity-30"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 border-4 border-purple-300 transform rotate-12 animate-spin-slower opacity-20"></div>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute top-16 left-1/4 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
        <div className="absolute bottom-24 left-20 w-1.5 h-1.5 bg-white rounded-full animate-twinkle-delayed"></div>
        <div className="absolute top-40 right-20 w-2.5 h-2.5 bg-white rounded-full animate-twinkle-slow"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-full shadow-2xl animate-pulse-slow">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Akun Baru
          </h2>
          <p className="text-gray-600">
            Bergabunglah dengan komunitas ekonomi sirkular
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-slide-down">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-800">
                  Pendaftaran berhasil! Mengalihkan ke halaman login...
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilih Peran Anda
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'producer' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'producer'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Factory className={`w-8 h-8 mx-auto mb-2 ${
                    formData.role === 'producer' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="font-semibold text-gray-900">Producer</div>
                  <div className="text-xs text-gray-600 mt-1">Penghasil Limbah</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'recycler' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'recycler'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Recycle className={`w-8 h-8 mx-auto mb-2 ${
                    formData.role === 'recycler' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="font-semibold text-gray-900">Recycler</div>
                  <div className="text-xs text-gray-600 mt-1">Pengolah Limbah</div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nama Lengkap / Nama Perusahaan
              </label>
              <Input
                type="text"
                name="name"
                placeholder="PT. Contoh Sejahtera"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Nomor Kontak
              </label>
              <Input
                type="tel"
                name="contact"
                placeholder="08123456789"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            {/* 🔥 Bank Info (Producer Only) - Updated Style */}
            {formData.role === 'producer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Nama Bank
                  </label>
                  <div className="relative">
                    <select
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white appearance-none"
                      required
                    >
                      <option value="">Pilih Bank</option>
                      {bankList.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <Input
                  label="Nomor Rekening"
                  type="text"
                  name="bank_account"
                  placeholder="Contoh: 1234567890"
                  value={formData.bank_account}
                  onChange={handleChange}
                  icon={CreditCard}
                  required
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Konfirmasi Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Ulangi password Anda"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || success}
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-2"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-120deg); }
          66% { transform: translate(20px, -20px) rotate(-240deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -40px) scale(1.1); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes twinkle-delayed {
          animation: twinkle 3s ease-in-out infinite 1s;
        }

        @keyframes twinkle-slow {
          animation: twinkle 4s ease-in-out infinite 2s;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 18s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slower {
          animation: spin-slower 30s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-twinkle-delayed {
          animation: twinkle 3s ease-in-out infinite 1s;
        }

        .animate-twinkle-slow {
          animation: twinkle 4s ease-in-out infinite 2s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;