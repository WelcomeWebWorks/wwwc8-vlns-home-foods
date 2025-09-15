"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiX, FiShoppingCart } from "react-icons/fi";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto close after duration
    const closeTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck className="w-5 h-5" />;
      case "error":
        return <FiX className="w-5 h-5" />;
      case "info":
        return <FiShoppingCart className="w-5 h-5" />;
      default:
        return <FiCheck className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-primary text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transform transition-all duration-300 ease-in-out ${
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div
        className={`${getColors()} px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] backdrop-blur-sm border border-white/20`}
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Manager Component
interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

let toastCounter = 0;

export const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent<Omit<ToastData, 'id'>>) => {
      toastCounter += 1;
      const newToast = {
        ...event.detail,
        id: `toast-${toastCounter}-${Date.now()}`,
      };
      setToasts(prev => [...prev, newToast]);
    };

    window.addEventListener('showToast', handleShowToast as EventListener);

    return () => {
      window.removeEventListener('showToast', handleShowToast as EventListener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 z-[9999] p-4 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 9999 - index
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Helper function to show toast
export const showToast = (message: string, type: "success" | "error" | "info" = "success", duration = 3000) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('showToast', {
      detail: { message, type, duration }
    });
    window.dispatchEvent(event);
  }
};
