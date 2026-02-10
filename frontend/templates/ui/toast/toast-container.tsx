'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast as toastManager, Toast as ToastType } from '@/lib/toast';
import Toast from './toast';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const remainingTimeRef = useRef<Record<string, number>>({});
  const startTimeRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((toast) => {
      setShouldRender(true);
      setToasts((prev) => {
        const newToasts = [...prev, toast];
        // Limita para 3 toasts
        return newToasts.slice(-3);
      });

      if (toast.duration) {
        remainingTimeRef.current[toast.id] = toast.duration;
        startTimeRef.current[toast.id] = Date.now();
        
        const timeoutId = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          delete timeoutsRef.current[toast.id];
          delete remainingTimeRef.current[toast.id];
          delete startTimeRef.current[toast.id];
        }, toast.duration);
        
        timeoutsRef.current[toast.id] = timeoutId;
      }
    });

    return () => {
      unsubscribe();
      // Limpa todos os timeouts ao desmontar
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  // Controla quando desmontar o container (após animação de saída)
  useEffect(() => {
    if (toasts.length === 0 && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Tempo da animação de saída
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toasts.length, shouldRender]);

  // Pausa/resume timeouts baseado no hover
  useEffect(() => {
    if (isHovered) {
      // Pausar todos os timeouts
      Object.keys(timeoutsRef.current).forEach((id) => {
        clearTimeout(timeoutsRef.current[id]);
        const elapsed = Date.now() - startTimeRef.current[id];
        remainingTimeRef.current[id] = Math.max(0, remainingTimeRef.current[id] - elapsed);
      });
    } else {
      // Retomar todos os timeouts
      Object.keys(remainingTimeRef.current).forEach((id) => {
        if (remainingTimeRef.current[id] > 0) {
          startTimeRef.current[id] = Date.now();
          
          const timeoutId = setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            delete timeoutsRef.current[id];
            delete remainingTimeRef.current[id];
            delete startTimeRef.current[id];
          }, remainingTimeRef.current[id]);
          
          timeoutsRef.current[id] = timeoutId;
        }
      });
    }
  }, [isHovered]);

  const handleClose = useCallback((id: string) => {
    // Limpa o timeout se existir
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
    
    delete remainingTimeRef.current[id];
    delete startTimeRef.current[id];
    
    setToasts((prev) => prev.filter((t) => t.id !== id));
    setHeights((prev) => {
      const newHeights = { ...prev };
      delete newHeights[id];
      return newHeights;
    });
  }, []);

  const handleHeightChange = useCallback((id: string, height: number) => {
    setHeights((prev) => {
      if (prev[id] === height) return prev;
      return { ...prev, [id]: height };
    });
  }, []);

  const getOffsetForIndex = (index: number) => {
    let offset = 0;
    for (let i = index + 1; i < toasts.length; i++) {
      const height = heights[toasts[i].id] || 60;
      offset += height + 8; // altura + gap de 8px
    }
    return offset;
  };

  const getContainerHeight = () => {
    if (toasts.length === 0) return 60; // Mantém altura mínima para animação de saída
    
    if (isHovered) {
      // Soma todas as alturas + gaps
      const totalHeight = toasts.reduce((acc, toast) => {
        return acc + (heights[toast.id] || 60) + 8;
      }, 0);
      return totalHeight - 8; // remove o último gap
    }
    
    // Quando não está em hover, altura do toast mais alto + pequeno espaço para stack
    const maxHeight = Math.max(...toasts.map(t => heights[t.id] || 60));
    return maxHeight + (toasts.length - 1) * 8;
  };

  if (!shouldRender && toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none">
      <div
        className="relative pointer-events-auto min-w-[320px] transition-all duration-300 py-2"
        style={{ height: getContainerHeight() + 16 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="sync">
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              toast={toast}
              index={index}
              totalToasts={toasts.length}
              isHovered={isHovered}
              onClose={handleClose}
              onHeightChange={handleHeightChange}
              hoverOffset={getOffsetForIndex(index)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}


