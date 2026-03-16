/**
 * ReportsDataSkeleton - Skeleton for Reports & Analytics data sections
 * Reuses BaseSkeleton primitives only
 */

import BaseSkeleton from './BaseSkeleton';

const ReportsDataSkeleton = () => (
  <div className="space-y-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <BaseSkeleton height={14} width={110} />
              <BaseSkeleton height={28} width={90} />
            </div>
            <BaseSkeleton height={48} width={48} rounded="rounded-lg" />
          </div>
        </div>
      ))}
    </div>

    {/* Charts Section */}
    <div className="space-y-6">
      <BaseSkeleton height={22} width={160} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <BaseSkeleton height={18} width={160} className="mb-4" />
            <BaseSkeleton height={256} className="w-full" rounded="rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Top Performers */}
    <div className="space-y-6">
      <BaseSkeleton height={22} width={140} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <BaseSkeleton height={18} width={180} />
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BaseSkeleton width={32} height={32} rounded="rounded-full" />
                    <div className="space-y-1">
                      <BaseSkeleton height={16} width={180} />
                      <BaseSkeleton height={12} width={80} />
                    </div>
                  </div>
                  <BaseSkeleton height={16} width={70} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ReportsDataSkeleton;
