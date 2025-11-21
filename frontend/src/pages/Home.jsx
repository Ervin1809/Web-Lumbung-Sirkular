import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, TrendingUp, Users, Award, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const features = [
    {
      icon: <Recycle className="w-12 h-12 text-green-600" />,
      title: 'Transformasi Limbah',
      description: 'Ubah limbah industri menjadi sumber daya berharga melalui marketplace B2B digital'
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-green-600" />,
      title: 'Impact Real-Time',
      description: 'Pantau kontribusi lingkungan Anda dengan dashboard dampak keberlanjutan'
    },
    {
      icon: <Users className="w-12 h-12 text-green-600" />,
      title: 'Koneksi B2B',
      description: 'Hubungkan produsen limbah dengan pengolah terpercaya dalam satu platform'
    },
    {
      icon: <Award className="w-12 h-12 text-green-600" />,
      title: 'Transparansi Penuh',
      description: 'Sistem traceability end-to-end untuk setiap transaksi limbah'
    }
  ];

  const stats = [
    { value: '500+', label: 'Kg Limbah Terolah' },
    { value: '250+', label: 'Kg CO2 Dikurangi' },
    { value: '50+', label: 'Mitra Terdaftar' },
    { value: '100+', label: 'Transaksi Sukses' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-green-100 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-600 p-4 rounded-full animate-bounce">
                <Recycle className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Lumbung Sirkular
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
              Marketplace B2B untuk Ekonomi Sirkular
            </p>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Platform digital yang menghubungkan produsen limbah dengan pengolah, 
              menciptakan rantai nilai berkelanjutan untuk masa depan yang lebih hijau
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="flex items-center gap-2">
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="lg">
                  Jelajahi Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
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
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
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

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Berkontribusi untuk Lingkungan?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Bergabunglah dengan komunitas bisnis yang peduli keberlanjutan
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;