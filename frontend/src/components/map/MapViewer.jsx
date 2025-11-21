import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapViewer = ({ latitude, longitude, title, height = 'h-64' }) => {
  // Check if coordinates are available
  if (!latitude || !longitude) {
    return (
      <div className={`${height} bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Lokasi tidak tersedia</p>
        </div>
      </div>
    );
  }

  const position = [parseFloat(latitude), parseFloat(longitude)];

  return (
    <div className={`${height} rounded-lg overflow-hidden border-2 border-gray-300`}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          {title && (
            <Popup>
              <div className="text-center">
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-gray-600">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapViewer;
