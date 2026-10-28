/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    // Trigger exiting animation first
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    // Remove from DOM after exit animation completes (300ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    ({ type = "success", title, message, duration = 2000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, title, message, duration, isExiting: false };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (title, message, duration = 2000) => {
      return showToast({ type: "success", title, message, duration });
    },
    [showToast]
  );

  const error = useCallback(
    (title, message, duration = 4000) => {
      return showToast({ type: "error", title, message, duration });
    },
    [showToast]
  );

  const warning = useCallback(
    (title, message, duration = 4000) => {
      return showToast({ type: "warning", title, message, duration });
    },
    [showToast]
  );

  const info = useCallback(
    (title, message, duration = 4000) => {
      return showToast({ type: "info", title, message, duration });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      {/* Top-Right Notification Toast Container */}
      <div
        className="fixed top-5 right-5 z-[9999] pointer-events-none flex flex-col gap-3 max-w-[calc(100vw-40px)] sm:max-w-[400px]"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
