import { Link } from 'react-router-dom';
import { Factory, Package, DollarSign, TrendingUp, CheckCircle, Clock, Eye, Leaf, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
      <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer h-full`}>
        <div className="p-3 sm:p-4 md:p-6 h-full flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-white text-opacity-90 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 truncate">
                {title}
              </p>
              <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 break-words">
                {value}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-full flex-shrink-0 ml-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">{icon}</div>
            </div>
          </div>
          {subtitle && (
            <p className="text-white text-opacity-75 text-[10px] sm:text-xs line-clamp-2 mt-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );

    return link ? <Link to={link} className="block h-full"><Card /></Link> : <Card />;
  };

  const revenueData = getRevenueData();
  const totalRevenue = revenueData[revenueData.length - 1]?.revenue || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header with Producer Badge */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-lg">
              <Factory className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Dashboard Producer
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-0.5 sm:mt-1">
                Selamat datang, <span className="font-semibold text-blue-600">{impact?.user_name || user?.name}</span>
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-xs sm:text-sm">
            <Factory className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Penghasil Limbah
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Tren Revenue</h3>
                <p className="text-xs sm:text-sm text-gray-500">6 Bulan Terakhir</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue'];
                    return [value, 'Limbah (Kg)'];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="limbah" fill="#3b82f6" name="Limbah (Kg)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#22c55e" name="Revenue (Rp)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Status Limbah</h3>
                <p className="text-xs sm:text-sm text-gray-500">Ringkasan keseluruhan</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg sm:rounded-xl border-l-4 border-green-500">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Tersedia</p>
                    <p className="text-xs sm:text-sm text-gray-600">Siap untuk di-booking</p>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  {impact?.available_wastes || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg sm:rounded-xl border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Di-Booking</p>
                    <p className="text-xs sm:text-sm text-gray-600">Menunggu penyerahan</p>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {impact?.pending_transactions || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl border-l-4 border-blue-500">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Selesai</p>
                    <p className="text-xs sm:text-sm text-gray-600">Transaksi completed</p>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  {impact?.completed_transactions || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Link to="/my-wastes" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white hover:scale-105 transition-all duration-300">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Kelola Limbah</h3>
            <p className="text-blue-100 text-sm sm:text-base">Upload & manage limbah Anda</p>
          </Link>

          <Link to="/marketplace" className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white hover:scale-105 transition-all duration-300">
            <Eye className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Lihat Marketplace</h3>
            <p className="text-green-100 text-sm sm:text-base">Cek siapa yang membutuhkan limbah</p>
          </Link>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white sm:col-span-2 md:col-span-1">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Total Impact</h3>
            <p className="text-purple-100 text-sm sm:text-base">{impact?.trees_equivalent || 0} pohon ekuivalen</p>
          </div>
        </div>

        {/* PDF Certificate */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <PDFCertificateGenerator impactData={impact} user={user} />
        </div>

        {/* Achievement Section */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 text-white">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            Pencapaian Producer
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
              <p className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🏭</p>
              <p className="font-bold text-base sm:text-lg">Waste Producer</p>
              <p className="text-xs sm:text-sm text-white text-opacity-80 mt-1 sm:mt-2">Mulai berkontribusi</p>
            </div>

            {impact?.total_waste_managed_kg > 50 && (
              <div className="bg-white bg-opacity-20 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
                <p className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">⭐</p>
                <p className="font-bold text-base sm:text-lg">Active Producer</p>
                <p className="text-xs sm:text-sm text-white text-opacity-80 mt-1 sm:mt-2">&gt;50 Kg Dikelola</p>
              </div>
            )}

            {impact?.total_waste_managed_kg > 100 && (
              <div className="bg-white bg-opacity-20 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm transform hover:scale-105 transition-all">
                <p className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🚀</p>
                <p className="font-bold text-base sm:text-lg">Circular Champion</p>
                <p className="text-xs sm:text-sm text-white text-opacity-80 mt-1 sm:mt-2">&gt;100 Kg Dikelola</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
