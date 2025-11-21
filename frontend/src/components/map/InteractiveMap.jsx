import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Package, Scale, DollarSign } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker untuk waste
const createWasteIcon = (category) => {
  const colors = {
    'Minyak': '#fbbf24',
    'Plastik': '#3b82f6',
    'Organik': '#22c55e',
    'Kertas': '#f97316',
    'Logam': '#6b7280',
  };
  
  const color = colors[category] || '#8b5cf6';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="transform: rotate(45deg);" width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component untuk auto-center map
function MapAutoCenter({ wastes }) {
  const map = useMap();
  
  useEffect(() => {
    if (wastes && wastes.length > 0) {
      const validWastes = wastes.filter(w => w.latitude && w.longitude);
      if (validWastes.length > 0) {
        const bounds = L.latLngBounds(
          validWastes.map(w => [w.latitude, w.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [wastes, map]);
  
  return null;
}

const InteractiveMap = ({ wastes = [], onWasteClick }) => {
  const [center, setCenter] = useState([-5.132780, 119.488109]);
  const [zoom, setZoom] = useState(13);

  // Filter waste yang punya koordinat
  const mappableWastes = wastes.filter(waste => 
    waste.latitude && waste.longitude
  );

  const formatPrice = (price) => {
    return price === 0 ? 'Gratis' : `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Base Map Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto-center to show all markers */}
        <MapAutoCenter wastes={mappableWastes} />

        {/* Waste Markers */}
        {mappableWastes.map((waste) => (
          <Marker
            key={waste.id}
            position={[waste.latitude, waste.longitude]}
            icon={createWasteIcon(waste.category)}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                {/* Image */}
                {waste.image_url && (
                  <img
                    src={waste.image_url}
                    alt={waste.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Category Badge */}
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${
                  waste.category === 'Minyak' ? 'bg-yellow-100 text-yellow-800' :
                  waste.category === 'Plastik' ? 'bg-blue-100 text-blue-800' :
                  waste.category === 'Organik' ? 'bg-green-100 text-green-800' :
                  waste.category === 'Kertas' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {waste.category}
                </span>

                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-2">
                  {waste.title}
                </h3>

                {/* Description */}
                {waste.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {waste.description}
                  </p>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Scale className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{waste.weight} Kg</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{formatPrice(waste.price)}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onWasteClick && onWasteClick(waste)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Lihat Detail
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="font-semibold text-xs text-gray-900 mb-2">Kategori Limbah:</h4>
        <div className="space-y-1">
          {[
            { category: 'Minyak', color: '#fbbf24' },
            { category: 'Plastik', color: '#3b82f6' },
            { category: 'Organik', color: '#22c55e' },
            { category: 'Kertas', color: '#f97316' },
            { category: 'Logam', color: '#6b7280' },
          ].map(({ category, color }) => (
            <div key={category} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-gray-700">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-bold text-lg text-gray-900">
              {mappableWastes.length}
            </div>
            <div className="text-xs text-gray-600">Lokasi Limbah</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;