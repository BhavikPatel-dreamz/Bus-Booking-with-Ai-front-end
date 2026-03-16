/**
 * BaseSkeleton - Foundation component for all skeleton loaders
 * Features consistent shimmer animation and theming
 */

const BaseSkeleton = ({ 
  className = '', 
  width, 
  height, 
  rounded = 'rounded-md',
  animate = true 
}) => {
  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        bg-slate-200 
        ${rounded} 
        ${animate ? 'skeleton-shimmer' : ''} 
        ${className}
      `}
      style={style}
    />
  );
};

/**
 * Pre-built skeleton shapes for common use cases
 */
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <BaseSkeleton 
        key={i} 
        height={16} 
        className={i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'} 
      />
    ))}
  </div>
);

export const SkeletonCircle = ({ size = 40, className = '' }) => (
  <BaseSkeleton 
    width={size} 
    height={size} 
    rounded="rounded-full" 
    className={className} 
  />
);

export const SkeletonButton = ({ width = 100, className = '' }) => (
  <BaseSkeleton 
    width={width} 
    height={40} 
    rounded="rounded-lg" 
    className={className} 
  />
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border border-slate-100 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-2 flex-1">
        <BaseSkeleton height={20} className="w-1/2" />
        <BaseSkeleton height={14} className="w-1/3" />
      </div>
      <SkeletonCircle size={48} />
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonBadge = ({ width = 60, className = '' }) => (
  <BaseSkeleton 
    width={width} 
    height={24} 
    rounded="rounded-full" 
    className={className} 
  />
);

export default BaseSkeleton;
