'use client';

import { createContext, useContext } from 'react';

type DialogContextType = {
  open: boolean;
  close: () => void;
};

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error('useDialogContext must be used within a Dialog');
  return context;
}
