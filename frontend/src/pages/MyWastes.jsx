import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { wasteAPI } from '../services/api';
import { Plus, Package, AlertCircle, CheckCircle, X } from 'lucide-react';
import WasteCard from '../components/waste/WasteCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ImageUpload from '../components/common/ImageUpload';

const MyWastes = () => {
  const [wastes, setWastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    category: 'Minyak',
    weight: '',
    price: '0',
    description: '',
    image_url: ''
  });

  const { user } = useAuth();
  const categories = ['Minyak', 'Plastik', 'Organik', 'Kertas', 'Logam'];

  useEffect(() => {
    if (user?.role === 'producer') {
      fetchMyWastes();
    }
  }, [user]);

  const fetchMyWastes = async () => {
    try {
      setLoading(true);
      const response = await wasteAPI.getMyWastes();
      setWastes(response.data);
    } catch (error) {
      console.error('Error fetching wastes:', error);
      setMessage({
        type: 'error',
        text: 'Gagal memuat data limbah'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (parseFloat(formData.weight) <= 0) {
      setMessage({ type: 'error', text: 'Berat harus lebih dari 0' });
      return;
    }

    try {
      await wasteAPI.create({
        ...formData,
        weight: parseFloat(formData.weight),
        price: parseFloat(formData.price)
      });

      setMessage({
        type: 'success',
        text: 'Berhasil menambahkan limbah!'
      });

      // Reset form
      setFormData({
        title: '',
        category: 'Minyak',
        weight: '',
        price: '0',
        description: '',
        image_url: ''
      });

      setShowModal(false);
      fetchMyWastes();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error creating waste:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Gagal menambahkan limbah'
      });
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
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              Total: {wastes.length} limbah
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wastes.map(waste => (
                <div key={waste.id} className="relative">
                  <WasteCard
                    waste={waste}
                    userRole="producer"
                    showActions={false}
                  />
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Tambah Limbah Baru
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Judul Limbah"
                  type="text"
                  name="title"
                  placeholder="Contoh: Minyak Jelantah 20 Liter"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
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
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Harga (Rp) - Opsional, kosongkan jika gratis"
                  type="number"
                  name="price"
                  placeholder="50000"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    placeholder="Jelaskan kondisi limbah..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <ImageUpload
                  label="Gambar Limbah (Opsional)"
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Simpan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWastes;