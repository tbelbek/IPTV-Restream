import React, { createContext, useCallback, useState } from 'react';
import { ToastNotification } from '../../types';

interface ToastContextType {
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  removeToast: (id: string) => void;
  toasts: ToastNotification[];
}

export const ToastContext = createContext<ToastContextType>({
  addToast: () => '',
  removeToast: () => {},
  toasts: [],
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 5000 }: Omit<ToastNotification, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastNotification = {
        id,
        type,
        title,
        message,
        duration,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      return id;
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}