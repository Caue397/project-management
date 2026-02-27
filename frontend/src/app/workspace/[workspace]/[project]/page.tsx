'use client';

import Button from '@/components/ui/button';
import { cn } from '@/libs/merge-classname';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { projectQuery } from '@/network/queries/project';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
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
    label: 'Concluído',
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

export default function ProjectPage() {
  const { workspace, project: projectId } = useParams<{ workspace: string; project: string }>();
  const queryClient = useQueryClient();

  const { data: project } = useSuspenseQuery(projectQuery(workspace, projectId));

  const currentStatus = statusConfig[project.status];
  const nextStatus = currentStatus?.next ? statusConfig[currentStatus.next] : null;

  const { loading, exec } = usePromiseStatus(async () => {
    if (!currentStatus?.next) return;
    await network.put(`/project/${workspace}/${projectId}`, {
      title: project.title,
      status: currentStatus.next,
    });
    await queryClient.invalidateQueries({ queryKey: ['project', workspace, projectId] });
    await queryClient.invalidateQueries({ queryKey: ['projects', workspace] });
  });

  return (
    <div className="p-6 max-w-container mx-auto lg:p-8">
      <Link
        href={`/workspace/${workspace}`}
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
                {project.title}
              </h1>
              <p className="text-sm text-foreground/60 mt-1">
                Criado em{' '}
                {new Date(project.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border',
                currentStatus?.color
              )}
            >
              {currentStatus?.icon}
              {currentStatus?.label}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {project.description && (
            <div>
              <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-2">
                Descrição
              </h2>
              <p className="text-foreground">{project.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-2">
                Data de criação
              </h2>
              <p className="text-foreground">
                {new Date(project.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-2">
                Última atualização
              </h2>
              <p className="text-foreground">
                {new Date(project.updatedAt).toLocaleDateString('pt-BR', {
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
              <Button variant="secondary" onClick={() => exec()} disabled={loading}>
                {loading ? 'Atualizando...' : `Mover para ${nextStatus.label}`}
                {!loading && <LuChevronRight size={16} />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
