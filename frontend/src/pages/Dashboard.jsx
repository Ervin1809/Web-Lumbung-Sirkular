import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
import { DashboardPageSkeleton } from '../components/common/LoadingSkeleton';
import ProducerDashboard from '../components/dashboard/ProducerDashboard';
import RecyclerDashboard from '../components/dashboard/RecyclerDashboard';

const Dashboard = () => {
  const [impact, setImpact] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh data saat user kembali ke halaman
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch both impact and chart data in parallel
      const [impactResponse, chartResponse] = await Promise.all([
        transactionAPI.getImpact(),
        transactionAPI.getChartData()
      ]);
      console.log('📊 Dashboard Impact Data:', impactResponse.data);
      console.log('📈 Dashboard Chart Data:', chartResponse.data);
      setImpact(impactResponse.data);
      setChartData(chartResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  // Render dashboard yang berbeda berdasarkan role
  if (user?.role === 'producer') {
    return <ProducerDashboard impact={impact} chartData={chartData} user={user} />;
  } else if (user?.role === 'recycler') {
    return <RecyclerDashboard impact={impact} chartData={chartData} user={user} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Role tidak dikenali</p>
    </div>
  );
};

export default Dashboard;
