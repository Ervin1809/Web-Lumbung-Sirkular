import { Link } from 'react-router-dom';
import { Recycle, Leaf, TrendingUp, ShoppingBag, CheckCircle, Clock, Award, Zap, Heart, Globe, Lock } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PDFCertificateGenerator from '../impact/PDFCertificateGenerator';

const RecyclerDashboard = ({ impact, chartData, user }) => {
  // Use real chart data from API or fallback to empty
  const getImpactTrendData = () => {
    if (chartData?.trend_data && chartData.has_data) {
      return chartData.trend_data.map(item => ({
        month: item.month,
        limbah: item.limbah,
        co2: item.co2,
        trees: item.trees,
      }));
    }
    // Return empty data structure if no real data
    return [
      { month: 'Jul', limbah: 0, co2: 0, trees: 0 },
      { month: 'Aug', limbah: 0, co2: 0, trees: 0 },
      { month: 'Sep', limbah: 0, co2: 0, trees: 0 },
      { month: 'Oct', limbah: 0, co2: 0, trees: 0 },
      { month: 'Nov', limbah: 0, co2: 0, trees: 0 },
      { month: 'Dec', limbah: 0, co2: 0, trees: 0 },
    ];
  };

  // Use real category data from API or fallback to empty
  const getCategoryData = () => {
    if (chartData?.category_data && chartData.category_data.length > 0) {
      return chartData.category_data;
    }
    // Return empty array if no real data
    return [];
  };

  const hasChartData = chartData?.has_data;
  const hasCategoryData = chartData?.category_data?.length > 0;

  const StatsCard = ({ icon, title, value, subtitle, color = 'green', link }) => {
    const colorClasses = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
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

  const impactTrendData = getImpactTrendData();
  const categoryData = getCategoryData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header with Recycler Badge */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-lg animate-pulse">
              <Recycle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Dashboard Recycler
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-0.5 sm:mt-1">
                Selamat datang, <span className="font-semibold text-green-600">{impact?.user_name || user?.name}</span>
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-green-100 text-green-800 rounded-full font-semibold text-xs sm:text-sm">
            <Recycle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Pengolah Limbah
          </div>
        </div>

        {/* Quick Impact Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <StatsCard
            icon={<Recycle className="w-full h-full text-white" />}
            title="Limbah Diproses"
            value={`${impact?.total_waste_managed_kg?.toFixed(1) || 0} Kg`}
            subtitle="Total limbah yang diolah"
            color="green"
            link="/my-bookings"
          />

          <StatsCard
            icon={<Leaf className="w-full h-full text-white" />}
            title="CO₂ Dicegah"
            value={`${impact?.co2_emissions_prevented_kg?.toFixed(1) || 0} Kg`}
            subtitle="Emisi karbon berkurang"
            color="blue"
          />

          <StatsCard
            icon={<Globe className="w-full h-full text-white" />}
            title="Pohon Ekuivalen"
            value={impact?.trees_equivalent || 0}
            subtitle="Setara menanam pohon"
            color="purple"
          />

          <StatsCard
            icon={<CheckCircle className="w-full h-full text-white" />}
            title="Transaksi Sukses"
            value={impact?.completed_transactions || 0}
            subtitle="Booking yang selesai"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Environmental Impact Trend */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Impact Lingkungan</h3>
                <p className="text-xs sm:text-sm text-gray-500">6 Bulan Terakhir</p>
              </div>
            </div>

            {hasChartData ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={impactTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="limbah"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Limbah (Kg)"
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="CO₂ Dicegah (Kg)"
                  />
                  <Line
                    type="monotone"
                    dataKey="trees"
                    stroke="#a855f7"
                    strokeWidth={2}
                    name="Pohon Ekuivalen"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex flex-col items-center justify-center text-gray-400">
                <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm text-center">Belum ada data transaksi selesai</p>
                <p className="text-xs mt-1">Data akan muncul setelah ada transaksi yang selesai</p>
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Kategori Limbah</h3>
                <p className="text-xs sm:text-sm text-gray-500">Distribusi yang diproses</p>
              </div>
            </div>

            {hasCategoryData ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
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
            ) : (
              <div className="h-[220px] flex flex-col items-center justify-center text-gray-400">
                <ShoppingBag className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm text-center">Belum ada data kategori</p>
                <p className="text-xs mt-1">Data akan muncul setelah ada transaksi yang selesai</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Status Overview */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Status Booking</h3>
              <p className="text-xs sm:text-sm text-gray-500">Ringkasan aktivitas Anda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border-l-4 border-yellow-500">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                <div>
                  <p className="text-xs sm:text-sm text-yellow-700 font-medium">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-800">{impact?.pending_transactions || 0}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-yellow-700">Menunggu pickup</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <div>
                  <p className="text-xs sm:text-sm text-blue-700 font-medium">Processing</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-800">{impact?.processing_transactions || 0}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-700">Sedang diproses</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                <div>
                  <p className="text-xs sm:text-sm text-green-700 font-medium">Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-800">{impact?.completed_transactions || 0}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-green-700">Transaksi selesai</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <Link to="/marketplace" className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white hover:scale-105 transition-all duration-300">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Browse Limbah</h3>
            <p className="text-green-100 text-sm sm:text-base">Cari limbah untuk diproses</p>
          </Link>

          <Link to="/my-bookings" className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white hover:scale-105 transition-all duration-300">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">My Bookings</h3>
            <p className="text-blue-100 text-sm sm:text-base">Kelola booking Anda</p>
          </Link>

          <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white sm:col-span-2 md:col-span-1">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Total Savings</h3>
            <p className="text-purple-100 text-sm sm:text-base">Rp {((impact?.total_waste_managed_kg || 0) * 1500).toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* PDF Certificate */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <PDFCertificateGenerator impactData={impact} user={user} />
        </div>

        {/* Achievement Section */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 sm:gap-3">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              Pencapaian Recycler
            </h3>
            <div className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full">
              {[
                impact?.completed_transactions >= 1,
                (impact?.total_waste_managed_kg || 0) >= 50,
                (impact?.total_waste_managed_kg || 0) >= 100,
                (impact?.co2_emissions_prevented_kg || 0) >= 25,
                (impact?.trees_equivalent || 0) >= 1,
                impact?.completed_transactions >= 5,
              ].filter(Boolean).length} / 6 Terbuka
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {/* Badge 1: First Transaction */}
            <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm transition-all ${
              impact?.completed_transactions >= 1
                ? 'bg-white/25 hover:bg-white/30 hover:scale-105'
                : 'bg-black/20 opacity-60'
            }`}>
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                {impact?.completed_transactions >= 1 ? '🎉' : <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-white/60" />}
              </div>
              <p className="font-bold text-xs sm:text-sm">Starter</p>
              <p className="text-[10px] sm:text-xs text-white/80 mt-1">1 Transaksi</p>
            </div>

            {/* Badge 2: 50 Kg Processed */}
            <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm transition-all ${
              (impact?.total_waste_managed_kg || 0) >= 50
                ? 'bg-white/25 hover:bg-white/30 hover:scale-105'
                : 'bg-black/20 opacity-60'
            }`}>
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                {(impact?.total_waste_managed_kg || 0) >= 50 ? '🌟' : <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-white/60" />}
              </div>
              <p className="font-bold text-xs sm:text-sm">Impact Creator</p>
              <p className="text-[10px] sm:text-xs text-white/80 mt-1">50 Kg</p>
            </div>

            {/* Badge 3: 100 Kg Processed */}
            <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm transition-all ${
              (impact?.total_waste_managed_kg || 0) >= 100
                ? 'bg-white/25 hover:bg-white/30 hover:scale-105'
                : 'bg-black/20 opacity-60'
            }`}>
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                {(impact?.total_waste_managed_kg || 0) >= 100 ? '🏆' : <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-white/60" />}
              </div>
              <p className="font-bold text-xs sm:text-sm">Master</p>
              <p className="text-[10px] sm:text-xs text-white/80 mt-1">100 Kg</p>
            </div>

            {/* Badge 4: CO2 Champion */}
            <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm transition-all ${
              (impact?.co2_emissions_prevented_kg || 0) >= 25
                ? 'bg-white/25 hover:bg-white/30 hover:scale-105'
                : 'bg-black/20 opacity-60'
            }`}>
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                {(impact?.co2_emissions_prevented_kg || 0) >= 25 ? '💨' : <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-white/60" />}
              </div>
              <p className="font-bold text-xs sm:text-sm">CO₂ Saver</p>
              <p className="text-[10px] sm:text-xs text-white/80 mt-1">25 Kg CO₂</p>
            </div>

            {/* Badge 5: Tree Planter */}
            <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm transition-all ${
              (impact?.trees_equivalent || 0) >= 1
                ? 'bg-white/25 hover:bg-white/30 hover:scale-105'
                : 'bg-black/20 opacity-60'
            }`}>
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                {(impact?.trees_equivalent || 0) >= 1 ? '🌳' : <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-white/60" />}
              </div>
              <p className="font-bold text-xs sm:text-sm">Tree Planter</p>
              <p className="text-[10px] sm:text-xs text-white/80 mt-1">1 Pohon</p>
            </div>

            {/* Badge 6: Consistency */}
            <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm transition-all ${
              impact?.completed_transactions >= 5
                ? 'bg-white/25 hover:bg-white/30 hover:scale-105'
                : 'bg-black/20 opacity-60'
            }`}>
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                {impact?.completed_transactions >= 5 ? '⭐' : <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-white/60" />}
              </div>
              <p className="font-bold text-xs sm:text-sm">Konsisten</p>
              <p className="text-[10px] sm:text-xs text-white/80 mt-1">5 Transaksi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclerDashboard;
