import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { uploadAPI } from '../../services/api';

const ImageUpload = ({ value, onChange, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const validateFile = (file) => {
    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan: JPG, PNG, GIF, atau WEBP');
      return false;
    }

    // Validasi ukuran (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Ukuran file terlalu besar. Maksimal 5MB');
      return false;
    }

    setError('');
    return true;
  };

  const handleFileUpload = async (file) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setError('');

    try {
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = API_BASE_URL + response.data.url;

      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || 'Gagal mengupload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!uploading && !preview) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Upload Area */}
        {!preview && (
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8
              transition-all cursor-pointer
              ${isDragging
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }
              ${uploading ? 'pointer-events-none opacity-60' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center text-center">
              {uploading ? (
                <>
                  <Loader className="w-12 h-12 text-green-600 animate-spin mb-3" />
                  <p className="text-sm text-gray-600">Mengupload gambar...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Klik untuk upload atau seret gambar ke sini
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, GIF, atau WEBP (Max. 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Preview Area */}
        {preview && !uploading && (
          <div className="relative group">
            <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* File info */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                <span>Gambar berhasil diupload</span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Hapus
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!preview && !error && (
        <p className="text-xs text-gray-500">
          Gambar akan ditampilkan di marketplace untuk menarik perhatian recycler
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
