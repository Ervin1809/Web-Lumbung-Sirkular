import { Package, Scale, DollarSign } from 'lucide-react';
import Button from '../common/Button';

const WasteCard = ({ waste, onBook, userRole, showActions = true, onViewDetails }) => {
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

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(waste);
    } else if (onBook && userRole === 'recycler') {
      onBook(waste);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 relative cursor-pointer group"
    >
      {/* Free Badge */}
      {waste.price === 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            GRATIS
          </span>
        </div>
      )}


      {/* Image Section */}
      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
        {waste.image_url ? (
          <img
            src={waste.image_url}
            alt={waste.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Package className="w-20 h-20 text-green-600 opacity-50" />
        )}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Category Badge */}
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getCategoryColor(waste.category)}`}>
          {waste.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {waste.title}
        </h3>

        {/* Description */}
        {waste.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {waste.description}
          </p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700">
            <Scale className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">{waste.weight} Kg</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">{formatPrice(waste.price)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && userRole === 'recycler' && (
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onBook(waste);
              }}
              className="flex-1"
              size="sm"
            >
              Booking Sekarang
            </Button>
          </div>
        )}

        {showActions && userRole === 'producer' && (
          <div className="text-center py-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Limbah Anda
            </span>
          </div>
        )}

        {/* Guest View */}
        {!userRole && showActions && (
          <div className="text-center py-2">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              Login untuk booking
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteCard;
