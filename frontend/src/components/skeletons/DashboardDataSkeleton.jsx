/**
 * DashboardDataSkeleton - Skeleton for dashboard data sections only
 * Replaces KPI cards, charts, and tables while keeping header visible
 */

import BaseSkeleton, { SkeletonBadge } from './BaseSkeleton';

// KPI Cards Skeleton
export const KpiCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <BaseSkeleton height={14} width={100} />
            <BaseSkeleton height={28} width={80} />
          </div>
          <BaseSkeleton height={48} width={48} rounded="rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// Charts Section Skeleton
export const ChartsSkeleton = () => (
  <div className="space-y-6">
    <BaseSkeleton height={24} width={180} />
    
    {/* Top Row - Two Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <BaseSkeleton height={18} width={180} className="mb-4" />
        <BaseSkeleton height={256} className="w-full" rounded="rounded-lg" />
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <BaseSkeleton height={18} width={180} className="mb-4" />
        <BaseSkeleton height={256} className="w-full" rounded="rounded-lg" />
      </div>
    </div>

    {/* Bottom Row - Full Width Chart */}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <BaseSkeleton height={18} width={200} className="mb-4" />
      <BaseSkeleton height={288} className="w-full" rounded="rounded-lg" />
    </div>
  </div>
);

// Recent Bookings Table Skeleton
export const RecentBookingsTableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100">
    <div className="p-6 border-b border-slate-100">
      <BaseSkeleton height={24} width={160} />
      <BaseSkeleton height={14} width={280} className="mt-2" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            {['PNR', 'Route', 'Status', 'Date'].map((_, i) => (
              <th key={i} className="text-left px-6 py-3">
                <BaseSkeleton height={12} width={60} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i}>
              <td className="px-6 py-4"><BaseSkeleton height={14} width={120} /></td>
              <td className="px-6 py-4"><BaseSkeleton height={14} width={140} /></td>
              <td className="px-6 py-4"><SkeletonBadge width={70} /></td>
              <td className="px-6 py-4"><BaseSkeleton height={14} width={90} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Full Dashboard Data Skeleton (all sections combined)
const DashboardDataSkeleton = () => (
  <div className="space-y-6">
    <KpiCardsSkeleton />
    <ChartsSkeleton />
    <RecentBookingsTableSkeleton />
  </div>
);

export default DashboardDataSkeleton;
