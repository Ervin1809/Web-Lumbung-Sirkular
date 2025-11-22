import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapViewer = ({ latitude, longitude, title, height = 'h-64', showGoogleMapsLink = true }) => {
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

  // Generate Google Maps direction URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="space-y-2">
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
                  <p className="text-xs text-gray-600 mb-2">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Navigation className="w-3 h-3" />
                    Buka di Google Maps
                  </a>
                </div>
              </Popup>
            )}
          </Marker>
        </MapContainer>
      </div>

      {/* Google Maps Direction Button */}
      {showGoogleMapsLink && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Navigation className="w-4 h-4" />
          Buka Navigasi Google Maps
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};

export default MapViewer;
