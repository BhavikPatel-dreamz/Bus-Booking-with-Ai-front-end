/**
 * BusListSkeleton - Skeleton loader for bus search results page
 * Matches the layout of bus result cards
 */

import BaseSkeleton, { SkeletonBadge } from './BaseSkeleton';

const BusCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Left section - Bus info */}
      <div className="flex-1">
        <div className="flex items-start justify-between lg:justify-start gap-4">
          <div className="space-y-2">
            <BaseSkeleton height={22} width={160} />
            <BaseSkeleton height={14} width={100} />
            <BaseSkeleton height={12} width={130} className="mt-1" />
          </div>
          <SkeletonBadge width={50} />
        </div>
      </div>

      {/* Middle section - Times */}
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-center space-y-1">
          <BaseSkeleton height={22} width={70} />
          <BaseSkeleton height={12} width={50} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <BaseSkeleton height={12} width={50} />
          <BaseSkeleton height={2} width={80} />
        </div>
        <div className="text-center space-y-1">
          <BaseSkeleton height={22} width={70} />
          <BaseSkeleton height={12} width={50} />
        </div>
      </div>

      {/* Right section - Price & CTA */}
      <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2">
        <div className="space-y-1">
          <BaseSkeleton height={28} width={70} />
          <BaseSkeleton height={14} width={90} />
        </div>
        <BaseSkeleton height={40} width={110} rounded="rounded-lg" />
      </div>
    </div>

    {/* Footer - Operating days & amenities */}
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BaseSkeleton height={16} width={16} rounded="rounded" />
          <BaseSkeleton height={12} width={100} />
          <BaseSkeleton height={14} width={120} />
        </div>
        <div className="flex items-center gap-3">
          <BaseSkeleton height={12} width={60} />
          <div className="flex gap-2">
            <BaseSkeleton height={16} width={50} />
            <BaseSkeleton height={16} width={50} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BusListSkeleton = ({ count = 5 }) => (
  <div className="bg-slate-50 min-h-screen">
    {/* Header skeleton */}
    <div className="bg-sky-600 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <BaseSkeleton height={20} width={20} rounded="rounded" className="bg-sky-400" />
            <BaseSkeleton height={18} width={100} className="bg-sky-400" />
          </div>
          <BaseSkeleton height={18} width={20} className="bg-sky-400" />
          <div className="flex items-center gap-2">
            <BaseSkeleton height={20} width={20} rounded="rounded" className="bg-sky-400" />
            <BaseSkeleton height={18} width={100} className="bg-sky-400" />
          </div>
          <BaseSkeleton height={18} width={10} className="bg-sky-400" />
          <BaseSkeleton height={18} width={120} className="bg-sky-400" />
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <BaseSkeleton height={24} width={150} />
        <BaseSkeleton height={16} width={100} />
      </div>
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <BusCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default BusListSkeleton;
