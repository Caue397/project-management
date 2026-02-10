'use client';

import Button from '@/components/ui/button';
import { cn } from '@/libs/utils';
import { LuPlus, LuFolder, LuClock, LuCircleCheck, LuArchive } from 'react-icons/lu';

const mockProjects = [
  {
    id: 'projeto-1',
    name: 'Website Redesign',
    description: 'Redesign completo do website institucional',
    status: 'IN_PROGRESS',
    createdAt: '2024-01-15',
  },
  {
    id: 'projeto-2',
    name: 'Mobile App',
    description: 'Desenvolvimento do aplicativo mobile',
    status: 'CREATED',
    createdAt: '2024-01-20',
  },
  {
    id: 'projeto-3',
    name: 'API Integration',
    description: 'Integracao com APIs externas',
    status: 'DONE',
    createdAt: '2024-01-10',
  },
  {
    id: 'projeto-4',
    name: 'Documentation',
    description: 'Documentacao tecnica do projeto',
    status: 'ARCHIVED',
    createdAt: '2024-01-05',
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  CREATED: {
    label: 'Novo',
    color: 'bg-gray-100 text-gray-600',
    icon: <LuFolder size={14} />,
  },
  IN_PROGRESS: {
    label: 'Em andamento',
    color: 'bg-blue-100 text-blue-600',
    icon: <LuClock size={14} />,
  },
  DONE: {
    label: 'Concluido',
    color: 'bg-green-100 text-green-600',
    icon: <LuCircleCheck size={14} />,
  },
  ARCHIVED: {
    label: 'Arquivado',
    color: 'bg-foreground/10 text-foreground/50',
    icon: <LuArchive size={14} />,
  },
};

export default function WorkspacePage() {
  return (
    <div className="p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Gerencie todos os projetos da sua workspace
          </p>
        </div>
        <Button>
          <LuPlus size={18} />
          Novo Projeto
        </Button>
      </header>

      <div className="bg-white rounded-2xl border border-foreground/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground/50 uppercase tracking-wider">
                Projeto
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground/50 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-foreground/50 uppercase tracking-wider">
                Criado em
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-foreground/50 uppercase tracking-wider">
                Acoes
              </th>
            </tr>
          </thead>
          <tbody>
            {mockProjects.map((project, index) => {
              const status = statusConfig[project.status];
              return (
                <tr
                  key={project.id}
                  className={cn(
                    'border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors',
                    index === mockProjects.length - 1 && 'border-b-0'
                  )}
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-sm text-foreground/50">{project.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                        status.color
                      )}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground/60">
                    {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      Ver detalhes
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
