'use client';

import { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  LuPlus,
  LuFolder,
  LuClock,
  LuCircleCheck,
  LuArchive,
  LuFileText,
  LuCircleDot,
  LuCalendar,
  LuMousePointerClick,
  LuEye,
  LuPencil,
  LuTrash2,
} from 'react-icons/lu';
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { cn } from '@/libs/merge-classname';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { workspaceQuery } from '@/network/queries/workspace';
import { projectsQuery } from '@/network/queries/project';
import { CreateProjectForm, createProjectSchema } from '@/schemas/project-schema';

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
    label: 'Concluído',
    color: 'bg-green-100 text-green-600',
    icon: <LuCircleCheck size={14} />,
  },
  ARCHIVED: {
    label: 'Arquivado',
    color: 'bg-foreground/10 text-foreground/50',
    icon: <LuArchive size={14} />,
  },
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function WorkspacePage() {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: workspace } = useSuspenseQuery(workspaceQuery(slug));
  const { data: projects } = useSuspenseQuery(projectsQuery(slug));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { title: '', description: '' },
  });

  const { loading, exec } = usePromiseStatus(async (data: CreateProjectForm) => {
    await network.post(`/project/${slug}`, data);
    await queryClient.invalidateQueries({ queryKey: ['projects', slug] });
    reset();
    setIsOpen(false);
  });

  function onSubmit(data: CreateProjectForm) {
    exec(data);
  }

  return (
    <div className="p-6 max-w-container mx-auto lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{workspace.name}</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Gerencie todos os projetos da sua workspace
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <LuPlus size={18} />
          Novo Projeto
        </Button>
      </header>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center text-foreground/30 mb-4">
            <LuFileText size={24} />
          </div>
          <p className="text-sm font-medium text-foreground/60">Nenhum projeto encontrado</p>
          <p className="text-xs text-foreground/40 mt-1">
            Crie seu primeiro projeto para começar
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableHeader><LuFileText size={14} /> Projeto</TableHeader>
            <TableHeader><LuCircleDot size={14} /> Status</TableHeader>
            <TableHeader><LuCalendar size={14} /> Criado em</TableHeader>
            <TableHeader><LuClock size={14} /> Atualizado em</TableHeader>
            <TableHeader><LuMousePointerClick size={14} /> Ações</TableHeader>
          </TableHead>
          <TableBody>
            {projects.map((project: Project, index: number) => {
              const status = statusConfig[project.status];
              return (
                <TableRow key={project.id} isLast={index === projects.length - 1}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{project.title}</p>
                      {project.description && (
                        <p className="text-sm text-foreground/50">{project.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                        status?.color
                      )}
                    >
                      {status?.icon}
                      {status?.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/60">
                    {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-sm text-foreground/60">
                    {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link href={`/workspace/${slug}/${project.id}`}>
                        <Button variant="ghost" size="sm" className="p-2" title="Ver detalhes">
                          <LuEye size={16} />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="p-2" title="Editar projeto">
                        <LuPencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-500 hover:bg-red-100 hover:text-red-700"
                        title="Deletar projeto"
                      >
                        <LuTrash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={isOpen} close={() => setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-foreground">Novo Projeto</h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              Crie um novo projeto nesta workspace
            </p>
          </DialogHeader>

          <DialogBody>
            <form id="create-project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Título"
                placeholder="Meu Projeto"
                icon={<LuFileText size={18} />}
                error={errors.title?.message}
                {...register('title')}
              />
              <Input
                label="Descrição"
                placeholder="Uma breve descrição do projeto (opcional)"
                icon={<LuFolder size={18} />}
                error={errors.description?.message}
                {...register('description')}
              />
            </form>
          </DialogBody>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => { setIsOpen(false); reset(); }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="create-project-form"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
