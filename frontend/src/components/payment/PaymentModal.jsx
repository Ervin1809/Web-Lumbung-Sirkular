import { useState, useMemo, useEffect } from 'react';
import { X, CreditCard, Banknote, QrCode, Upload, CheckCircle, AlertCircle, Truck, Package, Image, Copy, Loader } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../common/Button';
import { uploadAPI, transactionAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PaymentModal = ({ booking, waste, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [producerBank, setProducerBank] = useState(null);
  const [loadingBank, setLoadingBank] = useState(false);

  // Fetch bank details when transfer method is selected or modal opens
  useEffect(() => {
    const fetchBankDetails = async () => {
      setLoadingBank(true);
      try {
        const response = await transactionAPI.getPaymentDetails(booking.id);
        setProducerBank(response.data);
      } catch (error) {
        console.error('Failed to fetch payment details:', error);
      } finally {
        setLoadingBank(false);
      }
    };
    fetchBankDetails();
  }, [booking.id]);

  // Calculate costs
  const isDelivery = booking.transport_method === 'delivery';

  const calculateDistance = useMemo(() => {
    if (!waste?.latitude || !waste?.longitude || !booking?.delivery_latitude || !booking?.delivery_longitude) {
      return null;
    }
    const R = 6371;
    const dLat = (booking.delivery_latitude - waste.latitude) * Math.PI / 180;
    const dLon = (booking.delivery_longitude - waste.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(waste.latitude * Math.PI / 180) * Math.cos(booking.delivery_latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [waste, booking]);

  const shippingCost = useMemo(() => {
    if (!isDelivery || !calculateDistance) return 0;
    const ratePerKm = 5000;
    const minimumCost = 10000;
    return Math.max(minimumCost, Math.round(calculateDistance * ratePerKm));
  }, [calculateDistance, isDelivery]);

  const wasteCost = useMemo(() => {
    if (!waste || waste.price === 0) return 0;
    const pricePerKg = waste.price / waste.weight;
    return Math.round(pricePerKg * (booking.estimated_quantity || waste.weight));
  }, [waste, booking]);

  const totalAmount = wasteCost + shippingCost;

  // Generate QRIS String (Simulated standard format)
  const qrisData = `00020101021126570011ID.CO.QRIS.WWW011893600520000000000005204581253033605802ID5916Lumbung Sirkular6008Makassar61059024562070703A016304${totalAmount}`;

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash (Tunai)',
      icon: <Banknote className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Bayar tunai saat pengambilan/pengiriman',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'transfer',
      name: 'Transfer Bank',
      icon: <CreditCard className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Transfer ke rekening producer',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: <QrCode className="w-6 h-6 sm:w-8 sm:h-8" />,
      description: 'Scan QR untuk pembayaran digital',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setPaymentProof(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Disalin ke clipboard!');
  };

  const handleSubmitPayment = async () => {
    if (!paymentProof) {
      toast.error('Silakan upload bukti pembayaran');
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);
      const uploadResponse = await uploadAPI.uploadImage(paymentProof);
      const imageUrl = uploadResponse.data.url;
      setUploading(false);

      await transactionAPI.submitPayment(booking.id, {
        payment_method: paymentMethod,
        payment_proof_url: imageUrl,
        waste_cost: wasteCost,
        shipping_cost: shippingCost,
        total_amount: totalAmount
      });

      setStep(3);
      toast.success('Bukti pembayaran berhasil dikirim!');

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error(error.response?.data?.detail || 'Gagal mengirim bukti pembayaran');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center rounded-t-2xl sm:rounded-t-3xl">
          <div className="text-white">
            <h3 className="text-lg sm:text-xl font-bold">
              {step === 1 && 'Pilih Metode Pembayaran'}
              {step === 2 && 'Upload Bukti Pembayaran'}
              {step === 3 && 'Pembayaran Terkirim!'}
            </h3>
            <p className="text-xs sm:text-sm opacity-90 mt-0.5">{waste?.title}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Progress Steps */}
  
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-center w-full max-w-md mx-auto">
            {[1, 2, 3].map((s, idx) => (
              <div key={s} className={`flex items-center ${idx < 2 ? 'flex-1' : ''}`}>
                {/* Lingkaran Angka */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold transition-all ${
                  step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                
                {/* Garis Penghubung (Dibuat flex-1 agar memanjang otomatis) */}
                {idx < 2 && (
                  <div className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                    step > s ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          
          {/* Cost Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-5 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              Rincian Biaya
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Limbah ({booking.estimated_quantity} Kg)</span>
                <span className="font-medium">Rp {wasteCost.toLocaleString('id-ID')}</span>
              </div>
              {isDelivery && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Ongkir ({calculateDistance?.toFixed(1)} Km)</span>
                  <span className="font-medium text-orange-600">Rp {shippingCost.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="border-t border-dashed pt-2 mt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total Pembayaran</span>
                <span className="font-bold text-lg text-green-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Step 1: Select Payment Method */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Pilih metode pembayaran yang Anda inginkan:</p>
              <div className="grid gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === method.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${method.color} text-white shadow-lg`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 text-sm sm:text-base">{method.name}</h5>
                        <p className="text-xs sm:text-sm text-gray-500">{method.description}</p>
                      </div>
                      {paymentMethod === method.id && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={onClose} className="flex-1">Batal</Button>
                <Button onClick={() => setStep(2)} disabled={!paymentMethod} className="flex-1">Lanjutkan</Button>
              </div>
            </div>
          )}

          {/* Step 2: Info & Upload Proof */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* PAYMENT INSTRUCTION AREA */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                
                {/* 1. TRANSFER BANK */}
                {paymentMethod === 'transfer' && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-blue-800">Informasi Transfer</h4>
                    </div>
                    {loadingBank ? (
                      <div className="flex items-center justify-center py-4"><Loader className="animate-spin w-6 h-6 text-blue-600"/></div>
                    ) : producerBank && producerBank.bank_name ? (
                      <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Bank Tujuan</p>
                          <p className="font-bold text-gray-900">{producerBank.bank_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nomor Rekening</p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-lg text-gray-900 tracking-wide">{producerBank.bank_account}</p>
                            <button onClick={() => copyToClipboard(producerBank.bank_account)} className="text-blue-600 hover:text-blue-800"><Copy className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Atas Nama</p>
                          <p className="font-semibold text-gray-900">{producerBank.account_holder}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">Informasi bank producer tidak tersedia. Silakan hubungi via chat.</p>
                    )}
                  </>
                )}

                {/* 2. QRIS */}
                {paymentMethod === 'qris' && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <QrCode className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-purple-800">Scan QRIS</h4>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-100 flex flex-col items-center text-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm border mb-3">
                        <QRCodeSVG value={qrisData} size={180} level="H" includeMargin={true} />
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Scan QR Code di atas atau screenshot layar ini.</p>
                      <p className="font-bold text-purple-700 text-lg">Rp {totalAmount.toLocaleString('id-ID')}</p>
                      <p className="text-[10px] text-gray-400 mt-1">NMID: ID123456789 • Lumbung Sirkular</p>
                    </div>
                  </>
                )}

                {/* 3. CASH */}
                {paymentMethod === 'cash' && (
                  <div className="flex items-start gap-2">
                    <Banknote className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">
                      Silakan lakukan pembayaran tunai kepada producer saat serah terima barang. Foto nota/kwitansi atau uang tunai sebagai bukti.
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Area */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Upload Bukti Pembayaran</label>
                {!paymentProofPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="p-2 bg-green-100 rounded-full mb-2"><Upload className="w-5 h-5 text-green-600" /></div>
                      <p className="text-sm text-gray-600 font-medium">Klik untuk upload bukti</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (Max. 5MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative">
                    <img src={paymentProofPreview} alt="Payment Proof" className="w-full h-40 object-contain bg-gray-100 rounded-xl border border-gray-200" />
                    <button onClick={() => { setPaymentProof(null); setPaymentProofPreview(null); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"><X className="w-4 h-4" /></button>
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><Image className="w-3 h-3" /> Gambar siap</div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Kembali</Button>
                <Button onClick={handleSubmitPayment} disabled={!paymentProof || submitting} className="flex-1">
                  {uploading ? 'Mengupload...' : submitting ? 'Mengirim...' : 'Kirim Bukti'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Bukti Pembayaran Terkirim!</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-sm mx-auto">
                Producer akan memverifikasi pembayaran Anda. Anda akan mendapatkan konfirmasi setelah disetujui.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left mb-6">
                <p className="text-sm text-yellow-800"><strong>Langkah Selanjutnya:</strong></p>
                <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
                  <li>Tunggu verifikasi dari producer</li>
                  <li>Setelah disetujui, proses pengambilan/pengiriman bisa dilanjutkan</li>
                </ul>
              </div>
              <Button onClick={onClose} className="px-8">Tutup</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;