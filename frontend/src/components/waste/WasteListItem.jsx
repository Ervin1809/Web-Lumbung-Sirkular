import { Package, Scale, DollarSign, MapPin } from 'lucide-react';
import Button from '../common/Button';

const WasteListItem = ({ waste, onBook, userRole, showActions = true, onViewDetails }) => {
  const formatPrice = (price) => {
    return price === 0 ? 'Gratis' : `Rp ${price.toLocaleString('id-ID')}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Minyak': 'bg-yellow-100 text-yellow-800',
      'Plastik': 'bg-blue-100 text-blue-800',
      'Organik': 'bg-green-100 text-green-800',
      'Kertas': 'bg-orange-100 text-orange-800',
      'Logam': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-purple-100 text-purple-800';
  };

  const handleItemClick = () => {
    if (onViewDetails) {
      onViewDetails(waste);
    } else if (onBook && userRole === 'recycler') {
      onBook(waste);
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 relative cursor-pointer group"
    >
      {/* Image */}
      <div className="w-full sm:w-24 md:w-32 h-32 sm:h-24 md:h-28 flex-shrink-0 bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden relative">
        {waste.image_url ? (
          <img
            src={waste.image_url}
            alt={waste.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        )}
        {/* View Details Indicator on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Lihat</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(waste.category)}`}>
            {waste.category}
          </span>
          {waste.price === 0 && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              GRATIS
            </span>
          )}
        </div>

        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 line-clamp-1">
          {waste.title}
        </h3>

        {waste.description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">
            {waste.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-green-600" />
            <span className="font-medium">{waste.weight} Kg</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-green-600" />
            <span className="font-medium">{formatPrice(waste.price)}</span>
          </div>
          {waste.latitude && waste.longitude && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">Lokasi tersedia</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col items-center gap-2 sm:justify-center flex-shrink-0">
        {showActions && userRole === 'recycler' && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onBook(waste);
            }}
            size="sm"
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            Booking
          </Button>
        )}

        {showActions && userRole === 'producer' && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            Milik Anda
          </span>
        )}

        {!userRole && showActions && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            Login untuk booking
          </span>
        )}
      </div>
    </div>
  );
};

export default WasteListItem;
