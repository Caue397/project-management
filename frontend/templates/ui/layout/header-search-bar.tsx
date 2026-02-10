'use client';

import { useAction } from '@/store/action.store';
import { cn, CommonButton } from '@hale/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { LuSave, LuSearch } from 'react-icons/lu';

interface HeaderSearchBarProps {
  onSearchSubmit?: (search: string) => void;
}

export default function HeaderSearchBar({
  onSearchSubmit,
}: HeaderSearchBarProps) {
  const [search, setSearch] = useState('');
  const { actions, run } = useAction();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchSubmit?.(search.trim());
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search, onSearchSubmit]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearchSubmit?.(search.trim());
    }
  };

  useEffect(() => {
    console.log(actions);
  }, [actions]);

  return (
    <div className="hidden lg:flex items-center w-full max-w-xl">
      <div className="relative w-full">
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex items-center gap-3 cursor-text bg-white text-foreground/40 border border-foreground/10 px-3 rounded-xl"
        >
          <LuSearch size={18} />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="Search"
            className={cn(
              'bg-transparent outline-none text-sm',
              'w-full py-2 placeholder:text-foreground/40'
            )}
          />
          <div className="flex items-center gap-1">
            <KeyBind bind="CTRL" />
            <KeyBind bind="K" />
          </div>
        </div>
      </div>

      <div className="flex self-stretch">
        <AnimatePresence>
          {actions[0] && (
            <motion.div
              key={actions[0].id}
              initial={{
                opacity: 0,
                width: 0,
                marginLeft: 0,
              }}
              animate={{
                opacity: 1,
                width: 'auto',
                marginLeft: '12px',
              }}
              exit={{
                opacity: 0,
                width: 0,
                marginLeft: 0,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap h-full',
                'bg-white text-foreground/40 border border-foreground/10 rounded-xl',
                'text-sm font-medium overflow-hidden'
              )}
            >
              <CommonButton
                loading={actions[0].loading || actions[0].executed}
                state={actions[0].state}
                icon={<LuSave size={14} />}
                className="w-full h-full !text-xs font-medium"
                onClick={() => run(actions[0].id)}
              >
                {actions[0].name}
              </CommonButton>
            </motion.div>
          )}
        </AnimatePresence>
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
