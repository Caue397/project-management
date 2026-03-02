'use client';

import { useState, Suspense } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LuArrowLeft,
  LuFolder,
  LuClock,
  LuCircleCheck,
  LuArchive,
  LuPlus,
  LuCircleDot,
  LuCircleX,
  LuCalendar,
  LuTrash2,
  LuFileText,
  LuMousePointerClick,
  LuPencil,
} from 'react-icons/lu';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Dropdown, { DropdownOption } from '@/components/ui/dropdown';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { cn } from '@/libs/merge-classname';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { projectQuery } from '@/network/queries/project';
import { issuesQuery } from '@/network/queries/issue';
import {
  createIssueSchema,
  CreateIssueForm,
  IssueStatus,
} from '@/schemas/issue-schema';

const projectStatusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  CREATED: {
    label: 'Novo',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: <LuFolder size={16} />,
  },
  IN_PROGRESS: {
    label: 'Em andamento',
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    icon: <LuClock size={16} />,
  },
  DONE: {
    label: 'Concluído',
    color: 'bg-green-100 text-green-600 border-green-200',
    icon: <LuCircleCheck size={16} />,
  },
  ARCHIVED: {
    label: 'Arquivado',
    color: 'bg-foreground/10 text-foreground/50 border-foreground/20',
    icon: <LuArchive size={16} />,
  },
};

const projectStatusOptions: DropdownOption[] = [
  { value: 'CREATED', label: 'Novo', icon: <LuFolder size={16} /> },
  { value: 'IN_PROGRESS', label: 'Em andamento', icon: <LuClock size={16} /> },
  { value: 'DONE', label: 'Concluído', icon: <LuCircleCheck size={16} /> },
  { value: 'ARCHIVED', label: 'Arquivado', icon: <LuArchive size={16} /> },
];

const issueStatusOptions: DropdownOption[] = [
  { value: 'OPEN', label: 'Aberto', icon: <LuCircleDot size={16} /> },
  { value: 'IN_PROGRESS', label: 'Em andamento', icon: <LuClock size={16} /> },
  { value: 'DONE', label: 'Concluído', icon: <LuCircleCheck size={16} /> },
  { value: 'CANCELLED', label: 'Cancelado', icon: <LuCircleX size={16} /> },
];

type Issue = {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
};

type Tab = 'overview' | 'issues';

export default function ProjectPage() {
  const { workspace, project: projectId } = useParams<{
    workspace: string;
    project: string;
  }>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const { data: project } = useSuspenseQuery(projectQuery(workspace, projectId));

  const currentStatus = projectStatusConfig[project.status];

  const { loading: updatingStatus, exec: execUpdateStatus } = usePromiseStatus(
    async (newStatus: string) => {
      await network.put(`/project/${workspace}/${projectId}`, {
        title: project.title,
        status: newStatus,
      });
      await queryClient.invalidateQueries({
        queryKey: ['project', workspace, projectId],
      });
      await queryClient.invalidateQueries({ queryKey: ['projects', workspace] });
    },
  );

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
        <div className="p-6">
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
                currentStatus?.color,
              )}
            >
              {currentStatus?.icon}
              {currentStatus?.label}
            </span>
          </div>
        </div>

        <div className="flex border-b border-foreground/10 px-6">
          {(['overview', 'issues'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'relative px-4 cursor-pointer py-3 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'text-foreground'
                  : 'text-foreground/50 hover:text-foreground/70',
              )}
            >
              {tab === 'overview' ? 'Visão Geral' : 'Issues'}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
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

              <div className="pt-4 border-t border-foreground/10">
                <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-3">
                  Alterar status
                </h2>
                <Dropdown
                  options={projectStatusOptions}
                  value={project.status}
                  onChange={(v) => execUpdateStatus(v)}
                  disabled={updatingStatus}
                  className="max-w-xs"
                />
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <Suspense
              fallback={
                <p className="text-sm text-foreground/50">
                  Carregando issues...
                </p>
              }
            >
              <IssuesSection workspace={workspace} projectId={projectId} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

function IssuesSection({
  workspace,
  projectId,
}: {
  workspace: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: issues } = useSuspenseQuery(issuesQuery(workspace, projectId));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateIssueForm>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: { title: '', description: '' },
  });

  const { loading: creating, exec: execCreate } = usePromiseStatus(
    async (data: CreateIssueForm) => {
      await network.post(`/issue/${workspace}/${projectId}`, data);
      await queryClient.invalidateQueries({
        queryKey: ['issues', workspace, projectId],
      });
      reset();
      setIsCreateOpen(false);
    },
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Issues</h2>
          <p className="text-sm text-foreground/50 mt-0.5">
            {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <LuPlus size={16} />
          Nova Issue
        </Button>
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center text-foreground/30 mb-4">
            <LuCircleDot size={24} />
          </div>
          <p className="text-sm font-medium text-foreground/60">
            Nenhuma issue encontrada
          </p>
          <p className="text-xs text-foreground/40 mt-1">
            Crie sua primeira issue para começar a rastrear trabalho
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableHeader>
              <LuFileText size={14} />
              Issue
            </TableHeader>
            <TableHeader>
              <LuCircleDot size={14} />
              Status
            </TableHeader>
            <TableHeader>
              <LuCalendar size={14} />
              Criado em
            </TableHeader>
            <TableHeader><LuMousePointerClick size={14} /> Ações</TableHeader>
          </TableHead>
          <TableBody>
            {issues.map((issue: Issue, index: number) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                isLast={index === issues.length - 1}
                workspace={workspace}
                projectId={projectId}
              />
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={isCreateOpen}
        close={() => {
          setIsCreateOpen(false);
          reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-foreground">
              Nova Issue
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              Adicione uma issue a este projeto
            </p>
          </DialogHeader>
          <DialogBody>
            <form
              id="create-issue-form"
              onSubmit={handleSubmit((d) => execCreate(d))}
              className="space-y-4"
            >
              <Input
                label="Título"
                placeholder="Descreva o problema ou tarefa"
                icon={<LuCircleDot size={18} />}
                error={errors.title?.message}
                {...register('title')}
              />
              <Input
                label="Descrição"
                placeholder="Contexto adicional (opcional)"
                icon={<LuFileText size={18} />}
                error={errors.description?.message}
                {...register('description')}
              />
            </form>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateOpen(false);
                reset();
              }}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button type="submit" form="create-issue-form" disabled={creating}>
              {creating ? 'Criando...' : 'Criar Issue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function IssueRow({
  issue,
  isLast,
  workspace,
  projectId,
}: {
  issue: Issue;
  isLast: boolean;
  workspace: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    formState: { errors: editErrors },
    reset: editReset,
  } = useForm<CreateIssueForm>({
    resolver: zodResolver(createIssueSchema),
  });

  const { loading: updatingStatus, exec: execUpdateStatus } = usePromiseStatus(
    async (newStatus: IssueStatus) => {
      await network.put(`/issue/${workspace}/${projectId}/${issue.id}`, {
        title: issue.title,
        description: issue.description ?? undefined,
        status: newStatus,
      });
      await queryClient.invalidateQueries({
        queryKey: ['issues', workspace, projectId],
      });
    },
  );

  const { loading: editing, exec: execEdit } = usePromiseStatus(
    async (data: CreateIssueForm) => {
      await network.put(`/issue/${workspace}/${projectId}/${issue.id}`, {
        title: data.title,
        description: data.description,
        status: issue.status,
      });
      await queryClient.invalidateQueries({
        queryKey: ['issues', workspace, projectId],
      });
      setIsEditOpen(false);
    },
  );

  const { loading: deleting, exec: execDelete } = usePromiseStatus(async () => {
    await network.delete(`/issue/${workspace}/${projectId}/${issue.id}`);
    await queryClient.invalidateQueries({
      queryKey: ['issues', workspace, projectId],
    });
  });

  function openEdit() {
    editReset({ title: issue.title, description: issue.description ?? '' });
    setIsEditOpen(true);
  }

  return (
    <>
      <TableRow isLast={isLast}>
        <TableCell>
          <p className="text-sm font-medium text-foreground">{issue.title}</p>
          {issue.description && (
            <p className="text-xs text-foreground/50 mt-0.5 line-clamp-1">
              {issue.description}
            </p>
          )}
        </TableCell>
        <TableCell>
          <Dropdown
            options={issueStatusOptions}
            value={issue.status}
            onChange={(v) => execUpdateStatus(v as IssueStatus)}
            disabled={updatingStatus}
            className="w-44"
          />
        </TableCell>
        <TableCell>
          <span className="text-sm text-foreground/60">
            {new Date(issue.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </TableCell>
        <TableCell>
          <div className="inline-flex items-center gap-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={openEdit}
              className="p-2 text-foreground/50 hover:bg-foreground/[0.04] hover:text-foreground"
            >
              <LuPencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => execDelete()}
              disabled={deleting}
              className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <LuTrash2 size={16} />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={isEditOpen} close={() => setIsEditOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-foreground">
              Editar Issue
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              Atualize o título ou descrição desta issue
            </p>
          </DialogHeader>
          <DialogBody>
            <form
              id="edit-issue-form"
              onSubmit={editHandleSubmit((d) => execEdit(d))}
              className="space-y-4"
            >
              <Input
                label="Título"
                placeholder="Descreva o problema ou tarefa"
                icon={<LuCircleDot size={18} />}
                error={editErrors.title?.message}
                {...editRegister('title')}
              />
              <Input
                label="Descrição"
                placeholder="Contexto adicional (opcional)"
                icon={<LuFileText size={18} />}
                error={editErrors.description?.message}
                {...editRegister('description')}
              />
            </form>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsEditOpen(false)}
              disabled={editing}
            >
              Cancelar
            </Button>
            <Button type="submit" form="edit-issue-form" disabled={editing}>
              {editing ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
