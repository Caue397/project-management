import Button from '@/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ErrorPageProps {
  title?: string;
  description?: string;
  hint?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

export default function ErrorPage({
  title = 'Algo deu errado',
  description = 'Ocorreu um erro inesperado.',
  hint,
  icon,
  action = { label: 'Voltar ao início', href: '/' },
}: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-foreground/10 p-10 flex flex-col items-center text-center gap-6">
        {icon && (
          <div className="w-14 h-14 rounded-2xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center text-foreground/40">
            {icon}
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-foreground/60">{description}</p>
          {hint && (
            <p className="text-xs text-foreground/40 mt-1">{hint}</p>
          )}
        </div>

        {action && (
          <Link href={action.href}>
            <Button variant="secondary" size="md">
              {action.label}
            </Button>
          </Link>
        )}
      </div>
    </main>
  );
}
