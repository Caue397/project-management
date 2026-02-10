'use client';

import { cn } from '@/libs/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium transition-all duration-200 rounded-xl flex items-center justify-center gap-2',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-white text-foreground border border-foreground/10 hover:bg-foreground/[0.03]',
  ghost: 'bg-transparent text-foreground hover:bg-foreground/[0.03]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
