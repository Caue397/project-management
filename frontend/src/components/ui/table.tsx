import { cn } from '@/libs/merge-classname';
import { ReactNode } from 'react';

export function Table({ children, className }: SimpleProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-foreground/10 overflow-hidden', className)}>
      <table className="w-full">{children}</table>
    </div>
  );
}

export function TableHead({ children, className }: SimpleProps) {
  return (
    <thead>
      <tr className={cn('border-b border-foreground/10 bg-white', className)}>
        {children}
      </tr>
    </thead>
  );
}

export function TableHeader({ children, className, align = 'left' }: TableHeaderProps) {
  return (
    <th
      className={cn(
        'py-3 px-4 text-xs font-medium text-foreground/50 uppercase tracking-wider',
        align === 'right' ? 'text-right' : 'text-left',
        className
      )}
    >
      <span className={cn('inline-flex items-center gap-1.5', align === 'right' && 'justify-end')}>
        {children}
      </span>
    </th>
  );
}

export function TableBody({ children, className }: SimpleProps) {
  return <tbody className={cn('bg-foreground/4', className)}>{children}</tbody>;
}

export function TableRow({ children, className, isLast }: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-foreground/10',
        isLast && 'border-b-0',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className, align = 'left' }: TableCellProps) {
  return (
    <td
      className={cn(
        'py-4 px-4',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </td>
  );
}

type SimpleProps = {
  children: ReactNode;
  className?: string;
};

type TableHeaderProps = SimpleProps & {
  align?: 'left' | 'right';
};

type TableCellProps = SimpleProps & {
  align?: 'left' | 'right';
};

type TableRowProps = SimpleProps & {
  isLast?: boolean;
};
