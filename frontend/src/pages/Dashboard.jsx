import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
import { TrendingUp, Package, Award, Leaf, Users, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchImpact();
  }, []);

  const fetchImpact = async () => {
    try {
      const response = await transactionAPI.getImpact();
      setImpact(response.data);
    } catch (error) {
      console.error('Error fetching impact:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatsCard = ({ icon, title, value, subtitle, color = 'green' }) => {
    const colorClasses = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <div className={`bg-gradient-to-r ${colorClasses[color]} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-90 text-sm font-medium mb-1">
                {title}
              </p>
              <p className="text-white text-3xl font-bold">
                {value}
              </p>
              {subtitle && (
                <p className="text-white text-opacity-75 text-xs mt-2">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              {icon}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Impact
          </h1>
          <p className="text-gray-600">
            Selamat datang, <span className="font-semibold">{impact?.user_name || user?.name}</span>
          </p>
          <div className="mt-2 inline-block">
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${
              impact?.role === 'producer' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {impact?.role === 'producer' ? '🏭 Producer' : '♻️ Recycler'}
            </span>
          </div>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<Package className="w-8 h-8 text-white" />}
            title="Total Limbah Dikelola"
            value={`${impact?.total_waste_managed_kg?.toFixed(2) || 0} Kg`}
            subtitle="Limbah yang berhasil diselamatkan dari TPA"
            color="green"
          />

          <StatsCard
            icon={<Leaf className="w-8 h-8 text-white" />}
            title="CO₂ yang Dicegah"
            value={`${impact?.co2_emissions_prevented_kg?.toFixed(2) || 0} Kg`}
            subtitle="Emisi karbon yang berhasil dikurangi"
            color="blue"
          />

          <StatsCard
            icon={<Award className="w-8 h-8 text-white" />}
            title="Kontribusi Lingkungan"
            value={impact?.total_waste_managed_kg > 0 ? "Aktif" : "Mulai"}
            subtitle={impact?.message}
            color="purple"
          />
        </div>

        {/* Visual Impact */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Environmental Impact Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Dampak Lingkungan
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Limbah Terolah</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {((impact?.total_waste_managed_kg || 0) / 1000 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((impact?.total_waste_managed_kg || 0) / 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Pengurangan Emisi</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {((impact?.co2_emissions_prevented_kg || 0) / 500 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((impact?.co2_emissions_prevented_kg || 0) / 5, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>🌍 Ekuivalen:</strong> Anda telah menyelamatkan lingkungan setara dengan menanam{' '}
                <strong>{Math.floor((impact?.co2_emissions_prevented_kg || 0) / 0.5)}</strong> pohon!
              </p>
            </div>
          </div>

          {/* Role-specific Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              {impact?.role === 'producer' ? 'Statistik Produsen' : 'Statistik Pengolah'}
            </h3>

            {impact?.role === 'producer' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Upload</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.floor((impact?.total_waste_managed_kg || 0) / 10) || 0}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Limbah Terjual</p>
                    <p className="text-2xl font-bold text-green-600">
                      {impact?.total_waste_managed_kg?.toFixed(0) || 0} Kg
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm text-gray-700">
                    <strong>Tips:</strong> Semakin banyak limbah yang Anda kelola dengan baik, 
                    semakin besar dampak positif untuk lingkungan!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Limbah Diambil</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.floor((impact?.total_waste_managed_kg || 0) / 15) || 0}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Diolah</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {impact?.total_waste_managed_kg?.toFixed(0) || 0} Kg
                    </p>
                  </div>
                  <Leaf className="w-8 h-8 text-blue-600" />
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm text-gray-700">
                    <strong>Tips:</strong> Terus tingkatkan pengolahan limbah untuk 
                    menciptakan ekonomi sirkular yang berkelanjutan!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Badges (Optional) */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">🏆 Pencapaian Anda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <p className="text-3xl mb-2">🌱</p>
              <p className="font-semibold">Eco Warrior</p>
              <p className="text-sm text-white text-opacity-80">Mulai berkontribusi</p>
            </div>
            
            {impact?.total_waste_managed_kg > 50 && (
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <p className="text-3xl mb-2">⭐</p>
                <p className="font-semibold">Impact Maker</p>
                <p className="text-sm text-white text-opacity-80">&gt;50 Kg Terolah</p>
              </div>
            )}
            
            {impact?.total_waste_managed_kg > 100 && (
              <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                <p className="text-3xl mb-2">🚀</p>
                <p className="font-semibold">Sustainability Hero</p>
                <p className="text-sm text-white text-opacity-80">&gt;100 Kg Terolah</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;