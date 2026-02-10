'use client';

import { cn } from '@/libs/utils';
import { InputHTMLAttributes, ReactNode, useRef, useState } from 'react';

export default function Input({
  label,
  icon,
  error,
  wrapperClassName,
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground/70 mb-2">
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'flex items-center gap-3 cursor-text bg-white text-foreground/40 border border-foreground/10 px-3 rounded-xl transition-all duration-200',
          isFocused && 'ring-2 ring-primary/40 ring-offset-2',
          error && 'border-red-500 ring-red-500/40',
          wrapperClassName
        )}
      >
        {icon && <span className="text-foreground/40">{icon}</span>}
        <input
          {...props}
          ref={inputRef}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            'bg-transparent outline-none text-sm text-foreground',
            'w-full py-2.5 placeholder:text-foreground/40'
          )}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  wrapperClassName?: string;
}
