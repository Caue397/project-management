'use client';

import { ReactNode, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LuCircleCheck, LuCircleX, LuTriangleAlert, LuX } from 'react-icons/lu';
import { cn } from '@/libs/merge-classname';
import { ToastContext, ToastData } from './toast-context';

const typeConfig = {
  success: {
    icon: <LuCircleCheck size={18} />,
    borderClass: 'border-l-green-500',
    iconClass: 'text-green-500',
  },
  error: {
    icon: <LuCircleX size={18} />,
    borderClass: 'border-l-red-500',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: <LuTriangleAlert size={18} />,
    borderClass: 'border-l-yellow-500',
    iconClass: 'text-yellow-500',
  },
};

function Toast({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  const config = typeConfig[toast.type];
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'flex items-start gap-3 bg-white border border-foreground/10 border-l-4 rounded-xl shadow-lg p-4 w-80',
        config.borderClass
      )}
    >
      <span className={cn('mt-0.5 shrink-0', config.iconClass)}>{config.icon}</span>
      <p className="text-sm text-foreground flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="shrink-0 text-foreground/40 hover:text-foreground/70 transition-colors cursor-pointer"
      >
        <LuX size={16} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function addToast(toast: Omit<ToastData, 'id'>) {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
              {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                  <Toast toast={toast} onClose={() => removeToast(toast.id)} />
                </div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
