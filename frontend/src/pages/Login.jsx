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
    setError(''); // Clear error when user types
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
        {/* Animated Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>

        {/* Geometric Patterns */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 border-4 border-green-300 rounded-lg transform rotate-45 animate-spin-slow opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 border-4 border-blue-300 rounded-full animate-pulse opacity-20"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-bounce-slow opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border-4 border-purple-300 transform rotate-12 animate-spin-slower opacity-20"></div>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
        <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-twinkle-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-2.5 h-2.5 bg-white rounded-full animate-twinkle-slow"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-full shadow-2xl animate-pulse-slow">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Masuk ke Akun Anda
          </h2>
          <p className="text-gray-600">
            Selamat datang kembali di Lumbung Sirkular
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Daftar sekarang
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

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
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
      `}</style>
    </div>
  );
};

export default Login;