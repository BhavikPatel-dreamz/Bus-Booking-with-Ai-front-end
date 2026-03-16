/**
 * Spinner - Simple loading spinner for light transitions
 */

const Spinner = ({ 
  size = 'md', 
  className = '',
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div 
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          border-slate-200 
          border-t-sky-600 
          rounded-full 
          animate-spin
        `}
      />
      {text && (
        <p className="text-sm text-slate-500 font-medium">{text}</p>
      )}
    </div>
  );
};

/**
 * FullPageSpinner - Centered spinner for full page loading
 */
export const FullPageSpinner = ({ text = 'Loading...' }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Spinner size="lg" text={text} />
  </div>
);

/**
 * InlineSpinner - Small spinner for inline loading states
 */
export const InlineSpinner = ({ className = '' }) => (
  <div 
    className={`
      w-4 h-4 
      border-2 
      border-current 
      border-t-transparent 
      rounded-full 
      animate-spin 
      ${className}
    `}
  />
);

export default Spinner;
