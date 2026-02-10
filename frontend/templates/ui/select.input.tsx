'use client';

import { cn } from '@hale/components';
import { useClickAway } from '@uidotdev/usehooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { LuChevronDown, LuCircleCheck } from 'react-icons/lu';

export default function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  initialValue,
  triggerClassname,
  labelClassname,
  optionsClassname,
  maxHeight = 300,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [shouldScroll, setShouldScroll] = useState(false);
  const awayRef = useClickAway<HTMLDivElement>(() => setOpen(false));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    initialValue
  );

  // Atualiza o valor interno apenas quando o initialValue mudar
  useEffect(() => {
    setInternalValue(initialValue);
  }, [initialValue]);

  const selectedValue = isControlled ? value : internalValue;
  const selectedOption =
    options?.find((option) => option.value === selectedValue) || null;

  useEffect(() => {
    if (!shouldScroll) return;
    if (highlightedIndex < 0) return;
    if (!optionRefs.current[highlightedIndex]) return;
    if (!dropdownRef.current) return;

    const element = optionRefs.current[highlightedIndex];
    const container = dropdownRef.current;

    const elementTop = element.offsetTop;
    const elementBottom = elementTop + element.offsetHeight;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    if (elementTop < containerTop) {
      container.scrollTo({
        top: Math.max(0, elementTop - 10),
        behavior: 'smooth',
      });
    } else if (elementBottom > containerBottom) {
      container.scrollTo({
        top: elementBottom - container.clientHeight + 10,
        behavior: 'smooth',
      });
    }
  }, [highlightedIndex, shouldScroll]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setShouldScroll(true);
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setShouldScroll(true);
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
          );
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            const nextValue = options[highlightedIndex].value;
            if (!isControlled) {
              setInternalValue(nextValue);
            }
            onChange?.(options[highlightedIndex].label, nextValue);
            setOpen(false);
            setHighlightedIndex(-1);
          }
          break;

        case 'Escape':
          setOpen(false);
          setHighlightedIndex(-1);
          break;

        default:
          if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            const letter = e.key.toLowerCase();
            const startIndex = highlightedIndex >= 0 ? highlightedIndex : -1;

            let nextIndex = options.findIndex(
              (option, i) =>
                i > startIndex && option.label.toLowerCase().startsWith(letter)
            );

            if (nextIndex === -1) {
              nextIndex = options.findIndex((option) =>
                option.label.toLowerCase().startsWith(letter)
              );
            }

            if (nextIndex !== -1) {
              setShouldScroll(true);
              setHighlightedIndex(nextIndex);
            }
          }
          break;
      }
    },
    [open, options, highlightedIndex, onChange, isControlled]
  );

  return (
    <div className="relative select-none w-full" ref={awayRef}>
      <p
        className={cn(
          'text-xs text-start font-medium text-foreground/70 mb-2',
          labelClassname
        )}
      >
        {label}
      </p>

      <div
        onClick={() => {
          setOpen(!open);
          if (!open) {
            setHighlightedIndex(-1);
            setShouldScroll(false);
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'p-2 rounded-lg h-[35px] cursor-pointer flex items-center',
          'justify-between border border-foreground/10 bg-foreground/[0.03]',
          'focus:outline-none focus:ring-1 ring-offset-2 focus:ring-blue-500/20',
          triggerClassname
        )}
        tabIndex={0}
      >
        <p
          className={cn(
            'text-sm font-medium',
            selectedOption ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </p>
        <LuChevronDown size={16} className="text-foreground/60" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            style={{ maxHeight: `${maxHeight}px` }}
            className={cn(
              'w-full absolute overflow-y-auto rounded-lg p-1.5 top-16 border border-foreground/10 bg-neutral-100 z-50',
              optionsClassname
            )}
          >
            <div className="flex flex-col gap-1">
              {options?.map((option, index) => (
                <div
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  className={cn(
                    'p-1.5 cursor-pointer hover:bg-foreground/[0.02] font-medium rounded-lg text-sm flex items-center justify-between transition-colors',
                    option.value === selectedValue && 'bg-foreground/[0.02]',
                    highlightedIndex === index &&
                      'bg-blue-500/10 ring-1 ring-offset-2 ring-blue-500/20'
                  )}
                  onClick={() => {
                    if (!isControlled) {
                      setInternalValue(option.value);
                    }
                    onChange?.(option.label, option.value);
                    setOpen(false);
                    setHighlightedIndex(-1);
                  }}
                  onMouseEnter={() => {
                    setShouldScroll(false);
                    setHighlightedIndex(index);
                  }}
                  onMouseLeave={() => setShouldScroll(false)}
                >
                  {option.label}
                  {option.value === selectedValue && (
                    <LuCircleCheck size={16} className="text-blue" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Props = {
  label: string | React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (name: string, value: string) => void;
  initialValue?: string;
  options: {
    label: string;
    value: string;
  }[];
  triggerClassname?: string;
  labelClassname?: string;
  optionsClassname?: string;
  maxHeight?: number;
};
