import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Recycle, TrendingUp, Users, Award, ArrowRight, CheckCircle, Zap, Shield, Globe } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Recycle className="w-12 h-12 text-white" />,
      title: 'Transformasi Limbah',
      description: 'Ubah limbah industri menjadi sumber daya berharga melalui marketplace B2B digital',
      color: 'from-green-600 to-emerald-500'
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-white" />,
      title: 'Impact Real-Time',
      description: 'Pantau kontribusi lingkungan Anda dengan dashboard dampak keberlanjutan',
      color: 'from-blue-600 to-blue-500'
    },
    {
      icon: <Users className="w-12 h-12 text-white" />,
      title: 'Koneksi B2B',
      description: 'Hubungkan produsen limbah dengan pengolah terpercaya dalam satu platform',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Award className="w-12 h-12 text-white" />,
      title: 'Transparansi Penuh',
      description: 'Sistem traceability end-to-end untuk setiap transaksi limbah',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const benefits = [
    { icon: <CheckCircle className="w-6 h-6 text-green-600" />, text: 'Gratis untuk bergabung' },
    { icon: <Zap className="w-6 h-6 text-yellow-600" />, text: 'Platform mudah digunakan' },
    { icon: <Shield className="w-6 h-6 text-blue-600" />, text: 'Transaksi aman & terpercaya' },
    { icon: <Globe className="w-6 h-6 text-purple-600" />, text: 'Berkontribusi untuk lingkungan' },
  ];

  const stats = [
    { value: '500+', label: 'Kg Limbah Terolah', icon: <Recycle className="w-6 h-6" /> },
    { value: '250+', label: 'Kg CO2 Dikurangi', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '50+', label: 'Mitra Terdaftar', icon: <Users className="w-6 h-6" /> },
    { value: '100+', label: 'Transaksi Sukses', icon: <Award className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section
        className="relative bg-gradient-to-br from-green-50 via-emerald-100 to-blue-50 py-20 pb-32 overflow-hidden z-10"
        style={{
          transform: `translateY(${Math.min(scrollY * -0.15, 0)}px)`,
        }}
      >
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div
              className="flex justify-center mb-8 animate-fade-in-down"
              style={{
                animationDelay: '0.2s',
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <img
                  src="/logo.png"
                  alt="Lumbung Sirkular"
                  className="relative w-32 h-32 transform hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Heading */}
            <h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-down"
              style={{
                animationDelay: '0.4s',
              }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 animate-gradient-x">
                Lumbung Sirkular
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto animate-fade-in-down"
              style={{
                animationDelay: '0.6s',
              }}
            >
              Marketplace B2B untuk Ekonomi Sirkular
            </p>

            <p
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-down"
              style={{
                animationDelay: '0.8s',
              }}
            >
              Platform digital yang menghubungkan produsen limbah dengan pengolah,
              menciptakan rantai nilai berkelanjutan untuk masa depan yang lebih hijau
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-down"
              style={{
                animationDelay: '1s',
              }}
            >
              <Link to="/register">
                <Button size="lg" className="flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  Jelajahi Marketplace
                </Button>
              </Link>
            </div>

            {/* Benefits Pills */}
            <div
              className="flex flex-wrap justify-center gap-3 animate-fade-in-down"
              style={{
                animationDelay: '1.2s',
              }}
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  {benefit.icon}
                  <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Always Visible */}
      <section
        className="bg-white py-12 shadow-lg relative z-20 -mt-20"
        style={{
          transform: `translateY(${Math.max(-10, 20 - scrollY / 6)}px)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-all duration-300"
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full text-white shadow-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Staggered Animation */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Lumbung Sirkular?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform yang mendukung transformasi digital untuk ekonomi berkelanjutan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-20 overflow-hidden z-40">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Siap Berkontribusi untuk Lingkungan?
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-8">
              Bergabunglah dengan komunitas bisnis yang peduli keberlanjutan
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-green-600 text-white hover:bg-gray-50 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
                <span className="text-lg font-semibold">Daftar Sekarang</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Add Custom Animations */}
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
