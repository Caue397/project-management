import { cn } from '@/libs/merge-classname';

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

export function Spinner({ size = 'md', className }: LoaderProps) {
  return (
    <div
      className={cn(
        'rounded-full border-foreground/20 border-t-foreground/70 animate-spin',
        sizes[size],
        className,
      )}
    />
  );
}

export function Loader({ className }: Pick<LoaderProps, 'className'>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-foreground/40',
        className,
      )}
    >
      <Spinner size="lg" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-50">
      <Spinner size="lg" />
    </div>
  );
}
