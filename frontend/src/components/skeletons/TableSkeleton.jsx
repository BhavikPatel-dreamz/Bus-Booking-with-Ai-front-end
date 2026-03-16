/**
 * TableSkeleton - Skeleton loader for table-based pages
 * Used for ViewBookings page
 */

import BaseSkeleton, { SkeletonBadge } from './BaseSkeleton';

const BookingCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="space-y-1">
        <BaseSkeleton height={18} width={130} />
        <BaseSkeleton height={14} width={100} />
      </div>
      <SkeletonBadge width={70} />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
      <div className="space-y-1">
        <BaseSkeleton height={12} width={50} />
        <BaseSkeleton height={14} width={140} />
      </div>
      <div className="space-y-1">
        <BaseSkeleton height={12} width={70} />
        <BaseSkeleton height={14} width={100} />
      </div>
      <div className="space-y-1">
        <BaseSkeleton height={12} width={40} />
        <BaseSkeleton height={14} width={80} />
      </div>
      <div className="space-y-1">
        <BaseSkeleton height={12} width={50} />
        <BaseSkeleton height={14} width={70} />
      </div>
    </div>
    <BaseSkeleton height={36} width={120} rounded="rounded-lg" />
  </div>
);

const BookingListSkeleton = ({ count = 6 }) => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <div className="flex items-center gap-2 mb-1">
        <BaseSkeleton height={28} width={28} rounded="rounded" />
        <BaseSkeleton height={28} width={160} />
      </div>
      <BaseSkeleton height={16} width={280} className="mt-2" />
    </div>

    {/* Filters */}
    <div className="flex flex-wrap gap-3">
      <BaseSkeleton height={40} className="flex-1 min-w-[200px] max-w-md" rounded="rounded-lg" />
      <BaseSkeleton height={40} width={140} rounded="rounded-lg" />
      <BaseSkeleton height={40} width={140} rounded="rounded-lg" />
    </div>

    {/* Booking Cards */}
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-center gap-2">
      <BaseSkeleton height={36} width={80} rounded="rounded-lg" />
      <BaseSkeleton height={36} width={36} rounded="rounded-lg" />
      <BaseSkeleton height={36} width={36} rounded="rounded-lg" />
      <BaseSkeleton height={36} width={36} rounded="rounded-lg" />
      <BaseSkeleton height={36} width={80} rounded="rounded-lg" />
    </div>
  </div>
);

export const MyBookingsSkeleton = ({ count = 3 }) => (
  <div className="container mx-auto px-4 py-8">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <BaseSkeleton height={32} width={32} rounded="rounded" />
      <BaseSkeleton height={28} width={160} />
    </div>

    {/* Booking Cards */}
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BaseSkeleton height={12} width={30} />
                <BaseSkeleton height={18} width={140} />
              </div>
              <SkeletonBadge width={70} />
            </div>
            <BaseSkeleton height={24} width={80} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1">
              <BaseSkeleton height={12} width={40} />
              <BaseSkeleton height={16} width={120} />
              <BaseSkeleton height={12} width={80} />
            </div>
            <div className="space-y-1">
              <BaseSkeleton height={12} width={50} />
              <BaseSkeleton height={16} width={150} />
            </div>
            <div className="space-y-1">
              <BaseSkeleton height={12} width={70} />
              <BaseSkeleton height={16} width={100} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <BaseSkeleton height={40} width={120} rounded="rounded-lg" />
            <BaseSkeleton height={40} width={120} rounded="rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BookingListSkeleton;
