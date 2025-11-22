import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { wasteAPI, transactionAPI } from '../services/api';
import { Search, Filter, Package, AlertCircle, CheckCircle, Heart, TrendingUp, Leaf, Star } from 'lucide-react';
import WasteCard from '../components/waste/WasteCard';
import BookingModal from '../components/waste/BookingModal';

const Marketplace = () => {
  const [wastes, setWastes] = useState([]);
  const [filteredWastes, setFilteredWastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState('all'); // 'all' or 'wishlist'

  const { user, isAuthenticated } = useAuth();
  const userRole = user?.role;

  const categories = ['all', 'Minyak', 'Plastik', 'Organik', 'Kertas', 'Logam'];

  useEffect(() => {
    fetchWastes();
  }, []);

  useEffect(() => {
    filterWastes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm, wastes, view]);

  const fetchWastes = async () => {
    try {
      setLoading(true);
      const response = await wasteAPI.getAll();
      // Sort by created_at descending (terbaru di atas/kiri)
      const sortedWastes = response.data.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );
      setWastes(sortedWastes);
    } catch (error) {
      console.error('Error fetching wastes:', error);
      setMessage({
        type: 'error',
        text: 'Gagal memuat data limbah. ' + (error.response?.data?.detail || '')
      });
    } finally {
      setLoading(false);
    }
  };

  const filterWastes = () => {
    let filtered = [...wastes];

    // Filter by wishlist view
    if (view === 'wishlist') {
      filtered = filtered.filter(waste => wishlist.includes(waste.id));
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(waste => waste.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(waste =>
        waste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        waste.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredWastes(filtered);
  };

  const handleBookClick = (waste) => {
    if (!isAuthenticated) {
      setMessage({
        type: 'error',
        text: 'Silakan login terlebih dahulu'
      });
      return;
    }

    if (userRole !== 'recycler') {
      setMessage({
        type: 'error',
        text: 'Hanya Recycler yang bisa mengambil limbah'
      });
      return;
    }

    setSelectedWaste(waste);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (wasteId, bookingData) => {
    try {
      await transactionAPI.book(wasteId, bookingData);
      setMessage({
        type: 'success',
        text: 'Berhasil booking limbah! Producer akan menghubungi Anda segera.'
      });

      // Refresh list
      setTimeout(() => {
        fetchWastes();
        setMessage({ type: '', text: '' });
        setShowBookingModal(false);
      }, 3000);
    } catch (error) {
      console.error('Error booking waste:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Gagal booking limbah'
      });
    }
  };

  const toggleWishlist = (wasteId) => {
    let newWishlist;
    if (wishlist.includes(wasteId)) {
      newWishlist = wishlist.filter(id => id !== wasteId);
    } else {
      newWishlist = [...wishlist, wasteId];
    }
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const getQuickStats = () => {
    const totalWeight = filteredWastes.reduce((sum, w) => sum + w.weight, 0);
    const freeItems = filteredWastes.filter(w => w.price === 0).length;
    return { totalWeight, freeItems };
  };

  const stats = getQuickStats();

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Marketplace Limbah
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Temukan limbah yang bisa Anda olah menjadi sumber daya berharga
          </p>
        </div>

        {/* Quick Stats for Recycler */}
        {userRole === 'recycler' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-5 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 opacity-80" />
                <span className="text-lg sm:text-xl md:text-2xl font-bold">{filteredWastes.length}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium opacity-90">Limbah Tersedia</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-5 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 opacity-80" />
                <span className="text-lg sm:text-xl md:text-2xl font-bold">{stats.totalWeight.toFixed(1)}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium opacity-90">Total Kg</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-5 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 opacity-80" />
                <span className="text-lg sm:text-xl md:text-2xl font-bold">{stats.freeItems}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium opacity-90">Gratis</p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-5 text-white">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 opacity-80" />
                <span className="text-lg sm:text-xl md:text-2xl font-bold">{wishlist.length}</span>
              </div>
              <p className="text-xs sm:text-sm font-medium opacity-90">Wishlist</p>
            </div>
          </div>
        )}

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* View Toggle & Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          {/* View Toggle */}
          {userRole === 'recycler' && (
            <div className="flex gap-2 mb-3 sm:mb-4">
              <button
                onClick={() => setView('all')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                  view === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semua Limbah
              </button>
              <button
                onClick={() => setView('wishlist')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                  view === 'wishlist'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Wishlist</span> ({wishlist.length})
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari limbah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Semua Kategori' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredWastes.length} {view === 'wishlist' ? 'wishlist' : 'limbah'}
            {view === 'all' && ` dari ${wastes.length} total`}
          </div>
        </div>

        {/* Waste Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredWastes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {view === 'wishlist'
                ? 'Wishlist Kosong'
                : 'Tidak ada limbah ditemukan'}
            </h3>
            <p className="text-gray-600">
              {view === 'wishlist'
                ? 'Belum ada limbah di wishlist Anda. Klik ikon ❤️ pada limbah untuk menambahkan ke wishlist.'
                : searchTerm || selectedCategory !== 'all'
                ? 'Coba ubah filter pencarian Anda'
                : 'Belum ada limbah yang tersedia saat ini'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {filteredWastes.map(waste => (
              <WasteCard
                key={waste.id}
                waste={waste}
                onBook={handleBookClick}
                userRole={userRole}
                isInWishlist={wishlist.includes(waste.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedWaste && (
        <BookingModal
          waste={selectedWaste}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedWaste(null);
          }}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default Marketplace;
