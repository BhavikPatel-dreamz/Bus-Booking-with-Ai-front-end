import { useToast } from './ToastContext';
import ToastItem from './ToastItem';

const ToastViewport = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed right-4 z-40 flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      style={{ top: 'calc(4rem + 16px)' }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastViewport;
