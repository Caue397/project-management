'use client';

import Button from '@/components/ui/button';
import { cn } from '@/libs/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  LuArrowLeft,
  LuFolder,
  LuClock,
  LuCircleCheck,
  LuArchive,
  LuChevronRight,
} from 'react-icons/lu';

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode; next?: string }
> = {
  CREATED: {
    label: 'Novo',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: <LuFolder size={16} />,
    next: 'IN_PROGRESS',
  },
  IN_PROGRESS: {
    label: 'Em andamento',
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    icon: <LuClock size={16} />,
    next: 'DONE',
  },
  DONE: {
    label: 'Concluido',
    color: 'bg-green-100 text-green-600 border-green-200',
    icon: <LuCircleCheck size={16} />,
    next: 'ARCHIVED',
  },
  ARCHIVED: {
    label: 'Arquivado',
    color: 'bg-foreground/10 text-foreground/50 border-foreground/20',
    icon: <LuArchive size={16} />,
  },
};

const mockProject = {
  id: 'projeto-1',
  name: 'Website Redesign',
  description:
    'Redesign completo do website institucional da empresa, incluindo nova identidade visual, melhoria de UX e otimizacao de performance.',
  status: 'IN_PROGRESS',
  createdAt: '2024-01-15',
  updatedAt: '2024-01-28',
};

export default function ProjectPage() {
  const params = useParams();
  const workspace = params.workspace as string;
  const currentStatus = statusConfig[mockProject.status];
  const nextStatus = currentStatus.next
    ? statusConfig[currentStatus.next]
    : null;

  return (
    <div className="p-6 lg:p-8">
      <Link
        href={`/${workspace}`}
        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-6 transition-colors"
      >
        <LuArrowLeft size={16} />
        Voltar para projetos
      </Link>

      <div className="bg-white rounded-2xl border border-foreground/10 overflow-hidden">
        <div className="p-6 border-b border-foreground/10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {mockProject.name}
              </h1>
              <p className="text-sm text-foreground/60 mt-1">
                Criado em{' '}
                {new Date(mockProject.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border',
                currentStatus.color
              )}
            >
              {currentStatus.icon}
              {currentStatus.label}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-2">
              Descricao
            </h2>
            <p className="text-foreground">{mockProject.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-2">
                Data de criacao
              </h2>
              <p className="text-foreground">
                {new Date(mockProject.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-2">
                Ultima atualizacao
              </h2>
              <p className="text-foreground">
                {new Date(mockProject.updatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {nextStatus && (
            <div className="pt-4 border-t border-foreground/10">
              <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-3">
                Alterar status
              </h2>
              <Button variant="secondary">
                Mover para {nextStatus.label}
                <LuChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
