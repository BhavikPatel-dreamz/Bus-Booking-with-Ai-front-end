/**
 * Employee Data Skeleton
 * Shows skeleton cards for the employee list section only
 */

import BaseSkeleton, { SkeletonText, SkeletonBadge, SkeletonButton } from './BaseSkeleton';

const EmployeeCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
    {/* Header with Name and Badge */}
    <div className="mb-4">
      <SkeletonText width="70%" height="1.25rem" className="mb-2" />
      <SkeletonBadge width="70px" />
    </div>

    {/* Phone and City */}
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2">
        <BaseSkeleton width="16px" height="16px" className="rounded" />
        <SkeletonText width="120px" height="0.875rem" />
      </div>
      <div className="flex items-center gap-2">
        <BaseSkeleton width="16px" height="16px" className="rounded" />
        <SkeletonText width="100px" height="0.875rem" />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2 pt-3 border-t border-slate-100">
      <SkeletonButton className="flex-1" />
      <BaseSkeleton width="52px" height="36px" className="rounded-lg" />
    </div>
  </div>
);

const EmployeeDataSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <EmployeeCardSkeleton key={index} />
    ))}
  </div>
);

export default EmployeeDataSkeleton;
