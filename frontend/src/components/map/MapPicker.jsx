import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Locate, Info } from 'lucide-react';
import Button from '../common/Button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapPicker = ({ latitude, longitude, onLocationChange }) => {
  // Default center to Indonesia (Kendari, Southeast Sulawesi - sesuai dengan project)
  const defaultCenter = [-5.132780, 119.488109];

  const [position, setPosition] = useState(
    latitude && longitude
      ? [parseFloat(latitude), parseFloat(longitude)]
      : defaultCenter
  );
  const [locating, setLocating] = useState(false);
  const markerRef = useRef(null);

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([parseFloat(latitude), parseFloat(longitude)]);
    }
  }, [latitude, longitude]);

  // Handle location select from click or drag
  const handleLocationSelect = (lat, lng) => {
    const newPos = [lat, lng];
    setPosition(newPos);
    onLocationChange(lat.toFixed(6), lng.toFixed(6));
  };

  // Auto-detect user location
  const handleAutoDetect = () => {
    setLocating(true);

    if (!navigator.geolocation) {
      alert('❌ Geolocation tidak didukung oleh browser Anda.\n\nSilakan gunakan browser modern seperti Chrome, Firefox, atau Safari.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationSelect(latitude, longitude);
        setLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);

        let errorMessage = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '❌ Akses lokasi ditolak.\n\nSilakan:\n1. Klik ikon kunci/info di address bar\n2. Izinkan akses lokasi untuk website ini\n3. Refresh halaman dan coba lagi\n\nAtau klik langsung di peta untuk memilih lokasi.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '⚠️ Lokasi tidak tersedia.\n\nKemungkinan penyebab:\n• GPS/Location service tidak aktif di perangkat Anda\n• Tidak ada sinyal GPS (coba di luar ruangan)\n• Browser tidak bisa mengakses layanan lokasi\n\n💡 Solusi: Klik di peta untuk memilih lokasi secara manual.';
            break;
          case error.TIMEOUT:
            errorMessage = '⏱️ Waktu habis saat mencoba mendapatkan lokasi.\n\nCoba lagi atau klik di peta untuk memilih lokasi secara manual.';
            break;
          default:
            errorMessage = '❌ Gagal mendapatkan lokasi.\n\nSilakan klik di peta untuk memilih lokasi secara manual.';
        }

        alert(errorMessage);
        setLocating(false);
      },
      {
        enableHighAccuracy: false, // Set to false untuk lebih cepat
        timeout: 15000, // Increase timeout to 15 seconds
        maximumAge: 300000 // Accept cached location up to 5 minutes old
      }
    );
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        <MapPin className="w-4 h-4 inline mr-2" />
        Lokasi Limbah
      </label>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-blue-800">
          <p className="font-semibold mb-1">Cara memilih lokasi:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Klik di peta untuk memilih lokasi</li>
            <li>Drag (geser) marker merah untuk menyesuaikan posisi</li>
            <li>Atau klik tombol "Deteksi Lokasi Saya" (memerlukan izin akses lokasi)</li>
          </ul>
        </div>
      </div>

      {/* Auto-detect button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleAutoDetect}
          disabled={locating}
          className="flex items-center gap-2"
          size="sm"
        >
          <Locate className={`w-4 h-4 ${locating ? 'animate-pulse' : ''}`} />
          {locating ? 'Mendeteksi...' : 'Deteksi Lokasi Saya'}
        </Button>
      </div>

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-300 h-80">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          key={`${position[0]}-${position[1]}`} // Force re-render when position changes
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onLocationSelect={handleLocationSelect} />

          <Marker
            position={position}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handleLocationSelect(position.lat, position.lng);
              },
            }}
            ref={markerRef}
          />
        </MapContainer>
      </div>

      {/* Coordinates Display */}
      <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Latitude
          </label>
          <input
            type="text"
            value={position[0].toFixed(6)}
            readOnly
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Longitude
          </label>
          <input
            type="text"
            value={position[1].toFixed(6)}
            readOnly
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900"
          />
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
