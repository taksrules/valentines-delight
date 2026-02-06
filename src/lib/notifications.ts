import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Crown, 
  Sparkles 
} from 'lucide-react';
import React from 'react';

/**
 * Professional branded notification utility using Sonner
 */

export const showSuccess = (message: string, description?: string) => {
  return toast.success(message, {
    description,
    duration: 4000,
    className: 'group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-white group-[.toaster]:border-[#2d2d2d] group-[.toaster]:rounded-[12px] group-[.toaster]:shadow-xl',
  });
};

export const showError = (message: string, description?: string) => {
  return toast.error(message, {
    description,
    duration: 5000,
    className: 'group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-white group-[.toaster]:border-[#2d2d2d] group-[.toaster]:rounded-[12px] group-[.toaster]:shadow-xl border-l-4 border-l-rose-500',
  });
};

export const showWarning = (message: string, description?: string) => {
  return toast.warning(message, {
    description,
    duration: 4000,
  });
};

export const showInfo = (message: string, description?: string) => {
  return toast.info(message, {
    description,
    duration: 4000,
  });
};

export const showUpgradePrompt = (message: string, onUpgrade?: () => void, onHome?: () => void) => {
  return toast('Limit reached!', {
    description: message || 'You\'ve reached the free tier limit. Upgrade for unlimited journeys.',
    duration: 15000,
    icon: React.createElement(Crown, { className: "w-5 h-5 text-rose-500" }),
    action: {
      label: 'Upgrade',
      onClick: () => onUpgrade?.(),
    },
    cancel: onHome ? {
      label: 'Dashboard',
      onClick: () => onHome(),
    } : undefined,
    className: 'group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-white group-[.toaster]:border-[#2d2d2d] group-[.toaster]:rounded-[12px] group-[.toaster]:shadow-xl border-rose-500/20',
  });
};

export const showSpecialMoment = (message: string, description?: string) => {
  return toast(message, {
    description,
    duration: 5000,
    icon: React.createElement(Sparkles, { className: "w-5 h-5 text-yellow-400" }),
    className: 'group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-white group-[.toaster]:border-[#2d2d2d] group-[.toaster]:rounded-[12px] group-[.toaster]:shadow-xl',
  });
};

export const showLoadingPromise = async <T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
) => {
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    className: 'group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-white group-[.toaster]:border-[#2d2d2d] group-[.toaster]:rounded-[12px] group-[.toaster]:shadow-xl',
  });
  return promise;
};
