"use client";

import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
  index?: number;
  heights?: number[];
  onHeightUpdate?: (height: number) => void;
}

const TOAST_GAP = 16; // 1rem
const SCREEN_PADDING = 16; // 1rem from screen edges

const getIcon = (variant: ToastVariant) => {
  switch (variant) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />;
    case "error":
      return <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />;
    case "warning":
      return <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-500" />;
    case "info":
      return <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />;
  }
};

const getBgColor = (variant: ToastVariant) => {
  switch (variant) {
    case "success":
      return "bg-green-50 border-green-100";
    case "error":
      return "bg-red-50 border-red-100";
    case "warning":
      return "bg-yellow-50 border-yellow-100";
    case "info":
      return "bg-blue-50 border-blue-100";
  }
};

const Toast = ({
  message,
  variant = "info",
  duration = 3000,
  onClose,
  index = 0,
  heights = [],
  onHeightUpdate,
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  // Update height when content changes
  useEffect(() => {
    if (toastRef.current && onHeightUpdate) {
      const height = toastRef.current.offsetHeight;
      const currentHeight = toastRef.current.getAttribute("data-height");

      if (currentHeight !== height.toString()) {
        toastRef.current.setAttribute("data-height", height.toString());
        onHeightUpdate(height);
      }
    }
  }, [message, onHeightUpdate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Calculate position based on heights of previous toasts
  const bottom =
    SCREEN_PADDING +
    heights
      .slice(0, index)
      .reduce((sum, height) => sum + height + TOAST_GAP, 0);

  return createPortal(
    <div
      ref={toastRef}
      className={`fixed right-4 z-[200] flex w-96 transform items-start justify-between gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ${getBgColor(
        variant,
      )} ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
      style={{ bottom: `${bottom}px` }}
      role="alert"
    >
      <div className="flex min-h-[20px] items-start gap-3">
        <div className="mt-0.5">{getIcon(variant)}</div>
        <div className="flex-1 break-words">
          <p className="text-sm leading-5 text-gray-900 [overflow-wrap:anywhere]">
            {message}
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        className="ml-2 flex-shrink-0 rounded-full p-1 hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>,
    document.body,
  );
};

export default Toast;
