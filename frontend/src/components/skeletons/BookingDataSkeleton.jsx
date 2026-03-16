/**
 * BookingDataSkeleton - Skeleton for booking list data sections only
 * Used for ViewBookings and MyBookings data areas
 */

import BaseSkeleton, { SkeletonBadge } from './BaseSkeleton';

// Admin Booking Card Skeleton
const AdminBookingCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="space-y-1">
            <BaseSkeleton height={12} width={30} />
            <BaseSkeleton height={14} width={120} />
          </div>
          <SkeletonBadge width={70} />
          <div className="space-y-1">
            <BaseSkeleton height={12} width={30} />
            <BaseSkeleton height={14} width={80} />
          </div>
          <div className="space-y-1">
            <BaseSkeleton height={12} width={40} />
            <BaseSkeleton height={14} width={120} />
          </div>
          <div className="space-y-1">
            <BaseSkeleton height={12} width={70} />
            <BaseSkeleton height={14} width={90} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right space-y-1">
            <BaseSkeleton height={12} width={50} />
            <BaseSkeleton height={14} width={60} />
          </div>
          <BaseSkeleton height={36} width={36} rounded="rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

// User Booking Card Skeleton
const UserBookingCardSkeleton = () => (
  <div className="bg-card rounded-xl shadow-card overflow-hidden border-l-4 border-l-slate-300">
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="space-y-1">
          <BaseSkeleton height={12} width={80} />
          <BaseSkeleton height={22} width={140} />
        </div>
        <SkeletonBadge width={70} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <BaseSkeleton height={40} width={40} rounded="rounded-lg" />
        <div className="space-y-1">
          <BaseSkeleton height={16} width={100} />
          <BaseSkeleton height={12} width={80} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <BaseSkeleton height={16} width={16} rounded="rounded" />
        <BaseSkeleton height={14} width={80} />
        <BaseSkeleton height={14} width={16} />
        <BaseSkeleton height={14} width={80} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-1">
          <BaseSkeleton height={10} width={70} />
          <BaseSkeleton height={14} width={90} />
        </div>
        <div className="space-y-1">
          <BaseSkeleton height={10} width={40} />
          <BaseSkeleton height={14} width={60} />
        </div>
        <div className="space-y-1">
          <BaseSkeleton height={10} width={70} />
          <BaseSkeleton height={14} width={30} />
        </div>
        <div className="space-y-1">
          <BaseSkeleton height={10} width={80} />
          <BaseSkeleton height={14} width={70} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <BaseSkeleton height={40} width={120} rounded="rounded-lg" />
        <BaseSkeleton height={40} width={120} rounded="rounded-lg" />
      </div>
    </div>
  </div>
);

// Exported data-only skeletons
export const AdminBookingDataSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <AdminBookingCardSkeleton key={i} />
    ))}
  </div>
);

export const UserBookingDataSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <UserBookingCardSkeleton key={i} />
    ))}
  </div>
);

export default AdminBookingDataSkeleton;
