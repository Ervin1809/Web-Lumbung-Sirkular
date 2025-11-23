import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, TrendingUp, Users, Award, ArrowRight, CheckCircle, 
  Zap, Shield, Globe, FileText, Search, Truck, Star, Quote 
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // DATA: Features
  const features = [
    {
      icon: <Recycle className="w-full h-full text-white" />,
      title: 'Transformasi Limbah',
      description: 'Ubah limbah industri menjadi sumber daya berharga melalui marketplace B2B digital',
      color: 'from-green-600 to-emerald-500'
    },
    {
      icon: <TrendingUp className="w-full h-full text-white" />,
      title: 'Impact Real-Time',
      description: 'Pantau kontribusi lingkungan Anda dengan dashboard dampak keberlanjutan',
      color: 'from-blue-600 to-blue-500'
    },
    {
      icon: <Users className="w-full h-full text-white" />,
      title: 'Koneksi B2B',
      description: 'Hubungkan produsen limbah dengan pengolah terpercaya dalam satu platform',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Award className="w-full h-full text-white" />,
      title: 'Transparansi Penuh',
      description: 'Sistem traceability end-to-end untuk setiap transaksi limbah',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  // DATA: Benefits Pills
  const benefits = [
    { icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />, text: 'Gratis untuk bergabung' },
    { icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />, text: 'Platform mudah digunakan' },
    { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />, text: 'Transaksi aman & terpercaya' },
    { icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />, text: 'Berkontribusi untuk lingkungan' },
  ];

  // DATA: Stats
  const stats = [
    { value: '500+', label: 'Kg Limbah Terolah', icon: <Recycle className="w-full h-full" /> },
    { value: '250+', label: 'Kg CO2 Dikurangi', icon: <TrendingUp className="w-full h-full" /> },
    { value: '50+', label: 'Mitra Terdaftar', icon: <Users className="w-full h-full" /> },
    { value: '100+', label: 'Transaksi Sukses', icon: <Award className="w-full h-full" /> }
  ];

  // DATA BARU: Testimonials
  const testimonials = [
    { name: "PT. Indofood Sukses", role: "Producer", text: "Lumbung Sirkular membantu kami mengurangi biaya pembuangan limbah hingga 40% dalam 3 bulan." },
    { name: "CV. Daur Ulang Jaya", role: "Recycler", text: "Pasokan bahan baku plastik kami jadi lebih stabil berkat koneksi dengan pabrik-pabrik di sini." },
    { name: "Hotel Green Garden", role: "Producer", text: "Sangat mudah digunakan! Laporan dampak lingkungannya sangat berguna untuk audit CSR kami." },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      
      {/* 1. HERO SECTION (Existing) */}
      <section
        className="relative bg-gradient-to-br from-green-50 via-emerald-100 to-blue-50 py-12 sm:py-16 md:py-20 pb-24 sm:pb-28 md:pb-32 overflow-hidden z-10"
        style={{ transform: `translateY(${Math.min(scrollY * -0.15, 0)}px)` }}
      >
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-10 left-5 sm:left-10 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-5 sm:right-10 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-10 sm:left-20 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Logo Animation */}
            <div className="flex justify-center mb-6 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-green-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <img src="/logo.png" alt="Lumbung Sirkular" className="relative w-20 h-20 sm:w-28 sm:h-28 transform hover:scale-110 transition-transform duration-500" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 animate-fade-in-down" style={{ animationDelay: '0.4s' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 animate-gradient-x">
                Lumbung Sirkular
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto animate-fade-in-down" style={{ animationDelay: '0.6s' }}>
              Marketplace B2B untuk Ekonomi Sirkular
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-down" style={{ animationDelay: '1s' }}>
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  {isAuthenticated ? "Dashboard" : "Mulai Sekarang"} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/marketplace" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Jelajahi Marketplace
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-down" style={{ animationDelay: '1.2s' }}>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  {benefit.icon} <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Stats Section - Always Visible */}
      <section
        className="bg-white py-8 sm:py-10 md:py-12 shadow-lg relative z-20 -mt-16 sm:-mt-20 mx-2 sm:mx-4 md:mx-auto rounded-xl md:rounded-none"
        style={{
          transform: `translateY(${Math.max(-10, 20 - scrollY / 6)}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-all duration-300"
              >
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 sm:p-3 rounded-full text-white shadow-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION (Existing - Reordered) */}
      <section className="py-20 bg-white relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kenapa Memilih Kami?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Platform digital terintegrasi untuk mendukung bisnis Anda</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-transparent hover:border-green-100">
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white w-10 h-10">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEW SECTION: TESTIMONIALS (Social Proof) */}
      <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10"><Quote size={200} /></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">Dipercaya oleh Industri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg italic mb-6 text-gray-100">"{testi.text}"</p>
                <div>
                  <h4 className="font-bold">{testi.name}</h4>
                  <span className="text-sm text-emerald-300 uppercase tracking-wider">{testi.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION (Existing - Adjusted) */}
      <section className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-20 overflow-hidden z-40">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {isAuthenticated ? "Kelola Limbah Anda Sekarang" : "Siap Berkontribusi untuk Lingkungan?"}
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              {isAuthenticated ? "Akses dashboard untuk memantau transaksi dan dampak lingkungan." : "Bergabunglah dengan ratusan perusahaan lain yang telah beralih ke ekonomi sirkular."}
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl px-8 py-4 h-auto text-lg font-bold">
                {isAuthenticated ? "Buka Dashboard" : "Gabung Sekarang - Gratis"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STYLES (Existing) */}
      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: left center; }
          50% { background-position: right center; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; opacity: 0; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
      `}</style>
    </div>
  );
};

export default Home;