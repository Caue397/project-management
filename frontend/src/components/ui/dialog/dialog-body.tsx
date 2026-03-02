import { ReactNode } from 'react';
import { cn } from '@/libs/merge-classname';

type DialogBodyProps = {
  children: ReactNode;
  className?: string;
};

export function DialogBody({ children, className }: DialogBodyProps) {
  return (
    <div className={cn('p-4 overflow-y-auto', className)}>{children}</div>
  );
}
