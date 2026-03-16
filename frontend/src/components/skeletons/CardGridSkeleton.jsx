/**
 * CardGridSkeleton - Skeleton loader for card-based grids
 * Used for ManageBuses, ManageRoutes, ManageTrips pages
 */

import BaseSkeleton, { SkeletonBadge } from './BaseSkeleton';

const BusManageCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    {/* Header: Name + number + badge */}
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <BaseSkeleton height={22} width={140} />
        <BaseSkeleton height={14} width={90} />
      </div>
      <SkeletonBadge width={70} />
    </div>

    {/* Seats + Price */}
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="space-y-1">
        <BaseSkeleton height={12} width={80} />
        <BaseSkeleton height={14} width={60} />
      </div>
      <div className="space-y-1">
        <BaseSkeleton height={12} width={100} />
        <BaseSkeleton height={14} width={70} />
      </div>
    </div>

    {/* Amenities */}
    <div className="flex items-center gap-2 mb-4">
      <BaseSkeleton height={24} width={60} rounded="rounded" />
      <BaseSkeleton height={24} width={50} rounded="rounded" />
      <BaseSkeleton height={24} width={70} rounded="rounded" />
    </div>

    {/* Buttons */}
    <div className="flex gap-2">
      <BaseSkeleton height={40} className="flex-1" rounded="rounded-lg" />
      <BaseSkeleton height={40} className="flex-1" rounded="rounded-lg" />
    </div>
  </div>
);

const RouteCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <BaseSkeleton height={22} width={180} />
        <div className="flex items-center gap-1">
          <BaseSkeleton height={16} width={16} rounded="rounded" />
          <BaseSkeleton height={14} width={60} />
        </div>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <BaseSkeleton key={i} height={26} width={70} rounded="rounded-full" />
      ))}
    </div>
    <div className="flex gap-6 mb-4">
      <div className="space-y-1">
        <BaseSkeleton height={14} width={60} />
        <BaseSkeleton height={16} width={70} />
      </div>
      <div className="space-y-1">
        <BaseSkeleton height={14} width={60} />
        <BaseSkeleton height={16} width={50} />
      </div>
    </div>
    <div className="flex gap-3">
      <BaseSkeleton height={40} className="flex-1" rounded="rounded-lg" />
      <BaseSkeleton height={40} className="flex-1" rounded="rounded-lg" />
    </div>
  </div>
);

const TripCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <BaseSkeleton height={20} width={150} />
        <BaseSkeleton height={14} width={100} />
      </div>
    </div>

    <div className="space-y-3 mb-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <BaseSkeleton height={16} width={16} rounded="rounded" />
          <div className="space-y-1">
            <BaseSkeleton height={12} width={70} />
            <BaseSkeleton height={14} width={130} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BaseSkeleton height={16} width={16} rounded="rounded" />
          <div className="space-y-1">
            <BaseSkeleton height={12} width={70} />
            <BaseSkeleton height={14} width={130} />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
  {/* Icon */}
  <BaseSkeleton height={16} width={16} rounded="rounded" />

  {/* Right side column */}
  <div className="flex flex-col gap-2">
    {/* Text */}
    <BaseSkeleton height={14} width={150} />

    {/* Chips BELOW text */}
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <BaseSkeleton
          key={i}
          height={15}
          width={30}
          rounded="rounded-full"
        />
      ))}
    </div>
  </div>
</div>


      <div className="flex items-center gap-2">
        <div className="space-y-1">
            <BaseSkeleton height={14} width={130} />
            <BaseSkeleton height={12} width={70} />
            
          </div>
      </div>
    </div>

    
    <div className="flex gap-2">
      <BaseSkeleton height={36} className="flex-1" rounded="rounded-lg" />
      <BaseSkeleton height={36} className="flex-1" rounded="rounded-lg" />
    </div>
  </div>
);

export const BusGridSkeleton = ({ count = 4 }) => (
  <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <BaseSkeleton height={28} width={28} rounded="rounded" />
        <BaseSkeleton height={28} width={160} />
      </div>
      <BaseSkeleton height={16} width={280} className="mt-2" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <BusManageCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const RouteGridSkeleton = ({ count = 4 }) => (
  <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <BaseSkeleton height={28} width={28} rounded="rounded" />
        <BaseSkeleton height={28} width={160} />
      </div>
      <BaseSkeleton height={16} width={320} className="mt-2" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RouteCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const TripGridSkeleton = ({ count = 4 }) => (
  <div className="space-y-6">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TripCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default BusGridSkeleton;
