import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-sans">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#FFFFFF] rounded-xl shadow-2xl border border-[#1A1A1A]/20 p-4 flex items-start gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-[#2D5A27] flex-shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-[#9B2C2C] flex-shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-4 h-4 text-[#1A1A1A] flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 mb-0.5">
              System Notification
            </div>
            <h5 className="font-serif text-sm font-normal italic text-[#1A1A1A] leading-tight">
              {toast.title}
            </h5>
            <p className="text-xs text-[#1A1A1A]/70 mt-1 leading-normal font-mono-code">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

