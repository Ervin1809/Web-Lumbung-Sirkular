import React, { useMemo, useState } from 'react';
import { X, Calendar, Clock, Package, Truck, User, Phone, MapPin, MessageSquare, Mail, CheckCircle, AlertCircle, Navigation, DollarSign, CreditCard, Image, XCircle, Banknote, QrCode } from 'lucide-react';
import Button from '../common/Button';
import MapViewer from '../map/MapViewer';
import { transactionAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BookingDetailModal = ({ waste, bookingInfo, onClose, onConfirmHandover, onRefresh }) => {
  const [verifying, setVerifying] = useState(false);
  const [showProofImage, setShowProofImage] = useState(false);

  // 1. Ambil transaction secara aman untuk digunakan di hooks
  const transaction = bookingInfo?.transaction;

  // 2. Pindahkan useMemo ke PALING ATAS (sebelum conditional return)
  // Gunakan optional chaining (?.) untuk mencegah error saat data null
  const calculateDistance = useMemo(() => {
    if (!waste?.latitude || !waste?.longitude || !transaction?.delivery_latitude || !transaction?.delivery_longitude) {
      return null;
    }

    const R = 6371; // Earth's radius in km
    const dLat = (transaction.delivery_latitude - waste.latitude) * Math.PI / 180;
    const dLon = (transaction.delivery_longitude - waste.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(waste.latitude * Math.PI / 180) * Math.cos(transaction.delivery_latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [waste, transaction]); // Dependency disesuaikan agar aman

  // Calculate shipping cost based on distance
  const shippingCost = useMemo(() => {
    if (!calculateDistance) return null;
    const ratePerKm = 5000;
    const minimumCost = 10000;
    return Math.max(minimumCost, Math.round(calculateDistance * ratePerKm));
  }, [calculateDistance]);

  // 3. BARU lakukan pengecekan kondisi untuk Early Return
  if (!bookingInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Tidak Ada Booking
          </h3>
          <p className="text-gray-600 mb-6">
            Limbah ini belum di-booking oleh recycler manapun.
          </p>
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    );
  }

  // 4. Lanjutkan logika komponen utama (Destructuring sisanya di sini)
  const { recycler } = bookingInfo;
  const isDelivery = transaction.transport_method === 'delivery';

  // Google Maps direction URL for delivery route
  const getDeliveryRouteUrl = () => {
    if (!transaction.delivery_latitude || !transaction.delivery_longitude) return null;
    return `https://www.google.com/maps/dir/?api=1&origin=${waste.latitude},${waste.longitude}&destination=${transaction.delivery_latitude},${transaction.delivery_longitude}`;
  };

  const handleConfirm = async () => {
    const confirmMessage = isDelivery
      ? 'Apakah Anda yakin limbah sudah diantar ke lokasi recycler?\n\nSetelah dikonfirmasi, transaksi akan selesai dan akan masuk ke dashboard progress Anda.'
      : 'Apakah Anda yakin limbah sudah diserahkan ke recycler?\n\nSetelah dikonfirmasi, transaksi akan selesai dan akan masuk ke dashboard progress Anda.';

    const confirmed = window.confirm(confirmMessage);

    if (confirmed && onConfirmHandover) {
      await onConfirmHandover(transaction.id);
    }
  };

  // Handle payment verification
  const handleVerifyPayment = async (action) => {
    const message = action === 'approve'
      ? 'Apakah Anda yakin ingin menyetujui pembayaran ini?'
      : 'Apakah Anda yakin ingin menolak pembayaran ini? Recycler harus mengupload ulang bukti pembayaran.';

    if (!window.confirm(message)) return;

    try {
      setVerifying(true);
      await transactionAPI.verifyPayment(transaction.id, action);
      toast.success(action === 'approve' ? 'Pembayaran berhasil diverifikasi!' : 'Pembayaran ditolak.');
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error(error.response?.data?.detail || 'Gagal memverifikasi pembayaran');
    } finally {
      setVerifying(false);
    }
  };

  // Get payment method label
  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: { label: 'Cash', icon: <Banknote className="w-4 h-4" /> },
      transfer: { label: 'Transfer Bank', icon: <CreditCard className="w-4 h-4" /> },
      qris: { label: 'QRIS', icon: <QrCode className="w-4 h-4" /> }
    };
    return labels[method] || { label: method, icon: null };
  };

  // Get API base URL for payment proof image
  const getPaymentProofUrl = () => {
    if (!transaction?.payment_proof_url) return null;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    return `${baseUrl}${transaction.payment_proof_url}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-[1000] bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex justify-between items-center rounded-t-2xl shadow-md">
          <div className="text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Detail Booking Limbah
            </h3>
            <p className="text-sm text-green-100 mt-1">{waste.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 transition-colors p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-6">
          {/* Status Badge */}
          <div className={`rounded-lg p-4 ${
            isDelivery ? 'bg-orange-50 border border-orange-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${
                isDelivery ? 'bg-orange-600' : 'bg-yellow-600'
              }`}>
                {transaction.status === 'pending'
                  ? (isDelivery ? 'MENUNGGU PENGIRIMAN' : 'MENUNGGU PICKUP')
                  : transaction.status === 'waiting_confirmation'
                  ? (isDelivery ? 'MENUNGGU KONFIRMASI PENGIRIMAN' : 'MENUNGGU KONFIRMASI')
                  : transaction.status === 'completed' ? 'SELESAI' : 'DIBATALKAN'}
              </span>
              <span className={`text-sm ${isDelivery ? 'text-orange-800' : 'text-yellow-800'}`}>
                Booking dibuat pada {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Recycler Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informasi Recycler
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Nama Perusahaan / Recycler:</label>
                <p className="font-semibold text-gray-900">{recycler.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email:</label>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  {recycler.email}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Kontak:</label>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  {recycler.contact}
                </p>
              </div>
            </div>
          </div>

          {/* Pickup/Delivery Details */}
          <div className={`rounded-lg p-5 ${
            isDelivery ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'
          }`}>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transaction.pickup_date && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    {isDelivery ? 'Tanggal Pengiriman:' : 'Tanggal Pickup:'}
                  </label>
                  <p className="font-semibold text-gray-900">
                    {new Date(transaction.pickup_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
              {transaction.pickup_time && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Waktu:</label>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${isDelivery ? 'text-orange-600' : 'text-green-600'}`} />
                    {transaction.pickup_time} WIB
                  </p>
                </div>
              )}
              {transaction.estimated_quantity && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Estimasi Jumlah:</label>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className={`w-4 h-4 ${isDelivery ? 'text-orange-600' : 'text-green-600'}`} />
                    {transaction.estimated_quantity} Kg
                  </p>
                </div>
              )}
              {transaction.transport_method && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Metode Transport:</label>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${isDelivery ? 'text-orange-600' : 'text-green-600'}`} />
                    {isDelivery ? 'Minta Diantar' : 'Pickup Sendiri'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Location Map & Shipping Cost - Only for Delivery */}
          {isDelivery && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-orange-600" />
                Lokasi Tujuan Pengiriman
              </h4>

              {/* Map showing delivery location */}
              {transaction.delivery_latitude && transaction.delivery_longitude ? (
                <div className="mb-4">
                  <MapViewer
                    latitude={transaction.delivery_latitude}
                    longitude={transaction.delivery_longitude}
                    title="Lokasi Pengiriman"
                    height="h-64"
                    showGoogleMapsLink={true}
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
                <div className="bg-white rounded-lg p-4 border border-orange-200">
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
                    * Estimasi berdasarkan jarak (Rp 5.000/Km, min. Rp 10.000). Biaya final dapat disesuaikan.
                  </p>
                </div>
              )}

              {/* Google Maps Route Button */}
              {getDeliveryRouteUrl() && (
                <a
                  href={getDeliveryRouteUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  Buka Rute Pengiriman di Google Maps
                </a>
              )}
            </div>
          )}

          {/* Contact Person */}
          {(transaction.contact_person || transaction.contact_phone) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                {isDelivery ? 'Kontak Penerima di Lokasi' : 'Penanggung Jawab Pickup'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.contact_person && (
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Nama:</label>
                    <p className="font-semibold text-gray-900">{transaction.contact_person}</p>
                  </div>
                )}
                {transaction.contact_phone && (
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Telepon:</label>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <a href={`tel:${transaction.contact_phone}`} className="text-purple-600 hover:underline">
                        {transaction.contact_phone}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery Address */}
          {transaction.transport_method === 'delivery' && transaction.pickup_address && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Alamat Pengiriman
              </h4>
              <p className="text-gray-900">{transaction.pickup_address}</p>
            </div>
          )}

          {/* Notes */}
          {transaction.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                Catatan dari Recycler
              </h4>
              <p className="text-gray-700 italic">"{transaction.notes}"</p>
            </div>
          )}

          {/* Payment Information - Only show if waste is not free */}
          {waste.price > 0 && (
            <div className={`rounded-lg p-5 ${
              transaction.payment_status === 'verified' ? 'bg-green-50 border border-green-200' :
              transaction.payment_status === 'pending_verification' ? 'bg-yellow-50 border border-yellow-200' :
              transaction.payment_status === 'rejected' ? 'bg-red-50 border border-red-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className={`w-5 h-5 ${
                  transaction.payment_status === 'verified' ? 'text-green-600' :
                  transaction.payment_status === 'pending_verification' ? 'text-yellow-600' :
                  transaction.payment_status === 'rejected' ? 'text-red-600' :
                  'text-gray-600'
                }`} />
                Informasi Pembayaran
              </h4>

              {/* Payment Status Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  transaction.payment_status === 'verified' ? 'bg-green-600 text-white' :
                  transaction.payment_status === 'pending_verification' ? 'bg-yellow-600 text-white' :
                  transaction.payment_status === 'rejected' ? 'bg-red-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {transaction.payment_status === 'verified' ? 'TERVERIFIKASI' :
                   transaction.payment_status === 'pending_verification' ? 'MENUNGGU VERIFIKASI' :
                   transaction.payment_status === 'rejected' ? 'DITOLAK' : 'BELUM BAYAR'}
                </span>
              </div>

              {/* Payment Details - Only show if payment has been submitted */}
              {transaction.payment_method && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Metode Pembayaran:</label>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        {getPaymentMethodLabel(transaction.payment_method).icon}
                        {getPaymentMethodLabel(transaction.payment_method).label}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Total Pembayaran:</label>
                      <p className="font-bold text-lg text-green-600">
                        Rp {(transaction.total_amount || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                    {transaction.waste_cost > 0 && (
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Biaya Limbah:</label>
                        <p className="font-semibold text-gray-900">
                          Rp {transaction.waste_cost.toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                    {transaction.shipping_cost > 0 && (
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Biaya Ongkir:</label>
                        <p className="font-semibold text-orange-600">
                          Rp {transaction.shipping_cost.toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Proof Image */}
                  {transaction.payment_proof_url && (
                    <div className="mt-4">
                      <label className="text-xs text-gray-600 block mb-2">Bukti Pembayaran:</label>
                      <div className="relative">
                        <img
                          src={getPaymentProofUrl()}
                          alt="Bukti Pembayaran"
                          className={`w-full rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity ${
                            showProofImage ? 'max-h-none' : 'max-h-48 object-cover'
                          }`}
                          onClick={() => setShowProofImage(!showProofImage)}
                        />
                        <button
                          onClick={() => setShowProofImage(!showProofImage)}
                          className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <Image className="w-3 h-3" />
                          {showProofImage ? 'Perkecil' : 'Perbesar'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Verification Buttons - Only show for pending_verification */}
                  {transaction.payment_status === 'pending_verification' && (
                    <div className="mt-4 pt-4 border-t border-yellow-200">
                      <p className="text-sm text-yellow-800 mb-3">
                        <strong>Verifikasi Pembayaran:</strong> Periksa bukti pembayaran di atas, lalu setujui atau tolak.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleVerifyPayment('approve')}
                          disabled={verifying}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          {verifying ? 'Memproses...' : 'Setujui Pembayaran'}
                        </Button>
                        <Button
                          onClick={() => handleVerifyPayment('reject')}
                          disabled={verifying}
                          variant="secondary"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 inline mr-2" />
                          Tolak
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* No payment yet */}
              {!transaction.payment_method && transaction.payment_status === 'unpaid' && (
                <p className="text-sm text-gray-600">
                  Recycler belum melakukan pembayaran. Pembayaran harus diselesaikan sebelum proses pengambilan/pengiriman.
                </p>
              )}
            </div>
          )}

          {/* Action Info & Buttons */}
          {transaction.status === 'waiting_confirmation' ? (
            <div className={`rounded-lg p-5 ${isDelivery ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-sm mb-4 ${isDelivery ? 'text-orange-800' : 'text-green-800'}`}>
                {isDelivery ? (
                  <>
                    <strong>🚚 Recycler telah mengklaim limbah sudah diantar!</strong><br/>
                    Silakan konfirmasi jika limbah benar sudah Anda kirim ke lokasi recycler.
                  </>
                ) : (
                  <>
                    <strong>✅ Recycler telah mengklaim sudah mengambil limbah!</strong><br/>
                    Silakan konfirmasi jika limbah benar sudah diserahkan ke recycler.
                  </>
                )}
              </p>
              <div className="flex gap-3">
                <Button onClick={handleConfirm} className="flex-1">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  {isDelivery ? 'Konfirmasi Sudah Diantar' : 'Konfirmasi Limbah Sudah Diserahkan'}
                </Button>
                <Button onClick={onClose} variant="secondary">
                  Tutup
                </Button>
              </div>
            </div>
          ) : transaction.status === 'completed' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <strong>Transaksi Selesai!</strong> {isDelivery ? 'Limbah sudah diantar dan terverifikasi.' : 'Limbah sudah diserahkan dan terverifikasi.'}
              </p>
            </div>
          ) : (
            <div className={`rounded-lg p-4 ${isDelivery ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-200'}`}>
              {isDelivery ? (
                <div className={`text-sm text-orange-800`}>
                  <strong>🚚 Langkah Selanjutnya untuk Pengiriman:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Lihat lokasi tujuan di peta di atas</li>
                    <li>Siapkan limbah sesuai jumlah yang diminta ({transaction.estimated_quantity} Kg)</li>
                    <li>Antar ke lokasi pada tanggal dan waktu yang telah ditentukan</li>
                    <li>Hubungi penerima di nomor: <strong>{transaction.contact_phone}</strong></li>
                    <li>Setelah diantar, recycler akan mengkonfirmasi penerimaan</li>
                  </ol>
                </div>
              ) : (
                <p className="text-sm text-blue-800">
                  <strong>💡 Langkah Selanjutnya:</strong> Recycler akan datang mengambil limbah pada tanggal dan waktu yang ditentukan. Pastikan limbah sudah disiapkan.
                </p>
              )}
            </div>
          )}

          {/* Close Button */}
          {transaction.status !== 'waiting_confirmation' && (
            <div className="flex justify-end pt-4">
              <Button onClick={onClose} className="px-8">
                Tutup
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;