'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickAway } from '@uidotdev/usehooks';
import { cn } from '@/libs/merge-classname';
import { useDialogContext } from './context';

type DialogContentProps = {
  children: ReactNode;
  className?: string;
  insideClassName?: string;
};

export function DialogContent({ children, className, insideClassName }: DialogContentProps) {
  const { open, close } = useDialogContext();
  const ref = useClickAway<HTMLDivElement>(close);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
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
    </AnimatePresence>,
    document.body
  );
}
