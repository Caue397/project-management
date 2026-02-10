'use client';

import { cn } from '@hale/components';
import {
  InputHTMLAttributes,
  ReactNode,
  useRef,
  useEffect,
  useState,
} from 'react';

export default function Input({ icon, keybinds, wrapperClassName, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keybind system
  useEffect(() => {
    if (!keybinds || keybinds.length === 0) return () => {};

    const handleKeyDown = (event: KeyboardEvent) => {
      const hasCtrl = keybinds.some((k) => k.bind === 'CTRL');
      const keyBind = keybinds.find((k) => k.bind !== 'CTRL');

      if (
        hasCtrl &&
        keyBind &&
        event.ctrlKey &&
        event.key.toLowerCase() === keyBind.key.toLowerCase()
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keybinds]);

  return (
    <div className="select-none w-full relative z-30">
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'flex items-center gap-3 cursor-text bg-white text-foreground/40 border border-foreground/10 px-3 rounded-xl transition-all duration-200',
          isFocused && 'ring-1 ring-blue/40 ring-offset-2',
          wrapperClassName
        )}
      >
        {icon}
        <input
          {...props}
          ref={inputRef}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'bg-transparent outline-none text-sm',
            'w-full py-2.5 placeholder:text-foreground/40'
          )}
        />

        <div className="flex items-center gap-1 pointer-events-none">
          {keybinds?.map((bind) => (
            <KeyBind bind={bind.bind} key={bind.key} />
          ))}
        </div>
      </div>
    </div>
  );
}

function KeyBind({ bind }: { bind: string }) {
  return (
    <div className="text-foreground/40 text-[10px] font-medium p-1 rounded-[4px] bg-foreground/5">
      {bind}
    </div>
  );
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  wrapperClassName?: string;
  keybinds?: {
    bind: string;
    key: string;
  }[];
}
