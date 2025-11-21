import React from 'react';
import { Link } from 'react-router-dom';
import { Factory, Package, DollarSign, TrendingUp, CheckCircle, Clock, XCircle, Eye, Leaf, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PDFCertificateGenerator from '../impact/PDFCertificateGenerator';

const ProducerDashboard = ({ impact, user }) => {
  // Generate revenue chart data
  const getRevenueData = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totalWaste = impact?.total_waste_managed_kg || 0;

    return months.map((month, index) => ({
      month,
      limbah: parseFloat((totalWaste * (index + 1) / 6).toFixed(2)),
      revenue: parseFloat((totalWaste * (index + 1) / 6 * 2000).toFixed(0)), // Estimasi Rp 2000/Kg
    }));
  };

  const StatsCard = ({ icon, title, value, subtitle, color = 'blue', link }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      purple: 'from-purple-500 to-purple-600',
    };

    const Card = () => (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer">
        <div className={`bg-gradient-to-r ${colorClasses[color]} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white text-opacity-90 text-sm font-medium mb-1">
                {title}
              </p>
              <p className="text-white text-3xl font-bold mb-2">
                {value}
              </p>
              {subtitle && (
                <p className="text-white text-opacity-75 text-xs">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              {icon}
            </div>
          </div>
        </div>
      </div>
    );

    return link ? <Link to={link}><Card /></Link> : <Card />;
  };

  const revenueData = getRevenueData();
  const totalRevenue = revenueData[revenueData.length - 1]?.revenue || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Producer Badge */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg">
              <Factory className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Dashboard Producer
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Selamat datang, <span className="font-semibold text-blue-600">{impact?.user_name || user?.name}</span>
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
            <Factory className="w-4 h-4" />
            Penghasil Limbah
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Package className="w-9 h-9 text-white" />}
            title="Limbah Dihasilkan"
            value={`${impact?.total_waste_managed_kg?.toFixed(1) || 0}Kg`}
            subtitle="Total limbah yang berhasil dikelola"
            color="blue"
            link="/my-wastes"
          />

          <StatsCard
            icon={<DollarSign className="w-9 h-9 text-white" />}
            title="Potensi Revenue"
            value={`Rp ${totalRevenue.toLocaleString('id-ID')}`}
            subtitle="Estimasi nilai limbah yang dihasilkan"
            color="green"
          />

          <StatsCard
            icon={<CheckCircle className="w-9 h-9 text-white" />}
            title="Transaksi Selesai"
            value={impact?.completed_transactions || 0}
            subtitle="Limbah yang sudah diserahkan"
            color="purple"
          />

          <StatsCard
            icon={<Leaf className="w-9 h-9 text-white" />}
            title="Impact Lingkungan"
            value={`${impact?.co2_emissions_prevented_kg?.toFixed(1) || 0}Kg CO₂`}
            subtitle="Emisi CO₂ yang berhasil dicegah"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tren Revenue</h3>
                <p className="text-sm text-gray-500">6 Bulan Terakhir</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue'];
                    return [value, 'Limbah (Kg)'];
                  }}
                />
                <Legend />
                <Bar dataKey="limbah" fill="#3b82f6" name="Limbah (Kg)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#22c55e" name="Revenue (Rp)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Status Limbah</h3>
                <p className="text-sm text-gray-500">Ringkasan keseluruhan</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Tersedia</p>
                    <p className="text-sm text-gray-600">Siap untuk di-booking</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {impact?.available_wastes || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-l-4 border-yellow-500">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Di-Booking</p>
                    <p className="text-sm text-gray-600">Menunggu penyerahan</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {impact?.pending_transactions || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Selesai</p>
                    <p className="text-sm text-gray-600">Transaksi completed</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {impact?.completed_transactions || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/my-wastes" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white hover:scale-105 transition-all duration-300">
            <Package className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Kelola Limbah</h3>
            <p className="text-blue-100">Upload & manage limbah Anda</p>
          </Link>

          <Link to="/marketplace" className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-xl p-6 text-white hover:scale-105 transition-all duration-300">
            <Eye className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Lihat Marketplace</h3>
            <p className="text-green-100">Cek siapa yang membutuhkan limbah</p>
          </Link>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
            <Award className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Total Impact</h3>
            <p className="text-purple-100">{impact?.trees_equivalent || 0} pohon ekuivalen</p>
          </div>
        </div>

        {/* PDF Certificate */}
        <div className="mb-8">
          <PDFCertificateGenerator impactData={impact} user={user} />
        </div>

        {/* Achievement Section */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-2xl shadow-2xl p-8 text-white">
          <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-8 h-8" />
            Pencapaian Producer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
              <p className="text-5xl mb-3">🏭</p>
              <p className="font-bold text-lg">Waste Producer</p>
              <p className="text-sm text-white text-opacity-80 mt-2">Mulai berkontribusi</p>
            </div>

            {impact?.total_waste_managed_kg > 50 && (
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
                <p className="text-5xl mb-3">⭐</p>
                <p className="font-bold text-lg">Active Producer</p>
                <p className="text-sm text-white text-opacity-80 mt-2">&gt;50 Kg Dikelola</p>
              </div>
            )}

            {impact?.total_waste_managed_kg > 100 && (
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
                <p className="text-5xl mb-3">🚀</p>
                <p className="font-bold text-lg">Circular Champion</p>
                <p className="text-sm text-white text-opacity-80 mt-2">&gt;100 Kg Dikelola</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
