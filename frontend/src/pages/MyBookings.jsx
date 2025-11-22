import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI, wasteAPI } from '../services/api';
import { Package, CheckCircle, Clock, XCircle, Calendar, MapPin, Phone, User, Truck, Eye, X, Navigation, DollarSign, Filter } from 'lucide-react';
import Button from '../components/common/Button';
import MapViewer from '../components/map/MapViewer';
import toast, { Toaster } from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [wastesData, setWastesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuth();

  // Filter options
  const filterOptions = [
    { key: 'all', label: 'Semua' },
    { key: 'waiting_confirmation', label: 'Menunggu Konfirmasi' },
    { key: 'pending', label: 'Menunggu Pickup' },
    { key: 'cancelled', label: 'Dibatalkan' },
    { key: 'completed', label: 'Selesai' },
  ];

  // Filter bookings based on active filter
  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });

  useEffect(() => {
    if (user?.role === 'recycler') {
      fetchMyBookings();
    }
  }, [user]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getMyBookings();
      const bookingsData = response.data;

      // Sort by created_at descending (terbaru di atas)
      const sortedBookings = bookingsData.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );
      setBookings(sortedBookings);

      // Fetch waste data for each booking
      const wastesMap = {};
      for (const booking of sortedBookings) {
        try {
          const wasteResponse = await wasteAPI.getById(booking.waste_id);
          wastesMap[booking.waste_id] = wasteResponse.data;
        } catch (error) {
          console.error(`Error fetching waste ${booking.waste_id}:`, error);
        }
      }
      setWastesData(wastesMap);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReceived = async (bookingId, transportMethod) => {
    const isDelivery = transportMethod === 'delivery';
    const confirmMessage = isDelivery
      ? 'Apakah Anda yakin limbah sudah diantar ke lokasi Anda?\n\nProducer akan diminta untuk mengkonfirmasi.'
      : 'Apakah Anda yakin sudah mengambil limbah ini?\n\nProducer akan diminta untuk mengkonfirmasi.';

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) return;

    try {
      await transactionAPI.claimReceived(bookingId);
      const successMessage = isDelivery
        ? 'Klaim berhasil! Menunggu konfirmasi producer bahwa limbah sudah diantar.'
        : 'Klaim berhasil! Menunggu konfirmasi producer.';
      toast.success(successMessage);
      fetchMyBookings();
    } catch (error) {
      console.error('Error claiming:', error);
      toast.error(error.response?.data?.detail || 'Gagal mengklaim limbah');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin membatalkan booking ini?'
    );

    if (!confirmed) return;

    try {
      await transactionAPI.cancel(bookingId);
      toast.success('Booking berhasil dibatalkan');
      fetchMyBookings();
    } catch (error) {
      console.error('Error canceling:', error);
      toast.error(error.response?.data?.detail || 'Gagal membatalkan booking');
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu Pickup' },
      waiting_confirmation: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Menunggu Konfirmasi' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (user?.role !== 'recycler') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Akses Ditolak
          </h3>
          <p className="text-gray-600">
            Halaman ini hanya untuk Recycler
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Booking Saya
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Kelola dan lacak semua booking limbah Anda
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none sm:min-w-[280px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm cursor-pointer"
              >
                {filterOptions.map((option) => {
                  const count = option.key === 'all'
                    ? bookings.length
                    : bookings.filter(b => b.status === option.key).length;
                  return (
                    <option key={option.key} value={option.key}>
                      {option.label} ({count})
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {/* Result count badge */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-900">{filteredBookings.length}</span>
              <span>booking ditemukan</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Booking
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai cari limbah di Marketplace dan buat booking pertama Anda
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak Ada Booking
            </h3>
            <p className="text-gray-600">
              Tidak ada booking dengan status "{filterOptions.find(f => f.key === activeFilter)?.label}"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const waste = wastesData[booking.waste_id];
              if (!waste) return null;

              return (
                <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {/* Waste Image */}
                    <div className="w-full sm:w-32 md:w-48 h-40 sm:h-auto flex-shrink-0">
                      <img
                        src={waste.image_url || 'https://via.placeholder.com/200x200?text=No+Image'}
                        alt={waste.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-5 md:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {waste.title}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Kategori: <span className="font-medium">{waste.category}</span> •
                            Berat: <span className="font-medium">{booking.estimated_quantity || '0'} Kg</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleViewDetail(booking)}
                          className="text-green-600 hover:text-green-700 p-1.5 sm:p-2 flex-shrink-0"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Pickup Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{booking.pickup_date ? new Date(booking.pickup_date).toLocaleDateString('id-ID') : 'Tidak ada'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{booking.pickup_time || 'Tidak ada'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{booking.transport_method === 'pickup' ? 'Pickup Sendiri' : 'Minta Diantar'}</span>
                        </div>
                      </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleClaimReceived(booking.id, booking.transport_method)}
                            size="sm"
                            className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none"
                          >
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {booking.transport_method === 'delivery' ? 'Sudah Diantar' : 'Sudah Saya Ambil'}
                          </Button>
                          <Button
                            onClick={() => handleCancelBooking(booking.id)}
                            variant="secondary"
                            size="sm"
                            className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none"
                          >
                            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Batalkan
                          </Button>
                        </>
                      )}
                      {booking.status === 'waiting_confirmation' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3 w-full">
                          <p className="text-xs sm:text-sm text-blue-800">
                            ⏳ {booking.transport_method === 'delivery'
                              ? 'Menunggu konfirmasi dari producer bahwa limbah sudah diantar ke lokasi Anda'
                              : 'Menunggu konfirmasi dari producer bahwa limbah sudah diserahkan'}
                          </p>
                        </div>
                      )}
                      {booking.status === 'completed' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 sm:p-3 w-full">
                          <p className="text-xs sm:text-sm text-green-800 flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            Transaksi selesai! Terima kasih telah berkontribusi pada ekonomi sirkular
                          </p>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            waste={wastesData[selectedBooking.waste_id]}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedBooking(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Detail Modal Component
const BookingDetailModal = ({ booking, waste, onClose }) => {
  const isDelivery = booking.transport_method === 'delivery';

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = useMemo(() => {
    if (!waste?.latitude || !waste?.longitude || !booking?.delivery_latitude || !booking?.delivery_longitude) {
      return null;
    }

    const R = 6371; // Earth's radius in km
    const dLat = (booking.delivery_latitude - waste.latitude) * Math.PI / 180;
    const dLon = (booking.delivery_longitude - waste.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(waste.latitude * Math.PI / 180) * Math.cos(booking.delivery_latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [waste, booking]);

  // Calculate shipping cost based on distance
  const shippingCost = useMemo(() => {
    if (!calculateDistance) return null;
    const ratePerKm = 5000;
    const minimumCost = 10000;
    return Math.max(minimumCost, Math.round(calculateDistance * ratePerKm));
  }, [calculateDistance]);

  // Google Maps direction URL
  const getDeliveryRouteUrl = () => {
    if (!booking.delivery_latitude || !booking.delivery_longitude) return null;
    return `https://www.google.com/maps/dir/?api=1&origin=${waste.latitude},${waste.longitude}&destination=${booking.delivery_latitude},${booking.delivery_longitude}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-[1000] bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Detail Booking</h3>
            <p className="text-sm text-gray-600 mt-1">{waste.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-6">
          {/* Map - Lokasi Pengambilan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Lokasi Limbah (Producer)
            </label>
            <MapViewer
              latitude={waste.latitude}
              longitude={waste.longitude}
              title={waste.title}
              height="h-64"
            />
          </div>

          {/* Delivery Location Map & Shipping Cost - Only for Delivery */}
          {isDelivery && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-orange-600" />
                Lokasi Pengiriman (Tujuan Anda)
              </h4>

              {/* Map showing delivery location */}
              {booking.delivery_latitude && booking.delivery_longitude ? (
                <div className="mb-4">
                  <MapViewer
                    latitude={booking.delivery_latitude}
                    longitude={booking.delivery_longitude}
                    title="Lokasi Pengiriman"
                    height="h-48"
                    showGoogleMapsLink={false}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500 mb-4">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Koordinat lokasi pengiriman tidak tersedia</p>
                </div>
              )}

              {/* Shipping Cost & Distance */}
              {calculateDistance && shippingCost && (
                <div className="bg-white rounded-lg p-4 border border-orange-200 mb-4">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    Estimasi Biaya Pengiriman
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Jarak Pengiriman:</label>
                      <p className="font-bold text-lg text-gray-900">{calculateDistance.toFixed(2)} Km</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Estimasi Ongkir:</label>
                      <p className="font-bold text-lg text-orange-600">Rp {shippingCost.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    * Estimasi berdasarkan jarak (Rp 5.000/Km, min. Rp 10.000). Biaya final ditentukan oleh producer.
                  </p>
                </div>
              )}

              {/* Google Maps Route Button */}
              {getDeliveryRouteUrl() && (
                <a
                  href={getDeliveryRouteUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  Lihat Rute Pengiriman di Google Maps
                </a>
              )}
            </div>
          )}

          {/* Waste Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Informasi Limbah</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Kategori:</span>
                <span className="font-semibold ml-2">{waste.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Berat Tersedia:</span>
                <span className="font-semibold ml-2">{waste.weight} Kg</span>
              </div>
              <div>
                <span className="text-gray-600">Harga:</span>
                <span className="font-semibold ml-2">
                  {waste.price === 0 ? 'Gratis' : `Rp ${waste.price.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold ml-2">{waste.status}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className={`rounded-lg p-4 ${isDelivery ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {isDelivery ? (
                <>
                  <Truck className="w-5 h-5 text-orange-600" />
                  Detail Pengiriman
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 text-green-600" />
                  Detail Pengambilan
                </>
              )}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${isDelivery ? 'text-orange-600' : 'text-gray-600'}`} />
                <span className="text-gray-600">{isDelivery ? 'Tanggal Pengiriman:' : 'Tanggal:'}</span>
                <span className="font-semibold">
                  {new Date(booking.pickup_date).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isDelivery ? 'text-orange-600' : 'text-gray-600'}`} />
                <span className="text-gray-600">Waktu:</span>
                <span className="font-semibold">{booking.pickup_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className={`w-4 h-4 ${isDelivery ? 'text-orange-600' : 'text-gray-600'}`} />
                <span className="text-gray-600">Estimasi Jumlah:</span>
                <span className="font-semibold">{booking.estimated_quantity} Kg</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className={`w-4 h-4 ${isDelivery ? 'text-orange-600' : 'text-gray-600'}`} />
                <span className="text-gray-600">Metode:</span>
                <span className={`font-semibold ${isDelivery ? 'text-orange-600' : ''}`}>
                  {isDelivery ? 'Minta Diantar' : 'Pickup Sendiri'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">{isDelivery ? 'Penerima:' : 'Penanggung Jawab:'}</span>
                <span className="font-semibold">{booking.contact_person}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Telepon:</span>
                <span className="font-semibold">{booking.contact_phone}</span>
              </div>
              {booking.pickup_address && (
                <div className="flex items-start gap-2">
                  <MapPin className={`w-4 h-4 mt-0.5 ${isDelivery ? 'text-orange-600' : 'text-gray-600'}`} />
                  <span className="text-gray-600">{isDelivery ? 'Alamat Tujuan:' : 'Alamat Pengiriman:'}</span>
                  <span className="font-semibold flex-1">{booking.pickup_address}</span>
                </div>
              )}
              {booking.notes && (
                <div className="flex items-start gap-2 pt-2 border-t">
                  <span className="text-gray-600">Catatan:</span>
                  <span className="flex-1">{booking.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tips for Delivery */}
          {isDelivery && booking.status === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tips:</strong> Producer akan mengirimkan limbah ke lokasi Anda pada tanggal dan waktu yang ditentukan.
                Pastikan Anda atau perwakilan Anda tersedia di lokasi untuk menerima limbah.
              </p>
            </div>
          )}

          {/* Close Button */}
          <Button onClick={onClose} className="w-full">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
