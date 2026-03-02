'use client';

import { ReactNode, useEffect } from 'react';
import { DialogContext } from './context';

type DialogProps = {
  children: ReactNode;
  open: boolean;
  close: () => void;
};

export function Dialog({ children, open, close }: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = open ? 'hidden' : 'auto';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [open, close]);

  return (
    <DialogContext.Provider value={{ open, close }}>
      {children}
    </DialogContext.Provider>
  );
}
