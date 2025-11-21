import React, { useState } from 'react';
import { X, Calendar, Clock, Package, Truck, MessageSquare, User, Phone, MapPin, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

const BookingModal = ({ waste, onClose, onConfirm }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Confirmation, 3: Success
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    estimatedQuantity: waste?.weight || '',
    transportMethod: 'pickup',
    contactPerson: '',
    contactPhone: '',
    pickupAddress: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Go to confirmation step
  };

  const handleConfirm = async () => {
    await onConfirm(waste.id, formData);
    setStep(3); // Go to success step
  };

  const getTotalValue = () => {
    const quantity = parseFloat(formData.estimatedQuantity) || 0;
    const pricePerKg = waste.price / waste.weight;
    return (quantity * pricePerKg).toFixed(2);
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {step === 1 && 'Detail Pengambilan Limbah'}
              {step === 2 && 'Konfirmasi Booking'}
              {step === 3 && 'Booking Berhasil!'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{waste?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-xs mt-1 text-gray-600">Detail</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-xs mt-1 text-gray-600">Konfirmasi</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-xs mt-1 text-gray-600">Selesai</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Waste Info Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Tanggal Pengambilan
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Waktu Pengambilan
                  </label>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Estimated Quantity */}
              <Input
                label="Estimasi Jumlah yang Diambil (Kg)"
                type="number"
                name="estimatedQuantity"
                placeholder={`Max: ${waste.weight} Kg`}
                value={formData.estimatedQuantity}
                onChange={handleChange}
                step="0.1"
                min="0.1"
                max={waste.weight}
                icon={Package}
                required
              />

              {/* Transport Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Truck className="w-4 h-4 inline mr-2" />
                  Metode Pengambilan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, transportMethod: 'pickup' })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.transportMethod === 'pickup'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Pickup Sendiri</div>
                    <div className="text-xs text-gray-600 mt-1">Ambil langsung di lokasi</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, transportMethod: 'delivery' })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.transportMethod === 'delivery'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Minta Diantar</div>
                    <div className="text-xs text-gray-600 mt-1">Jika memungkinkan</div>
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nama Penanggung Jawab"
                  type="text"
                  name="contactPerson"
                  placeholder="Nama lengkap"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  icon={User}
                  required
                />
                <Input
                  label="Nomor Telepon"
                  type="tel"
                  name="contactPhone"
                  placeholder="08123456789"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  icon={Phone}
                  required
                />
              </div>

              {/* Pickup Address (if delivery) */}
              {formData.transportMethod === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Alamat Pengiriman
                  </label>
                  <textarea
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    placeholder="Alamat lengkap untuk pengiriman..."
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Catatan untuk Producer (Opsional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tambahkan catatan khusus atau permintaan..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Lanjutkan
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Penting:</strong> Pastikan semua informasi sudah benar. Setelah konfirmasi,
                  producer akan menerima detail booking Anda.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Ringkasan Booking:</h4>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Limbah:</span>
                    <span className="font-semibold">{waste.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tanggal & Waktu:</span>
                    <span className="font-semibold">
                      {new Date(formData.pickupDate).toLocaleDateString('id-ID')} - {formData.pickupTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jumlah:</span>
                    <span className="font-semibold">{formData.estimatedQuantity} Kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Metode:</span>
                    <span className="font-semibold">
                      {formData.transportMethod === 'pickup' ? 'Pickup Sendiri' : 'Minta Diantar'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kontak:</span>
                    <span className="font-semibold">
                      {formData.contactPerson} ({formData.contactPhone})
                    </span>
                  </div>
                  {formData.transportMethod === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Alamat:</span>
                      <span className="font-semibold text-right max-w-xs">{formData.pickupAddress}</span>
                    </div>
                  )}
                  {formData.notes && (
                    <div className="pt-2 border-t">
                      <span className="text-gray-600 text-sm block mb-1">Catatan:</span>
                      <p className="text-sm">{formData.notes}</p>
                    </div>
                  )}
                  {waste.price > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Estimasi Total:</span>
                        <span className="font-bold text-green-600 text-lg">
                          Rp {getTotalValue().toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1"
                >
                  Konfirmasi Booking
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Berhasil!
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Booking Anda telah dikonfirmasi. Producer akan menghubungi Anda segera
                untuk koordinasi lebih lanjut.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Langkah Selanjutnya:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
                  <li>Tunggu konfirmasi dari producer</li>
                  <li>Siapkan transportasi untuk tanggal yang telah dipilih</li>
                  <li>Hubungi producer jika ada perubahan</li>
                </ul>
              </div>

              <Button
                onClick={onClose}
                className="px-8"
              >
                Tutup
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
