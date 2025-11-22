import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI, wasteAPI } from '../services/api';
import { Package, CheckCircle, Clock, XCircle, Calendar, MapPin, Phone, User, Truck, Eye, X } from 'lucide-react';
import Button from '../components/common/Button';
import MapViewer from '../components/map/MapViewer';
import toast, { Toaster } from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [wastesData, setWastesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { user } = useAuth();

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
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
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
        <div className="p-6 space-y-6">
          {/* Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Lokasi Pengambilan
            </label>
            <MapViewer
              latitude={waste.latitude}
              longitude={waste.longitude}
              title={waste.title}
              height="h-80"
            />
          </div>

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
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Detail Booking</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Tanggal:</span>
                <span className="font-semibold">
                  {new Date(booking.pickup_date).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Waktu:</span>
                <span className="font-semibold">{booking.pickup_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Estimasi Jumlah:</span>
                <span className="font-semibold">{booking.estimated_quantity} Kg</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Metode:</span>
                <span className="font-semibold">
                  {booking.transport_method === 'pickup' ? 'Pickup Sendiri' : 'Minta Diantar'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Penanggung Jawab:</span>
                <span className="font-semibold">{booking.contact_person}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Telepon:</span>
                <span className="font-semibold">{booking.contact_phone}</span>
              </div>
              {booking.pickup_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                  <span className="text-gray-600">Alamat Pengiriman:</span>
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
