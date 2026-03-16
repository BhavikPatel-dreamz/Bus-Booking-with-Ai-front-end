/**
 * ContactRequestsDataSkeleton - Skeleton for contact request cards
 * Reuses BaseSkeleton primitives only
 */

import BaseSkeleton, { SkeletonBadge } from './BaseSkeleton';

const ContactCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <BaseSkeleton width={40} height={40} rounded="rounded-lg" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <BaseSkeleton height={18} width={160} />
            <SkeletonBadge width={40} />
          </div>
          <div className="flex items-center gap-3">
            <BaseSkeleton height={14} width={100} />
            <BaseSkeleton height={14} width={140} />
          </div>
          <BaseSkeleton height={14} className="w-3/4" />
        </div>
      </div>
      <BaseSkeleton height={14} width={120} />
    </div>
    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
      <BaseSkeleton height={16} width={100} />
    </div>
  </div>
);

const ContactRequestsDataSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <ContactCardSkeleton key={i} />
    ))}
  </div>
);

export default ContactRequestsDataSkeleton;
