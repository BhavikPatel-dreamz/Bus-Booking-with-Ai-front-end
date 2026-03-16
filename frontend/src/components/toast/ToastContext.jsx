import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const TOAST_LIMIT = 5;
const DEFAULT_DURATION = 4000;

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    // Mark as exiting first for animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id].timeout);
        delete timersRef.current[id];
      }
    }, 300);
  }, []);

  const showToast = useCallback(({ type = 'info', title, message, duration = DEFAULT_DURATION }) => {
    const id = ++toastIdCounter;

    setToasts((prev) => {
      const next = [{ id, type, title, message, duration, createdAt: Date.now(), exiting: false, paused: false }, ...prev];
      // Remove oldest if over limit
      if (next.length > TOAST_LIMIT) {
        const removed = next.pop();
        if (timersRef.current[removed.id]) {
          clearTimeout(timersRef.current[removed.id].timeout);
          delete timersRef.current[removed.id];
        }
      }
      return next;
    });

    // Auto dismiss
    const timeout = setTimeout(() => removeToast(id), duration);
    timersRef.current[id] = { timeout, remaining: duration, start: Date.now() };

    return id;
  }, [removeToast]);

  const pauseToast = useCallback((id) => {
    const timer = timersRef.current[id];
    if (timer) {
      clearTimeout(timer.timeout);
      timer.remaining = timer.remaining - (Date.now() - timer.start);
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, paused: true } : t)));
    }
  }, []);

  const resumeToast = useCallback((id) => {
    const timer = timersRef.current[id];
    if (timer) {
      timer.start = Date.now();
      timer.timeout = setTimeout(() => removeToast(id), timer.remaining);
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, paused: false } : t)));
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, pauseToast, resumeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
