import React from 'react';
import { X, Calendar, Clock, Package, Truck, User, Phone, MapPin, MessageSquare, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const BookingDetailModal = ({ waste, bookingInfo, onClose }) => {
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

  const { transaction, recycler } = bookingInfo;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex justify-between items-center rounded-t-2xl">
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
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-600 text-white text-sm font-semibold rounded-full">
                {transaction.status === 'pending' ? 'MENUNGGU PICKUP' :
                 transaction.status === 'completed' ? 'SELESAI' : 'DIBATALKAN'}
              </span>
              <span className="text-sm text-yellow-800">
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

          {/* Pickup Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Detail Pengambilan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transaction.pickup_date && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Tanggal Pickup:</label>
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
                    <Clock className="w-4 h-4 text-green-600" />
                    {transaction.pickup_time} WIB
                  </p>
                </div>
              )}
              {transaction.estimated_quantity && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Estimasi Jumlah:</label>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-600" />
                    {transaction.estimated_quantity} Kg
                  </p>
                </div>
              )}
              {transaction.transport_method && (
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Metode Transport:</label>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    {transaction.transport_method === 'pickup' ? 'Pickup Sendiri' : 'Minta Diantar'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Person */}
          {(transaction.contact_person || transaction.contact_phone) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Penanggung Jawab Pickup
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

          {/* Action Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Langkah Selanjutnya:</strong> Hubungi recycler di nomor yang tertera untuk koordinasi lebih lanjut tentang pengambilan limbah.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="px-8">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
