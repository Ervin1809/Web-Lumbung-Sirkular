import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Leaf, TrendingUp, ShoppingBag, CheckCircle, Clock, Award, Zap, Heart, Globe } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PDFCertificateGenerator from '../impact/PDFCertificateGenerator';

const RecyclerDashboard = ({ impact, user }) => {
  // Generate impact trend data
  const getImpactTrendData = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totalWaste = impact?.total_waste_managed_kg || 0;
    const totalCO2 = impact?.co2_emissions_prevented_kg || 0;

    return months.map((month, index) => ({
      month,
      limbah: parseFloat((totalWaste * (index + 1) / 6).toFixed(2)),
      co2: parseFloat((totalCO2 * (index + 1) / 6).toFixed(2)),
      trees: Math.round((totalCO2 * (index + 1) / 6) / 21), // 1 tree = ~21 kg CO2/year
    }));
  };

  // Category pie chart data
  const getCategoryData = () => {
    const total = impact?.total_waste_managed_kg || 0;
    return [
      { name: 'Plastik', value: total * 0.35, color: '#3b82f6' },
      { name: 'Organik', value: total * 0.30, color: '#22c55e' },
      { name: 'Kertas', value: total * 0.20, color: '#f97316' },
      { name: 'Minyak', value: total * 0.10, color: '#fbbf24' },
      { name: 'Logam', value: total * 0.05, color: '#6b7280' },
    ];
  };

  const StatsCard = ({ icon, title, value, subtitle, color = 'green', link }) => {
    const colorClasses = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
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

  const impactTrendData = getImpactTrendData();
  const categoryData = getCategoryData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Recycler Badge */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg animate-pulse">
              <Recycle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Dashboard Recycler
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Selamat datang, <span className="font-semibold text-green-600">{impact?.user_name || user?.name}</span>
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
            <Recycle className="w-4 h-4" />
            Pengolah Limbah
          </div>
        </div>

        {/* Quick Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Recycle className="w-9 h-9 text-white" />}
            title="Limbah Diproses"
            value={`${impact?.total_waste_managed_kg?.toFixed(1) || 0} Kg`}
            subtitle="Total limbah yang diolah"
            color="green"
            link="/my-bookings"
          />

          <StatsCard
            icon={<Leaf className="w-9 h-9 text-white" />}
            title="CO₂ Dicegah"
            value={`${impact?.co2_emissions_prevented_kg?.toFixed(1) || 0} Kg`}
            subtitle="Emisi karbon berkurang"
            color="blue"
          />

          <StatsCard
            icon={<Globe className="w-9 h-9 text-white" />}
            title="Pohon Ekuivalen"
            value={impact?.trees_equivalent || 0}
            subtitle="Setara menanam pohon"
            color="purple"
          />

          <StatsCard
            icon={<CheckCircle className="w-9 h-9 text-white" />}
            title="Transaksi Sukses"
            value={impact?.completed_transactions || 0}
            subtitle="Booking yang selesai"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Environmental Impact Trend */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Impact Lingkungan</h3>
                <p className="text-sm text-gray-500">6 Bulan Terakhir</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={impactTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="limbah"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Limbah (Kg)"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="co2"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="CO₂ Dicegah (Kg)"
                />
                <Line
                  type="monotone"
                  dataKey="trees"
                  stroke="#a855f7"
                  strokeWidth={3}
                  name="Pohon Ekuivalen"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Kategori Limbah</h3>
                <p className="text-sm text-gray-500">Distribusi yang diproses</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)} Kg`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Status Booking</h3>
              <p className="text-sm text-gray-500">Ringkasan aktivitas Anda</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-l-4 border-yellow-500">
              <div className="flex items-center gap-4 mb-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-800">{impact?.pending_transactions || 0}</p>
                </div>
              </div>
              <p className="text-sm text-yellow-700">Menunggu pickup</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-4 mb-3">
                <Zap className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Processing</p>
                  <p className="text-3xl font-bold text-blue-800">{impact?.processing_transactions || 0}</p>
                </div>
              </div>
              <p className="text-sm text-blue-700">Sedang diproses</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-4 mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-700 font-medium">Completed</p>
                  <p className="text-3xl font-bold text-green-800">{impact?.completed_transactions || 0}</p>
                </div>
              </div>
              <p className="text-sm text-green-700">Transaksi selesai</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/marketplace" className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-xl p-6 text-white hover:scale-105 transition-all duration-300">
            <ShoppingBag className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Browse Limbah</h3>
            <p className="text-green-100">Cari limbah untuk diproses</p>
          </Link>

          <Link to="/my-bookings" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white hover:scale-105 transition-all duration-300">
            <Clock className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">My Bookings</h3>
            <p className="text-blue-100">Kelola booking Anda</p>
          </Link>

          <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl shadow-xl p-6 text-white">
            <Heart className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Total Savings</h3>
            <p className="text-purple-100">Rp {((impact?.total_waste_managed_kg || 0) * 1500).toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* PDF Certificate */}
        <div className="mb-8">
          <PDFCertificateGenerator impactData={impact} user={user} />
        </div>

        {/* Achievement Section */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
          <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-8 h-8" />
            Pencapaian Recycler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
              <p className="text-5xl mb-3">♻️</p>
              <p className="font-bold text-lg">Eco Processor</p>
              <p className="text-sm text-white text-opacity-80 mt-2">Mulai mengolah limbah</p>
            </div>

            {impact?.total_waste_managed_kg > 50 && (
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
                <p className="text-5xl mb-3">🌟</p>
                <p className="font-bold text-lg">Impact Creator</p>
                <p className="text-sm text-white text-opacity-80 mt-2">&gt;50 Kg Diproses</p>
              </div>
            )}

            {impact?.total_waste_managed_kg > 100 && (
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
                <p className="text-5xl mb-3">🏆</p>
                <p className="font-bold text-lg">Sustainability Master</p>
                <p className="text-sm text-white text-opacity-80 mt-2">&gt;100 Kg Diproses</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclerDashboard;
