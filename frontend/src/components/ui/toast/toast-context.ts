'use client';

import { createContext, useContext } from 'react';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastData, 'id'>) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
