import { ReactNode } from 'react';
import { cn } from '@/libs/merge-classname';

type DialogFooterProps = {
  children: ReactNode;
  className?: string;
};

export function DialogFooter({ children, className }: DialogFooterProps) {
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
