'use client';

import { cn } from '@hale/components';
import { InputHTMLAttributes, useRef } from 'react';
import { LuCheck } from 'react-icons/lu';

export default function Checkbox({ ...props }: Props) {
  const { theme, label, icon, className, checked, onChange, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex items-center gap-2 cursor-pointer select-none ',
        className
      )}
    >
      <div
        className={cn(
          'relative flex items-center text-wrap justify-center w-4 h-4 rounded border transition-all duration-200 bg-transparent',
          themes[theme],
          checked && checkedThemes[theme]
        )}
      >
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          {...rest}
          className="sr-only"
        />
        {checked && (
          <LuCheck 
            size={12} 
            strokeWidth={3}
            className={cn(
              'transition-all duration-200',
              checkIconThemes[theme]
            )} 
          />
        )}
      </div>
      
      {icon && <span className="flex items-center">{icon}</span>}
      
      {label && (
        <span 
          className={cn(
            'text-sm w-max font-medium transition-colors duration-200 text-foreground/50',
          )}
        > 
          {label}
        </span>
      )}
    </div>
  );
}

const themes: Record<Props['theme'], string> = {
  orange: 'border-orange/50 hover:border-orange hover:bg-orange/10',
  blue: 'border-blue/50 hover:border-blue hover:bg-blue/10',
  black: 'border-black/50 hover:border-black hover:bg-black/10',
};

const checkedThemes: Record<Props['theme'], string> = {
  orange: 'border-orange bg-orange/20',
  blue: 'border-blue bg-blue/20',
  black: 'border-black bg-black/20',
};

const checkIconThemes: Record<Props['theme'], string> = {
  orange: 'text-orange',
  blue: 'text-blue',
  black: 'text-black',
};

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  icon?: React.ReactNode;
  theme: 'orange' | 'blue' | 'black';
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
