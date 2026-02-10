'use client';

import { motion } from 'framer-motion';
import { X, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { Toast as ToastType } from '@/lib/toast';
import { useEffect, useRef } from 'react';

interface ToastProps {
  toast: ToastType;
  index: number;
  totalToasts: number;
  isHovered: boolean;
  onClose: (id: string) => void;
  onHeightChange: (id: string, height: number) => void;
  hoverOffset: number;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: 'text-green-500',
    text: 'text-green-900',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    text: 'text-red-900',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue',
    text: 'text-blue-900',
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    text: 'text-yellow-900',
  },
};

export default function Toast({
  toast,
  index,
  totalToasts,
  isHovered,
  onClose,
  onHeightChange,
  hoverOffset,
}: ToastProps) {
  const Icon = icons[toast.type];
  const colorScheme = colors[toast.type];
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toastRef.current) {
      const height = toastRef.current.offsetHeight;
      onHeightChange(toast.id, height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id, toast.description]);

  // index 0 = mais antigo (primeiro no array)
  // index totalToasts-1 = mais novo (último no array)
  // Queremos que o mais novo fique em cima
  const stackIndex = totalToasts - 1 - index;

  const getTransform = () => {
    if (isHovered) {
      return -hoverOffset;
    }
    // Toasts mais antigos ficam atrás (valores negativos menores)
    if (stackIndex === 0) return 0; // mais novo fica sem offset
    return -(stackIndex * 8);
  };

  const getScale = () => {
    if (isHovered) return 1;
    // Mais novo (stackIndex 0) fica maior
    if (stackIndex === 0) return 1;
    if (stackIndex === 1) return 0.95;
    if (stackIndex === 2) return 0.9;
    return 0.85;
  };

  const getOpacity = () => {
    if (isHovered) return 1;
    // Sempre retorna 1 para evitar problemas
    return 1;
  };

  return (
    <motion.div
      ref={toastRef}
      initial={{ opacity: 0, y: 50, scale: 0.85, x: 100 }}
      animate={{
        opacity: getOpacity(),
        y: getTransform(),
        scale: getScale(),
        x: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.85,
        x: 100,
        transition: {
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 35,
        mass: 0.8,
      }}
      style={{
        zIndex: index, // index maior = mais recente = z-index maior
        position: 'absolute',
        bottom: 0,
        right: 0,
      }}
      className={`
        pointer-events-auto flex items-center gap-2 px-3 py-3 rounded-2xl border
        min-w-[320px] max-w-[420px] backdrop-blur-sm bg-light hale-shadow hale-smooth
      `}
    >
      <Icon className={`${colorScheme.icon} flex-shrink-0 mt-0.5`} size={20} />

      <div className="flex-1 min-w-0 -space-y-0.5">
        <p className="text-sm font-semibold text-black">{toast.title}</p>
        {toast.description && (
          <p className="text-xs font-medium text-foreground/60 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className={`text-black/70 hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}
