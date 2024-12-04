"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast, { ToastProps, ToastVariant } from "@/components/ui/Toast";

interface ToastContextType {
  showToast: (
    message: string,
    variant?: ToastVariant,
    duration?: number,
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ExtendedToast extends ToastProps {
  id: string;
  height?: number;
}

const MAX_TOASTS = 5;

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ExtendedToast[]>([]);

  const updateToastHeight = useCallback((id: string, height: number) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, height } : toast)),
    );
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info", duration?: number) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newToast = {
        id,
        message,
        variant,
        duration,
        height: undefined,
        onClose: () => {
          setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id),
          );
        },
      };

      setToasts((prev) => {
        const updatedToasts = [...prev, newToast];
        if (updatedToasts.length > MAX_TOASTS) {
          return updatedToasts.slice(-MAX_TOASTS);
        }
        return updatedToasts;
      });
    },
    [],
  );

  // Get heights array for positioning
  const getHeights = (toasts: ExtendedToast[]) =>
    toasts.map((toast) => toast.height || 0);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts
        .slice()
        .reverse()
        .map((toast, index) => (
          <Toast
            key={toast.id}
            {...toast}
            index={index}
            heights={getHeights(toasts.slice().reverse())}
            onHeightUpdate={(height) => updateToastHeight(toast.id, height)}
          />
        ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
