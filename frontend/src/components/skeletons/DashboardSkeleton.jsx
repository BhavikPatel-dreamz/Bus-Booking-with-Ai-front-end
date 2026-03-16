/**
 * DashboardSkeleton - Skeleton loader for admin dashboard
 * Matches KPI cards, charts, and table layout
 */

import BaseSkeleton, { SkeletonCircle } from './BaseSkeleton';

const KPICardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <BaseSkeleton height={14} width={100} />
        <BaseSkeleton height={28} width={80} />
      </div>
      <BaseSkeleton height={48} width={48} rounded="rounded-lg" />
    </div>
  </div>
);

const ChartSkeleton = ({ height = 256 }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
    <BaseSkeleton height={18} width={200} className="mb-4" />
    <div style={{ height }} className="flex items-end justify-between gap-2 px-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <BaseSkeleton 
          key={i} 
          width={30} 
          height={Math.random() * (height - 40) + 40} 
          rounded="rounded-t"
        />
      ))}
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr>
    <td className="px-6 py-4"><BaseSkeleton height={16} width={120} /></td>
    <td className="px-6 py-4"><BaseSkeleton height={16} width={150} /></td>
    <td className="px-6 py-4"><BaseSkeleton height={22} width={70} rounded="rounded-full" /></td>
    <td className="px-6 py-4"><BaseSkeleton height={16} width={90} /></td>
  </tr>
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <BaseSkeleton height={28} width={200} />
      <BaseSkeleton height={16} width={320} className="mt-2" />
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>

    {/* Charts Section Header */}
    <BaseSkeleton height={22} width={180} />

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>

    {/* Full Width Chart */}
    <ChartSkeleton height={288} />

    {/* Table */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <BaseSkeleton height={22} width={160} />
        <BaseSkeleton height={14} width={280} className="mt-2" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3"><BaseSkeleton height={12} width={40} /></th>
              <th className="px-6 py-3"><BaseSkeleton height={12} width={50} /></th>
              <th className="px-6 py-3"><BaseSkeleton height={12} width={50} /></th>
              <th className="px-6 py-3"><BaseSkeleton height={12} width={40} /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
