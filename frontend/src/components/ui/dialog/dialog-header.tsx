import { ReactNode } from 'react';
import { cn } from '@/libs/merge-classname';

type DialogHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function DialogHeader({ children, className }: DialogHeaderProps) {
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
