'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LuChevronDown, LuCheck } from 'react-icons/lu';
import { cn } from '@/libs/merge-classname';

export type DropdownOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type DropdownProps = {
  options: DropdownOption[];
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export default function Dropdown({
  options,
  value,
  initialValue,
  onChange,
  placeholder = 'Selecione...',
  label,
  icon,
  disabled = false,
  error,
  className,
}: DropdownProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    initialValue,
  );
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Needed to avoid SSR mismatch when calling createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isControlled) setInternalValue(initialValue);
  }, [initialValue, isControlled]);

  const selectedValue = isControlled ? value : internalValue;
  const selectedOption = options.find((o) => o.value === selectedValue) ?? null;

  // Scroll the highlighted option into view inside the list
  useEffect(() => {
    if (!shouldScroll || highlightedIndex < 0) return;
    const el = optionRefs.current[highlightedIndex];
    const container = listRef.current;
    if (!el || !container) return;

    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const cTop = container.scrollTop;
    const cBottom = cTop + container.clientHeight;

    if (elTop < cTop) {
      container.scrollTo({ top: Math.max(0, elTop - 8), behavior: 'smooth' });
    } else if (elBottom > cBottom) {
      container.scrollTo({
        top: elBottom - container.clientHeight + 8,
        behavior: 'smooth',
      });
    }
  }, [highlightedIndex, shouldScroll]);

  // Close when clicking outside both the trigger and the portal panel
  useEffect(() => {
    if (!open) return;

    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
      setHighlightedIndex(-1);
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  // Keep panel aligned with trigger on scroll or resize
  useEffect(() => {
    if (!open) return;

    function reposition() {
      updatePosition();
    }

    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open]);

  function updatePosition() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelStyle({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  }

  function select(option: DropdownOption) {
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
    setHighlightedIndex(-1);
  }

  function toggle() {
    if (disabled) return;
    if (!open) {
      updatePosition();
      setHighlightedIndex(-1);
    }
    setOpen((prev) => !prev);
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (!open) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          updatePosition();
          setOpen(true);
          setHighlightedIndex(0);
          setShouldScroll(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setShouldScroll(true);
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setShouldScroll(true);
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1,
          );
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            select(options[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          setHighlightedIndex(-1);
          break;
        default:
          if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            const letter = e.key.toLowerCase();
            const start = highlightedIndex >= 0 ? highlightedIndex : -1;
            let next = options.findIndex(
              (o, i) => i > start && o.label.toLowerCase().startsWith(letter),
            );
            if (next === -1) {
              next = options.findIndex((o) =>
                o.label.toLowerCase().startsWith(letter),
              );
            }
            if (next !== -1) {
              setShouldScroll(true);
              setHighlightedIndex(next);
            }
          }
          break;
      }
    },
    [disabled, open, options, highlightedIndex],
  );

  return (
    <div className={cn('relative w-full select-none', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground/70 mb-2">
          {label}
        </label>
      )}

      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border cursor-pointer',
          'bg-white text-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40',
          open
            ? 'border-primary/40 ring-2 ring-offset-2 ring-primary/40'
            : 'border-foreground/10 hover:border-foreground/20',
          error && 'border-red-500 ring-2 ring-red-500/30',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        )}
      >
        {(icon || selectedOption?.icon) && (
          <span className="text-foreground/40 shrink-0">
            {selectedOption?.icon ?? icon}
          </span>
        )}

        <span
          className={cn(
            'flex-1 text-left truncate',
            selectedOption ? 'text-foreground' : 'text-foreground/40',
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-foreground/40 shrink-0"
        >
          <LuChevronDown size={16} />
        </motion.span>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={panelRef}
                role="listbox"
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: panelStyle.top,
                  left: panelStyle.left,
                  width: panelStyle.width,
                }}
                className="z-[9999] bg-white border border-foreground/10 rounded-xl shadow-lg overflow-hidden"
              >
                <div
                  ref={listRef}
                  className="p-1.5 flex flex-col gap-0.5 max-h-[240px] overflow-y-auto"
                >
                  {options.map((option, index) => {
                    const isSelected = option.value === selectedValue;
                    const isHighlighted = highlightedIndex === index;

                    return (
                      <div
                        key={option.value}
                        ref={(el) => {
                          optionRefs.current[index] = el;
                        }}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => select(option)}
                        onMouseEnter={() => {
                          setShouldScroll(false);
                          setHighlightedIndex(index);
                        }}
                        onMouseLeave={() => setShouldScroll(false)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                          isSelected
                            ? 'bg-primary/[0.08] text-primary font-medium'
                            : 'text-foreground/70',
                          isHighlighted &&
                            !isSelected &&
                            'bg-foreground/[0.04] text-foreground',
                        )}
                      >
                        {option.icon && (
                          <span className="shrink-0">{option.icon}</span>
                        )}
                        <span className="flex-1 truncate">{option.label}</span>
                        {isSelected && (
                          <LuCheck size={14} className="shrink-0 text-primary" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0, height: 0, filter: 'blur(4px)', y: -4 }}
            animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, height: 0, filter: 'blur(4px)', y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
