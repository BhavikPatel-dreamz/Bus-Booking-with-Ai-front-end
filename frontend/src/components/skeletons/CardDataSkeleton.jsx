/**
 * CardDataSkeleton - Skeleton for card grid data sections only
 * Used for ManageBuses, ManageRoutes, ManageTrips data areas
 */

import BaseSkeleton, { SkeletonBadge } from './BaseSkeleton';

// Bus Card Skeleton (simplified: no operating days, routes, departure times)
const BusManageCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <BaseSkeleton height={22} width={140} />
        <BaseSkeleton height={14} width={80} />
      </div>
      <SkeletonBadge width={70} />
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="space-y-1">
        <BaseSkeleton height={12} width={70} />
        <BaseSkeleton height={14} width={40} />
      </div>
      <div className="space-y-1">
        <BaseSkeleton height={12} width={80} />
        <BaseSkeleton height={14} width={50} />
      </div>
    </div>
    <div className="flex items-center gap-2 mb-4">
      <BaseSkeleton height={24} width={60} rounded="rounded" />
      <BaseSkeleton height={24} width={50} rounded="rounded" />
      <BaseSkeleton height={24} width={70} rounded="rounded" />
    </div>
    <div className="flex gap-2">
      <BaseSkeleton height={40} className="flex-1" rounded="rounded-lg" />
      <BaseSkeleton height={40} className="flex-1" rounded="rounded-lg" />
    </div>
  </div>
);

// Route Card Skeleton
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

// Trip Card Skeleton
const TripCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <BaseSkeleton height={20} width={150} />
        <BaseSkeleton height={14} width={100} />
      </div>
      <SkeletonBadge width={60} />
    </div>
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2">
        <BaseSkeleton height={16} width={16} rounded="rounded" />
        <BaseSkeleton height={14} width={180} />
      </div>
      <div className="flex items-center gap-2">
        <BaseSkeleton height={16} width={16} rounded="rounded" />
        <BaseSkeleton height={14} width={120} />
      </div>
      <div className="flex items-center gap-2">
        <BaseSkeleton height={16} width={16} rounded="rounded" />
        <BaseSkeleton height={14} width={150} />
      </div>
    </div>
    <div className="flex gap-2">
      <BaseSkeleton height={36} className="flex-1" rounded="rounded-lg" />
      <BaseSkeleton height={36} className="flex-1" rounded="rounded-lg" />
      <BaseSkeleton height={36} className="flex-1" rounded="rounded-lg" />
    </div>
  </div>
);

// Exported grid skeletons for data sections only
export const BusDataSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <BusManageCardSkeleton key={i} />
    ))}
  </div>
);

export const RouteDataSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <RouteCardSkeleton key={i} />
    ))}
  </div>
);

export const TripDataSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <TripCardSkeleton key={i} />
    ))}
  </div>
);

export default BusDataSkeleton;
