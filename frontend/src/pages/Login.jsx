import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
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
    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f0f4f8]">
      {/* --- BACKGROUND ANIMATION (Abstract Aurora) --- */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-green-400/40 to-emerald-300/40 blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-gradient-to-r from-blue-400/40 to-cyan-300/40 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-purple-400/40 to-pink-300/40 blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* --- GLASS CARD --- */}
      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-2xl bg-white/30 border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex justify-center items-center p-3 mb-4 rounded-2xl bg-gradient-to-br from-green-500/80 to-emerald-600/80 shadow-lg shadow-green-500/30 text-white">
              <LogIn className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-gray-600/80 mt-2 font-medium">
              Masuk untuk mengelola limbah
            </p>
          </div>

          {/* Error Alert (Glass Style) */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-green-600 transition-colors" />
                </div>
                {/* Input dengan style transparan */}
                <Input
                  type="email"
                  name="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-11 bg-white/40 border-white/50 focus:bg-white/60 focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 rounded-xl transition-all duration-300 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-green-600 transition-colors" />
                </div>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-11 bg-white/40 border-white/50 focus:bg-white/60 focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10 rounded-xl transition-all duration-300 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-600/30 rounded-xl py-3 text-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : 'Masuk Sekarang'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-green-700 hover:text-green-500 font-bold transition-colors underline decoration-green-300 underline-offset-4"
              >
                Daftar Gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8 animate-fade-in-up">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium text-gray-600 hover:bg-white/40 transition-all hover:-translate-y-1"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default Login;