import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { wasteAPI, transactionAPI } from '../services/api';
import { Plus, Package, AlertCircle, CheckCircle, X, Edit, Trash2, Eye, Info, Filter } from 'lucide-react';
import WasteCard from '../components/waste/WasteCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ImageUpload from '../components/common/ImageUpload';
import MapPicker from '../components/map/MapPicker';
import BookingDetailModal from '../components/waste/BookingDetailModal';
import toast, { Toaster } from 'react-hot-toast';

const MyWastes = () => {
  const [wastes, setWastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWaste, setEditingWaste] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedWasteForBooking, setSelectedWasteForBooking] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'available', 'completed'
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Minyak',
    weight: '',
    price: '0',
    description: '',
    image_url: '',
    latitude: '',
    longitude: ''
  });

  const { user } = useAuth();
  const categories = ['Minyak', 'Plastik', 'Organik', 'Kertas', 'Logam'];

  // 💰 Harga per Kg untuk setiap kategori (dalam Rupiah)
  const pricePerKg = {
    'Minyak': 0,      // Minyak jelantah gratis
    'Plastik': 2000,  // Rp 2.000/Kg
    'Organik': 0,     // Kompos gratis
    'Kertas': 1500,   // Rp 1.500/Kg
    'Logam': 8000     // Rp 8.000/Kg (besi/aluminium)
  };

  // 🔥 Auto-calculate price when category or weight changes
  useEffect(() => {
    if (formData.category && formData.weight && parseFloat(formData.weight) > 0) {
      const weight = parseFloat(formData.weight);
      const basePrice = pricePerKg[formData.category] || 0;
      const calculatedPrice = Math.round(basePrice * weight);
      setFormData(prev => ({ ...prev, price: calculatedPrice.toString() }));
    }
  }, [formData.category, formData.weight]);

  useEffect(() => {
    if (user?.role === 'producer') {
      fetchMyWastes();
    }
  }, [user]);

  const fetchMyWastes = async () => {
    try {
      setLoading(true);
      const response = await wasteAPI.getMyWastes();
      // Sort by created_at descending (terbaru di atas)
      const sortedWastes = response.data.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );
      setWastes(sortedWastes);
    } catch (error) {
      console.error('Error fetching wastes:', error);
      toast.error('Gagal memuat data limbah');
    } finally {
      setLoading(false);
    }
  };

  // Filter wastes berdasarkan status
  const filteredWastes = wastes.filter(waste => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'available') return waste.status === 'available';
    if (filterStatus === 'completed') return waste.status === 'completed';
    return true;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Minyak',
      weight: '',
      price: '0',
      description: '',
      image_url: '',
      latitude: '',
      longitude: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(formData.weight) <= 0) {
      toast.error('Berat harus lebih dari 0');
      return;
    }

    try {
      await wasteAPI.create({
        ...formData,
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      });

      toast.success('Berhasil menambahkan limbah!');
      resetForm();
      setShowModal(false);
      fetchMyWastes();
    } catch (error) {
      console.error('Error creating waste:', error);
      toast.error(error.response?.data?.detail || 'Gagal menambahkan limbah');
    }
  };

  // 🔥 OPEN EDIT MODAL
  const handleEdit = (waste) => {
    console.log('Editing waste with coordinates:', { lat: waste.latitude, lng: waste.longitude });
    setEditingWaste(waste);
    setFormData({
      title: waste.title,
      category: waste.category,
      weight: waste.weight.toString(),
      price: waste.price.toString(),
      description: waste.description || '',
      image_url: waste.image_url || '',
      latitude: waste.latitude ? waste.latitude.toString() : '',
      longitude: waste.longitude ? waste.longitude.toString() : ''
    });
    setShowEditModal(true);
  };

  // 🔥 UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (parseFloat(formData.weight) <= 0) {
      toast.error('Berat harus lebih dari 0');
      return;
    }

    try {
      const updateData = {
        title: formData.title,
        category: formData.category,
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: formData.image_url,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      console.log('Sending update with coordinates:', updateData);
      await wasteAPI.update(editingWaste.id, updateData);

      toast.success('Berhasil mengupdate limbah!');
      resetForm();
      setShowEditModal(false);
      setEditingWaste(null);
      fetchMyWastes();
    } catch (error) {
      console.error('Error updating waste:', error);
      toast.error(error.response?.data?.detail || 'Gagal mengupdate limbah');
    }
  };

  // 🔥 DELETE
  const handleDelete = async (wasteId, wasteTitle, wasteStatus) => {
    // Validasi status
    if (wasteStatus === 'booked') {
      toast.error('Limbah yang sudah di-booking tidak bisa dihapus');
      return;
    }
    if (wasteStatus === 'completed') {
      toast.error('Limbah yang sudah selesai tidak bisa dihapus');
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus limbah "${wasteTitle}"?\nTindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) return;

    try {
      await wasteAPI.delete(wasteId);
      toast.success('Limbah berhasil dihapus');
      fetchMyWastes();
    } catch (error) {
      console.error('Error deleting waste:', error);
      toast.error(error.response?.data?.detail || 'Gagal menghapus limbah');
    }
  };

  // 🔥 VIEW BOOKING DETAILS
  const handleViewBooking = async (waste) => {
    try {
      const response = await transactionAPI.getByWasteId(waste.id);
      setSelectedWasteForBooking(waste);
      setBookingInfo(response.data);
      setShowBookingModal(true);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Gagal memuat detail booking');
    }
  };

  // 🔥 CONFIRM HANDOVER (Producer confirms waste has been picked up)
  const handleConfirmHandover = async (transactionId) => {
    try {
      await transactionAPI.confirmHandover(transactionId);
      toast.success('Berhasil! Transaksi selesai dan masuk ke dashboard progress Anda.');
      setShowBookingModal(false);
      fetchMyWastes(); // Refresh data
    } catch (error) {
      console.error('Error confirming:', error);
      toast.error(error.response?.data?.detail || 'Gagal mengkonfirmasi serah terima');
    }
  };

  // Check if user is producer
  if (user?.role !== 'producer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Akses Ditolak
          </h3>
          <p className="text-gray-600">
            Halaman ini hanya untuk Producer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Limbah Saya
            </h1>
            <p className="text-gray-600">
              Kelola limbah yang Anda upload
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Limbah
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                filterStatus === 'all'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4" />
              Semua ({wastes.length})
            </button>
            <button
              onClick={() => setFilterStatus('available')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                filterStatus === 'available'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Tersedia ({wastes.filter(w => w.status === 'available').length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                filterStatus === 'completed'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              Selesai ({wastes.filter(w => w.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Wastes List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : wastes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Limbah
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai tambahkan limbah yang ingin Anda kelola
            </p>
            <Button onClick={() => setShowModal(true)}>
              Tambah Limbah Pertama
            </Button>
          </div>
        ) : filteredWastes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak Ada Hasil
            </h3>
            <p className="text-gray-600">
              Tidak ada limbah dengan filter yang dipilih
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Menampilkan {filteredWastes.length} dari {wastes.length} limbah
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWastes.map(waste => (
                <div key={waste.id} className="relative">
                  {/* Waste Card */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <WasteCard
                      waste={waste}
                      userRole="producer"
                      showActions={false}
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      waste.status === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : waste.status === 'booked'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {waste.status === 'available' ? 'Tersedia' : 
                       waste.status === 'booked' ? 'Dipesan' : 'Selesai'}
                    </span>
                  </div>

                  {/* 🔥 ACTION BUTTONS - Icon Style */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {/* Edit Button (hanya jika available) */}
                    {waste.status === 'available' && (
                      <button
                        onClick={() => handleEdit(waste)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-all hover:scale-110"
                        title="Edit Limbah"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Button (hanya jika available) */}
                    {waste.status === 'available' && (
                      <button
                        onClick={() => handleDelete(waste.id, waste.title, waste.status)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg transition-all hover:scale-110"
                        title="Hapus Limbah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* View Booking Button (jika booked atau completed) */}
                    {(waste.status === 'booked' || waste.status === 'completed') && (
                      <button
                        onClick={() => handleViewBooking(waste)}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg shadow-lg transition-all hover:scale-110"
                        title="Lihat Detail Booking"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showModal && (
          <WasteFormModal
            title="Tambah Limbah Baru"
            formData={formData}
            categories={categories}
            pricePerKg={pricePerKg}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onImageChange={(url) => setFormData({ ...formData, image_url: url })}
            onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
            onClose={() => {
              setShowModal(false);
              resetForm();
            }}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <WasteFormModal
            title="Edit Limbah"
            formData={formData}
            categories={categories}
            pricePerKg={pricePerKg}
            onSubmit={handleUpdate}
            onChange={handleChange}
            onImageChange={(url) => setFormData({ ...formData, image_url: url })}
            onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
            onClose={() => {
              setShowEditModal(false);
              setEditingWaste(null);
              resetForm();
            }}
            isEdit={true}
          />
        )}

        {/* Booking Detail Modal */}
        {showBookingModal && (
          <BookingDetailModal
            waste={selectedWasteForBooking}
            bookingInfo={bookingInfo}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedWasteForBooking(null);
              setBookingInfo(null);
            }}
            onConfirmHandover={handleConfirmHandover}
          />
        )}
      </div>
    </div>
  );
};

// Reusable Form Modal Component
const WasteFormModal = ({ title, formData, categories, pricePerKg, onSubmit, onChange, onImageChange, onLocationChange, onClose, isEdit = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <Input
            label="Judul Limbah"
            type="text"
            name="title"
            placeholder="Contoh: Minyak Jelantah 20 Liter"
            value={formData.title}
            onChange={onChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            label="Berat (Kg)"
            type="number"
            name="weight"
            placeholder="10.5"
            step="0.1"
            min="0"
            value={formData.weight}
            onChange={onChange}
            required
          />

          {/* Harga otomatis berdasarkan kategori dan berat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💰 Harga Estimasi (Otomatis)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.price === '0' || formData.price === '' ? 'Gratis' : `Rp ${parseInt(formData.price).toLocaleString('id-ID')}`}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Harga dihitung otomatis: {formData.category} @ Rp {(pricePerKg[formData.category] || 0).toLocaleString('id-ID')}/Kg
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              placeholder="Jelaskan kondisi limbah..."
              value={formData.description}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* 🔥 FITUR BARU: Map Picker untuk Koordinat */}
          <MapPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationChange={onLocationChange}
          />

          <ImageUpload
            label="Gambar Limbah (Opsional)"
            value={formData.image_url}
            onChange={onImageChange}
          />

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
              {isEdit ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyWastes;