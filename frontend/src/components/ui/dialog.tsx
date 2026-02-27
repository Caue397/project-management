'use client';

import { createContext, ReactNode, useContext, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/libs/merge-classname';
import { useClickAway } from '@uidotdev/usehooks';

type DialogContextType = {
  open: boolean;
  close: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error('useDialogContext must be used within a DialogProvider');
  return context;
}

export function Dialog({ children, open, close }: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);

    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

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

export function DialogContent({
  children,
  className,
  insideClassName,
}: DialogContentProps) {
  const { open, close } = useDialogContext();
  const ref = useClickAway<HTMLDivElement>(close);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={cn(
            'fixed inset-0 isolate z-50 backdrop-blur-md bg-black/30 flex items-center justify-center p-4',
            className
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            ref={ref}
            className={cn(
              'border max-h-[90vh] w-full max-w-md border-foreground/10 rounded-2xl bg-white overflow-hidden',
              insideClassName
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({ children, className }: SimpleProps) {
  return (
    <div
      className={cn(
        'p-4 bg-foreground/[0.03] border-b border-foreground/10',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogBody({ children, className }: SimpleProps) {
  return (
    <div className={cn('p-4 overflow-y-auto', className)}>{children}</div>
  );
}

export function DialogFooter({ children, className }: SimpleProps) {
  return (
    <div
      className={cn(
        'p-4 border-t border-foreground/10 flex items-center justify-end gap-2',
        className
      )}
    >
      {children}
    </div>
  );
}

type SimpleProps = {
  children: ReactNode;
  className?: string;
};

type DialogContentProps = SimpleProps & {
  insideClassName?: string;
};

type DialogProps = {
  children: ReactNode;
  open: boolean;
  close: () => void;
};
