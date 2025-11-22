import React from 'react';

// ===== SKELETON BASE COMPONENT =====
const SkeletonBase = ({ className = '', rounded = 'md' }) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
        animate-pulse
        ${roundedClasses[rounded]}
        ${className}
      `}
    />
  );
};

// ===== WASTE CARD SKELETON =====
export const WasteCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Image Skeleton */}
      <SkeletonBase className="h-48 w-full" rounded="none" />
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Category Badge */}
        <SkeletonBase className="h-6 w-20" rounded="full" />
        
        {/* Title */}
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-full" rounded="md" />
          <SkeletonBase className="h-4 w-3/4" rounded="md" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <SkeletonBase className="h-3 w-full" rounded="md" />
          <SkeletonBase className="h-3 w-5/6" rounded="md" />
        </div>
        
        {/* Info Grid */}
        <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-3">
          <SkeletonBase className="h-4 w-full" rounded="md" />
          <SkeletonBase className="h-4 w-full" rounded="md" />
        </div>
        
        {/* Button */}
        <SkeletonBase className="h-10 w-full" rounded="lg" />
      </div>
    </div>
  );
};

// ===== DASHBOARD CARD SKELETON =====
export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2 flex-1">
            <SkeletonBase className="h-4 w-24" rounded="md" />
            <SkeletonBase className="h-8 w-32" rounded="md" />
          </div>
          <SkeletonBase className="h-12 w-12" rounded="full" />
        </div>
        <SkeletonBase className="h-3 w-full" rounded="md" />
      </div>
    </div>
  );
};

// ===== TABLE ROW SKELETON =====
export const TableRowSkeleton = ({ cols = 4 }) => {
  return (
    <tr className="border-b">
      {Array(cols).fill(0).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <SkeletonBase className="h-4 w-full" rounded="md" />
        </td>
      ))}
    </tr>
  );
};

// ===== PROFILE SKELETON =====
export const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-4">
        <SkeletonBase className="h-16 w-16" rounded="full" />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-5 w-40" rounded="md" />
          <SkeletonBase className="h-4 w-32" rounded="md" />
        </div>
      </div>
    </div>
  );
};

// ===== CHART SKELETON =====
export const ChartSkeleton = ({ height = 'h-64' }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="space-y-4">
        <SkeletonBase className="h-6 w-48" rounded="md" />
        <div className={`w-full ${height} flex items-end justify-between gap-2`}>
          {Array(7).fill(0).map((_, i) => (
            <SkeletonBase 
              key={i} 
              className="w-full" 
              rounded="md"
              style={{ height: `${Math.random() * 60 + 40}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== LIST SKELETON =====
export const ListSkeleton = ({ items = 5 }) => {
  return (
    <div className="space-y-3">
      {Array(items).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <SkeletonBase className="h-12 w-12" rounded="full" />
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-4 w-3/4" rounded="md" />
            <SkeletonBase className="h-3 w-1/2" rounded="md" />
          </div>
          <SkeletonBase className="h-8 w-20" rounded="md" />
        </div>
      ))}
    </div>
  );
};

// ===== FULL PAGE SKELETON (for Dashboard/Marketplace) =====
export const MarketplacePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <SkeletonBase className="h-8 w-64 mb-2" rounded="md" />
          <SkeletonBase className="h-4 w-96" rounded="md" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <SkeletonBase className="flex-1 h-10" rounded="lg" />
            <SkeletonBase className="md:w-64 h-10" rounded="lg" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <WasteCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== DASHBOARD PAGE SKELETON =====
export const DashboardPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <SkeletonBase className="h-8 w-64 mb-2" rounded="md" />
          <SkeletonBase className="h-4 w-96 mb-4" rounded="md" />
          <SkeletonBase className="h-6 w-32" rounded="full" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array(3).fill(0).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        {/* Achievement */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <SkeletonBase className="h-8 w-64 mb-4" rounded="md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <SkeletonBase className="h-12 w-12 mx-auto mb-2" rounded="full" />
                <SkeletonBase className="h-4 w-24 mx-auto mb-1" rounded="md" />
                <SkeletonBase className="h-3 w-32 mx-auto" rounded="md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export all components
const LoadingSkeleton = {
  Base: SkeletonBase,
  WasteCard: WasteCardSkeleton,
  DashboardCard: DashboardCardSkeleton,
  TableRow: TableRowSkeleton,
  Profile: ProfileSkeleton,
  Chart: ChartSkeleton,
  List: ListSkeleton,
  MarketplacePage: MarketplacePageSkeleton,
  DashboardPage: DashboardPageSkeleton,
};

export default LoadingSkeleton;