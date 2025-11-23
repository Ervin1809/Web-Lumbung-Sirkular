import { useState, useMemo } from 'react';
import { X, Calendar, Clock, Package, Truck, MessageSquare, User, Phone, MapPin, CheckCircle, Navigation } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import MapViewer from '../map/MapViewer';
import MapPicker from '../map/MapPicker';
import toast from 'react-hot-toast';

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
    notes: '',
    deliveryLatitude: null,
    deliveryLongitude: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.transportMethod === 'delivery') {
      if (!formData.deliveryLatitude || !formData.deliveryLongitude) {
        const msg = "⚠️ Wajib memilih lokasi pengiriman di peta!\nSilakan klik titik di peta atau gunakan tombol 'Deteksi Lokasi Saya'.";
        if (typeof toast !== 'undefined') toast.error(msg);
        else alert(msg);
        return;
      }
      if (!formData.pickupAddress.trim()) {
        const msg = "⚠️ Detail alamat pengiriman wajib diisi.";
        if (typeof toast !== 'undefined') toast.error(msg);
        else alert(msg);
        return;
      }
    }

    setStep(2);
  };

  const handleConfirm = async () => {
    await onConfirm(waste.id, formData);
    setStep(3);
  };

  const getTotalValue = () => {
    const quantity = parseFloat(formData.estimatedQuantity) || 0;
    const pricePerKg = waste.price / waste.weight;
    return (quantity * pricePerKg).toFixed(2);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleDeliveryLocationChange = (lat, lng) => {
    setFormData({
      ...formData,
      deliveryLatitude: parseFloat(lat),
      deliveryLongitude: parseFloat(lng)
    });
  };

  const calculateDistance = useMemo(() => {
    if (!waste.latitude || !waste.longitude || !formData.deliveryLatitude || !formData.deliveryLongitude) {
      return null;
    }

    const R = 6371;
    const dLat = (formData.deliveryLatitude - waste.latitude) * Math.PI / 180;
    const dLon = (formData.deliveryLongitude - waste.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(waste.latitude * Math.PI / 180) * Math.cos(formData.deliveryLatitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [waste.latitude, waste.longitude, formData.deliveryLatitude, formData.deliveryLongitude]);

  const shippingCost = useMemo(() => {
    if (!calculateDistance) return null;
    const ratePerKm = 5000;
    const minimumCost = 10000;
    return Math.max(minimumCost, Math.round(calculateDistance * ratePerKm));
  }, [calculateDistance]);

  const getDeliveryGoogleMapsUrl = () => {
    if (!formData.deliveryLatitude || !formData.deliveryLongitude) return null;
    return `https://www.google.com/maps/dir/?api=1&origin=${waste.latitude},${waste.longitude}&destination=${formData.deliveryLatitude},${formData.deliveryLongitude}`;
  };

  const dateLabel = formData.transportMethod === 'delivery' ? 'Tanggal Pengantaran' : 'Tanggal Pengambilan';
  const timeLabel = formData.transportMethod === 'delivery' ? 'Waktu Pengantaran' : 'Waktu Pengambilan';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {step === 1 && 'Form Booking Limbah'}
              {step === 2 && 'Konfirmasi Booking'}
              {step === 3 && 'Berhasil!'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate max-w-[200px] sm:max-w-md">
              {waste?.title}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator - PERBAIKAN: Menampilkan 3 Step */}
        {step < 3 && (
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-center w-full">
              {[1, 2, 3].map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step >= s ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                    {/* Lingkaran Angka */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-colors duration-300 ${
                      step >= s 
                        ? 'bg-green-600 text-white border-green-600' 
                        : 'bg-white border-gray-300 text-gray-500'
                    }`}>
                      {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                    </div>
                    
                    {/* Label Step */}
                    <span className={`text-xs sm:text-sm hidden sm:block ${step === s ? 'text-green-700' : ''}`}>
                      {s === 1 ? 'Detail' : s === 2 ? 'Konfirmasi' : 'Selesai'}
                    </span>
                  </div>
                  
                  {/* GARIS PENGHUBUNG */}
                  {idx < 2 && (
                    <div className={`h-0.5 w-12 sm:w-32 mx-2 sm:mx-4 rounded transition-colors duration-300 ${
                      step > s ? 'bg-green-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 overflow-y-auto">
          
          {/* STEP 1: FORM */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* PERBAIKAN: Waste Info Card Sejajar ke Bawah */}
              {/* Waste Info Card - Tampilan Rapat */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 text-sm">
                    <div className="flex flex-col gap-1">
                      
                      <div className="flex items-center">
                        <span className="text-gray-500 text-xs w-24">Kategori</span>
                        <span className="text-gray-400 text-xs mr-2">:</span>
                        <span className="font-semibold text-gray-800">{waste.category}</span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-gray-500 text-xs w-24">Berat Tersedia</span>
                        <span className="text-gray-400 text-xs mr-2">:</span>
                        <span className="font-semibold text-gray-800">{waste.weight} Kg</span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-gray-500 text-xs w-24">Harga</span>
                        <span className="text-gray-400 text-xs mr-2">:</span>
                        <span className="font-semibold text-green-700">
                          {waste.price === 0 ? 'Gratis' : `Rp ${waste.price.toLocaleString('id-ID')}`}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Lokasi Pengambilan (Producer)
                </label>
                <MapViewer
                  latitude={waste.latitude}
                  longitude={waste.longitude}
                  title={waste.title}
                  height="h-48"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {dateLabel}
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {timeLabel}
                  </label>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, transportMethod: 'pickup' })}
                    className={`p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      formData.transportMethod === 'pickup'
                        ? 'border-green-600 bg-green-50 ring-1 ring-green-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className={`w-5 h-5 ${formData.transportMethod === 'pickup' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-semibold text-sm">Pickup Sendiri</div>
                      <div className="text-xs text-gray-500">Ambil di lokasi</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, transportMethod: 'delivery' })}
                    className={`p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      formData.transportMethod === 'delivery'
                        ? 'border-green-600 bg-green-50 ring-1 ring-green-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Truck className={`w-5 h-5 ${formData.transportMethod === 'delivery' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-semibold text-sm">Minta Diantar</div>
                      <div className="text-xs text-gray-500">Kirim ke lokasi saya</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="0812..."
                  value={formData.contactPhone}
                  onChange={handleChange}
                  icon={Phone}
                  required
                />
              </div>

              {/* Delivery Location */}
              {formData.transportMethod === 'delivery' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="block text-sm font-bold text-blue-800 mb-2">
                      <Navigation className="w-4 h-4 inline mr-2" />
                      Pilih Lokasi Pengiriman (Wajib)
                    </label>
                    <p className="text-xs text-blue-600 mb-3">
                      Klik pada peta atau gunakan tombol "Deteksi Lokasi" agar Producer tahu kemana harus mengirim.
                    </p>
                    
                    <MapPicker
                      latitude={formData.deliveryLatitude}
                      longitude={formData.deliveryLongitude}
                      onLocationChange={handleDeliveryLocationChange}
                    />
                  </div>

                  {calculateDistance && shippingCost && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-orange-800 font-medium flex items-center gap-1">
                          <Truck className="w-4 h-4" /> Estimasi Ongkir:
                        </span>
                        <span className="font-bold text-orange-700">Rp {shippingCost.toLocaleString('id-ID')}</span>
                      </div>
                      <p className="text-xs text-orange-600">
                        Jarak: {calculateDistance.toFixed(1)} Km.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Detail Alamat Pengiriman
                    </label>
                    <textarea
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      placeholder="Jalan, Nomor Rumah, Patokan..."
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Catatan (Opsional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Pesan tambahan..."
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Lanjutkan
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: CONFIRMATION */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Mohon periksa kembali detail booking Anda sebelum mengkonfirmasi.</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm">Ringkasan Booking:</h4>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Limbah</span><span className="font-semibold text-gray-900">{waste.title}</span></div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{formData.transportMethod === 'delivery' ? 'Waktu Antar' : 'Waktu Ambil'}</span>
                    <span className="font-semibold text-gray-900 text-right">{new Date(formData.pickupDate).toLocaleDateString('id-ID')} - {formData.pickupTime}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-gray-500">Jumlah</span><span className="font-semibold text-gray-900">{formData.estimatedQuantity} Kg</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Metode</span><span className="font-semibold text-gray-900 capitalize">{formData.transportMethod === 'pickup' ? 'Pickup Sendiri' : 'Diantar'}</span></div>
                  
                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-2">
                    <span className="text-gray-500">Kontak</span>
                    <span className="font-semibold text-gray-900 text-right">{formData.contactPerson} ({formData.contactPhone})</span>
                  </div>

                  {formData.transportMethod === 'delivery' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Alamat</span>
                        <span className="font-semibold text-gray-900 text-right max-w-[60%] truncate">{formData.pickupAddress}</span>
                      </div>
                      
                      {calculateDistance && shippingCost && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Jarak</span>
                          <span className="font-semibold text-gray-900">{calculateDistance.toFixed(2)} Km</span>
                        </div>
                      )}

                      {getDeliveryGoogleMapsUrl() && (
                        <div className="pt-1 flex justify-end">
                          <a href={getDeliveryGoogleMapsUrl()} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">
                            <Navigation className="w-3 h-3" /> Lihat Rute
                          </a>
                        </div>
                      )}
                    </>
                  )}

                  {formData.notes && (
                    <div className="pt-2 border-t border-dashed border-gray-200">
                      <span className="text-gray-500 block mb-1 text-xs">Catatan:</span>
                      <p className="text-gray-800 italic text-xs">{formData.notes}</p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-300 pt-3 mt-2">
                    {waste.price > 0 && (
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Harga Limbah</span>
                        <span>Rp {parseFloat(getTotalValue()).toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    {formData.transportMethod === 'delivery' && shippingCost && (
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Ongkir</span>
                        <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-green-700 mt-2 pt-2 border-t border-dashed border-gray-300">
                      <span>Total Estimasi</span>
                      <span>
                        Rp {(
                          (waste.price > 0 ? parseFloat(getTotalValue()) : 0) +
                          (formData.transportMethod === 'delivery' && shippingCost ? shippingCost : 0)
                        ).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  Kembali
                </Button>
                <Button type="button" onClick={handleConfirm} className="flex-1">
                  Konfirmasi Booking
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Berhasil!</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Producer akan segera menghubungi Anda untuk koordinasi selanjutnya.
              </p>
              <Button onClick={onClose} className="px-8 w-full sm:w-auto">
                Tutup & Lihat Status
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;