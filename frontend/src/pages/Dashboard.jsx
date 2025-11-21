import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
import { DashboardPageSkeleton } from '../components/common/LoadingSkeleton';
import ProducerDashboard from '../components/dashboard/ProducerDashboard';
import RecyclerDashboard from '../components/dashboard/RecyclerDashboard';

const Dashboard = () => {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchImpact();

    // Auto-refresh data saat user kembali ke halaman
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchImpact();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchImpact = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getImpact();
      console.log('📊 Dashboard Impact Data:', response.data);
      setImpact(response.data);
    } catch (error) {
      console.error('Error fetching impact:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardPageSkeleton />;
  }

  // Render dashboard yang berbeda berdasarkan role
  if (user?.role === 'producer') {
    return <ProducerDashboard impact={impact} user={user} />;
  } else if (user?.role === 'recycler') {
    return <RecyclerDashboard impact={impact} user={user} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Role tidak dikenali</p>
    </div>
  );
};

export default Dashboard;
