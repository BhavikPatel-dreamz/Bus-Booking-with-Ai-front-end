import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useToast } from './ToastContext';

const typeConfig = {
  success: {
    icon: CheckCircle,
    containerClass: 'border-emerald-200 bg-white',
    iconClass: 'text-emerald-500',
    progressClass: 'bg-emerald-500',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'border-rose-200 bg-white',
    iconClass: 'text-rose-500',
    progressClass: 'bg-rose-500',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'border-amber-200 bg-white',
    iconClass: 'text-amber-500',
    progressClass: 'bg-amber-500',
  },
  info: {
    icon: Info,
    containerClass: 'border-sky-200 bg-white',
    iconClass: 'text-sky-500',
    progressClass: 'bg-sky-500',
  },
};

const ToastItem = ({ toast }) => {
  const { removeToast, pauseToast, resumeToast } = useToast();
  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  // Progress tracking
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.exiting) return;

    const startTime = toast.createdAt;
    const duration = toast.duration;
    let rafId;

    const tick = () => {
      if (toast.paused) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [toast.createdAt, toast.duration, toast.exiting, toast.paused]);

  return (
    <div
      className={`pointer-events-auto rounded-xl border shadow-card overflow-hidden transition-all duration-300 ${config.containerClass} ${
        toast.exiting ? 'toast-exit' : 'toast-enter'
      }`}
      onMouseEnter={() => pauseToast(toast.id)}
      onMouseLeave={() => resumeToast(toast.id)}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconClass}`} />
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
          )}
          <p className="text-sm text-slate-600">{toast.message}</p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-1 w-full bg-slate-100">
        <div
          className={`h-full transition-none ${config.progressClass}`}
          style={{ width: `${progress}%`, opacity: 0.6 }}
        />
      </div>
    </div>
  );
};

export default ToastItem;
