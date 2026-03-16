/**
 * Skeleton Loaders Index
 * Export all skeleton components for easy imports
 */

// Base components
export { default as BaseSkeleton, SkeletonText, SkeletonCircle, SkeletonButton, SkeletonCard, SkeletonBadge } from './BaseSkeleton';

// Spinner components
export { default as Spinner, FullPageSpinner, InlineSpinner } from './Spinner';

// Full-page skeletons (legacy - for reference)
export { default as BusListSkeleton } from './BusListSkeleton';
export { default as DashboardSkeleton } from './DashboardSkeleton';
export { default as BusGridSkeleton, RouteGridSkeleton, TripGridSkeleton } from './CardGridSkeleton';
export { default as BookingListSkeleton, MyBookingsSkeleton } from './TableSkeleton';

// Data-section-only skeletons (PREFERRED - keeps page layout visible)
export { default as BusResultsSkeleton } from './BusResultsSkeleton';
export { default as DashboardDataSkeleton, KpiCardsSkeleton, ChartsSkeleton, RecentBookingsTableSkeleton } from './DashboardDataSkeleton';
export { default as BusDataSkeleton, RouteDataSkeleton, TripDataSkeleton } from './CardDataSkeleton';
export { default as AdminBookingDataSkeleton, UserBookingDataSkeleton } from './BookingDataSkeleton';
export { default as EmployeeDataSkeleton } from './EmployeeDataSkeleton';
export { default as ContactRequestsDataSkeleton } from './ContactRequestsDataSkeleton';
export { default as ReportsDataSkeleton } from './ReportsDataSkeleton';