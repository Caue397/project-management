'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import {
  LuArrowLeft,
  LuFolder,
  LuClock,
  LuCircleCheck,
  LuArchive,
  LuPlus,
  LuCircleDot,
  LuCalendar,
  LuTrash2,
  LuFileText,
  LuMousePointerClick,
  LuPencil,
  LuCircleX,
  LuEye,
} from 'react-icons/lu';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Dropdown, { DropdownOption } from '@/components/ui/dropdown';
import { Spinner, Loader } from '@/components/ui/loader';
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
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/libs/api-error';
import { projectQuery } from '@/network/queries/project';
import { issuesQuery } from '@/network/queries/issue';
import {
  createIssueSchema,
  CreateIssueForm,
  IssueStatus,
} from '@/schemas/issue-schema';

const editProjectSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
});

type EditProjectForm = z.infer<typeof editProjectSchema>;

const projectStatusColors: Record<string, string> = {
  CREATED: 'bg-gray-100 text-gray-600 border-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-600 border-blue-200',
  DONE: 'bg-green-100 text-green-600 border-green-200',
  ARCHIVED: 'bg-foreground/10 text-foreground/50 border-foreground/20',
};

const projectStatusIcons: Record<string, React.ReactNode> = {
  CREATED: <LuFolder size={14} />,
  IN_PROGRESS: <LuClock size={14} />,
  DONE: <LuCircleCheck size={14} />,
  ARCHIVED: <LuArchive size={14} />,
};

const issueStatusColors: Record<string, string> = {
  OPEN: 'bg-gray-100 text-gray-600 border-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-600 border-blue-200',
  DONE: 'bg-green-100 text-green-600 border-green-200',
  CANCELLED: 'bg-red-50 text-red-500 border-red-200',
};

const issueStatusIcons: Record<string, React.ReactNode> = {
  OPEN: <LuCircleDot size={14} />,
  IN_PROGRESS: <LuClock size={14} />,
  DONE: <LuCircleCheck size={14} />,
  CANCELLED: <LuCircleX size={14} />,
};

type Issue = {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
};

type Tab = 'overview' | 'issues';

const DATE_LOCALES: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

export default function ProjectPage() {
  const { workspace, project: projectId } = useParams<{
    workspace: string;
    project: string;
  }>();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { addToast } = useToast();
  const t = useTranslations('project');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const dateLocale = DATE_LOCALES[locale] ?? 'en-US';

  const { data: project } = useSuspenseQuery(projectQuery(workspace, projectId));

  const projectStatusOptions: DropdownOption[] = [
    { value: 'CREATED', label: t('status.CREATED'), icon: <LuFolder size={14} /> },
    { value: 'IN_PROGRESS', label: t('status.IN_PROGRESS'), icon: <LuClock size={14} /> },
    { value: 'DONE', label: t('status.DONE'), icon: <LuCircleCheck size={14} /> },
    { value: 'ARCHIVED', label: t('status.ARCHIVED'), icon: <LuArchive size={14} /> },
  ];

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    formState: { errors: editErrors },
    reset: editReset,
  } = useForm<EditProjectForm>({
    resolver: zodResolver(editProjectSchema),
  });

  const { loading: updatingStatus, exec: execUpdateStatus } = usePromiseStatus(
    (newStatus: string) =>
      network.put(`/project/${workspace}/${projectId}`, {
        title: project.title,
        status: newStatus,
      }),
  );

  async function handleStatusChange(newStatus: string) {
    try {
      await execUpdateStatus(newStatus);
      await queryClient.invalidateQueries({ queryKey: ['project', workspace, projectId] });
      await queryClient.invalidateQueries({ queryKey: ['projects', workspace] });
      addToast({ type: 'success', message: t('statusUpdated') });
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

  const { loading: editing, exec: execEdit } = usePromiseStatus(
    (data: EditProjectForm) =>
      network.put(`/project/${workspace}/${projectId}`, {
        title: data.title,
        description: data.description,
        status: project.status,
      }),
  );

  async function handleEdit(data: EditProjectForm) {
    try {
      await execEdit(data);
      await queryClient.invalidateQueries({ queryKey: ['project', workspace, projectId] });
      await queryClient.invalidateQueries({ queryKey: ['projects', workspace] });
      addToast({ type: 'success', message: t('updated') });
      setIsEditOpen(false);
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

  function openEdit() {
    editReset({ title: project.title, description: project.description ?? '' });
    setIsEditOpen(true);
  }

  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      openEdit();
      router.replace(`/workspace/${workspace}/${projectId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="p-6 max-w-container mx-auto lg:p-8">
        <Link
          href={`/workspace/${workspace}`}
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-6 transition-colors"
        >
          <LuArrowLeft size={16} />
          {t('backToProjects')}
        </Link>

        <div className="bg-white rounded-2xl border border-foreground/10 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {project.title}
                  <span
                    className={cn(
                      'inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border',
                      projectStatusColors[project.status],
                    )}
                  >
                    {projectStatusIcons[project.status]}
                    {t(`status.${project.status as 'CREATED' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'}`)}
                  </span>
                </h1>
                <p className="text-sm text-foreground/60 mt-1">
                  {t('createdAt')}{' '}
                  {new Date(project.createdAt).toLocaleDateString(dateLocale)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Dropdown
                  options={projectStatusOptions}
                  value={project.status}
                  onChange={handleStatusChange}
                  disabled={updatingStatus}
                  className="w-52"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openEdit}
                  className="p-2 text-nowrap border border-foreground/10 rounded-xl font-normal"
                >
                  <LuPencil size={16} />
                  {t('editButton')}
                </Button>
              </div>
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
                {tab === 'overview' ? t('tabs.overview') : t('tabs.issues')}
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
                      {t('overview.description')}
                    </h2>
                    <p className="text-foreground">{project.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-2">
                      {t('overview.createdAt')}
                    </h2>
                    <p className="text-foreground">
                      {new Date(project.createdAt).toLocaleDateString(dateLocale, {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-2">
                      {t('overview.updatedAt')}
                    </h2>
                    <p className="text-foreground">
                      {new Date(project.updatedAt).toLocaleDateString(dateLocale, {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <Suspense fallback={<Loader />}>
                <IssuesSection workspace={workspace} projectId={projectId} />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} close={() => setIsEditOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-foreground">
              {t('editDialog.title')}
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              {t('editDialog.subtitle')}
            </p>
          </DialogHeader>
          <DialogBody>
            <form
              id="edit-project-form"
              onSubmit={editHandleSubmit(handleEdit)}
              className="space-y-4"
            >
              <Input
                label={t('editDialog.titleLabel')}
                placeholder={t('editDialog.titlePlaceholder')}
                icon={<LuFolder size={18} />}
                error={editErrors.title?.message}
                {...editRegister('title')}
              />
              <Input
                label={t('editDialog.descriptionLabel')}
                placeholder={t('editDialog.descriptionPlaceholder')}
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
              {tCommon('cancel')}
            </Button>
            <Button type="submit" form="edit-project-form" disabled={editing}>
              {editing ? <><Spinner size="sm" /> {tCommon('saving')}</> : tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
  const { addToast } = useToast();
  const t = useTranslations('project');
  const tCommon = useTranslations('common');

  const issueStatusOptions: DropdownOption[] = [
    { value: 'OPEN', label: t('issues.issueStatus.OPEN'), icon: issueStatusIcons['OPEN'] },
    { value: 'IN_PROGRESS', label: t('issues.issueStatus.IN_PROGRESS'), icon: issueStatusIcons['IN_PROGRESS'] },
    { value: 'DONE', label: t('issues.issueStatus.DONE'), icon: issueStatusIcons['DONE'] },
    { value: 'CANCELLED', label: t('issues.issueStatus.CANCELLED'), icon: issueStatusIcons['CANCELLED'] },
  ];

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
    (data: CreateIssueForm) => network.post(`/issue/${workspace}/${projectId}`, data),
  );

  async function handleCreate(data: CreateIssueForm) {
    try {
      await execCreate(data);
      await queryClient.invalidateQueries({ queryKey: ['issues', workspace, projectId] });
      addToast({ type: 'success', message: t('issues.created') });
      reset();
      setIsCreateOpen(false);
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{t('tabs.issues')}</h2>
          <p className="text-sm text-foreground/50 mt-0.5">
            {issues.length} issues
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <LuPlus size={16} />
          {t('issues.newIssue')}
        </Button>
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center text-foreground/30 mb-4">
            <LuCircleDot size={24} />
          </div>
          <p className="text-sm font-medium text-foreground/60">
            {t('issues.empty.title')}
          </p>
          <p className="text-xs text-foreground/40 mt-1">
            {t('issues.empty.subtitle')}
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableHeader>
              <LuFileText size={14} />
              {t('issues.table.issue')}
            </TableHeader>
            <TableHeader>
              <LuCircleDot size={14} />
              {t('issues.table.status')}
            </TableHeader>
            <TableHeader>
              <LuCalendar size={14} />
              {t('issues.table.createdAt')}
            </TableHeader>
            <TableHeader><LuMousePointerClick size={14} /> {t('issues.table.actions')}</TableHeader>
          </TableHead>
          <TableBody>
            {issues.map((issue: Issue, index: number) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                isLast={index === issues.length - 1}
                workspace={workspace}
                projectId={projectId}
                issueStatusOptions={issueStatusOptions}
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
              {t('issues.createDialog.title')}
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              {t('issues.createDialog.subtitle')}
            </p>
          </DialogHeader>
          <DialogBody>
            <form
              id="create-issue-form"
              onSubmit={handleSubmit(handleCreate)}
              className="space-y-4"
            >
              <Input
                label={t('issues.createDialog.titleLabel')}
                placeholder={t('issues.createDialog.titlePlaceholder')}
                icon={<LuCircleDot size={18} />}
                error={errors.title?.message}
                {...register('title')}
              />
              <Input
                label={t('issues.createDialog.descriptionLabel')}
                placeholder={t('issues.createDialog.descriptionPlaceholder')}
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
              {tCommon('cancel')}
            </Button>
            <Button type="submit" form="create-issue-form" disabled={creating}>
              {creating
                ? <><Spinner size="sm" /> {t('issues.createDialog.creating')}</>
                : t('issues.createDialog.create')}
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
  issueStatusOptions,
}: {
  issue: Issue;
  isLast: boolean;
  workspace: string;
  projectId: string;
  issueStatusOptions: DropdownOption[];
}) {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const { addToast } = useToast();
  const t = useTranslations('project');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const dateLocale = DATE_LOCALES[locale] ?? 'en-US';

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    formState: { errors: editErrors },
    reset: editReset,
  } = useForm<CreateIssueForm>({
    resolver: zodResolver(createIssueSchema),
  });

  const { loading: updatingStatus, exec: execUpdateStatus } = usePromiseStatus(
    (newStatus: IssueStatus) =>
      network.put(`/issue/${workspace}/${projectId}/${issue.id}`, {
        title: issue.title,
        description: issue.description ?? undefined,
        status: newStatus,
      }),
  );

  async function handleStatusChange(newStatus: IssueStatus) {
    try {
      await execUpdateStatus(newStatus);
      await queryClient.invalidateQueries({ queryKey: ['issues', workspace, projectId] });
      addToast({ type: 'success', message: t('issues.statusUpdated') });
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

  const { loading: editing, exec: execEdit } = usePromiseStatus(
    (data: CreateIssueForm) =>
      network.put(`/issue/${workspace}/${projectId}/${issue.id}`, {
        title: data.title,
        description: data.description,
        status: issue.status,
      }),
  );

  async function handleEdit(data: CreateIssueForm) {
    try {
      await execEdit(data);
      await queryClient.invalidateQueries({ queryKey: ['issues', workspace, projectId] });
      addToast({ type: 'success', message: t('issues.updated') });
      setIsEditOpen(false);
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

  const { loading: deleting, exec: execDelete } = usePromiseStatus(() =>
    network.delete(`/issue/${workspace}/${projectId}/${issue.id}`)
  );

  async function handleDelete() {
    try {
      await execDelete();
      await queryClient.invalidateQueries({ queryKey: ['issues', workspace, projectId] });
      addToast({ type: 'success', message: t('issues.deleted') });
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

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
            <p className="text-xs text-foreground/50 mt-0.5 truncate max-w-40">
              {issue.description}
            </p>
          )}
        </TableCell>
        <TableCell>
          <Dropdown
            options={issueStatusOptions}
            value={issue.status}
            onChange={(v) => handleStatusChange(v as IssueStatus)}
            disabled={updatingStatus}
            className="w-44"
          />
        </TableCell>
        <TableCell>
          <span className="text-sm text-foreground/60">
            {new Date(issue.createdAt).toLocaleDateString(dateLocale, {
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
              onClick={() => setIsViewOpen(true)}
              className="p-2 text-foreground/50 hover:bg-foreground/[0.04] hover:text-foreground"
            >
              <LuEye size={16} />
            </Button>
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
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              {deleting ? <Spinner size="sm" className="border-red-400 border-t-red-600" /> : <LuTrash2 size={16} />}
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={isViewOpen} close={() => setIsViewOpen(false)}>
        <DialogContent>
          <DialogHeader className='flex gap-2 items-center'>
            <h2 className="text-base font-semibold text-foreground">{issue.title}</h2>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
                issueStatusColors[issue.status],
              )}
            >
              {issueStatusIcons[issue.status]}
              {t(`issues.issueStatus.${issue.status as IssueStatus}`)}
            </span>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              {issue.description && (
                <div>
                  <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-1.5">
                    {t('overview.description')}
                  </p>
                  <p className="text-sm text-foreground wrap-break-word leading-relaxed">{issue.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-1.5">
                    {t('issues.table.createdAt')}
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(issue.createdAt).toLocaleDateString(dateLocale, {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-1.5">
                    {t('overview.updatedAt')}
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(issue.updatedAt).toLocaleDateString(dateLocale, {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsViewOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsViewOpen(false);
                openEdit();
              }}
            >
              <LuPencil size={14} />
              {t('issues.editDialog.title')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} close={() => setIsEditOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-foreground">
              {t('issues.editDialog.title')}
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              {t('issues.editDialog.subtitle')}
            </p>
          </DialogHeader>
          <DialogBody>
            <form
              id="edit-issue-form"
              onSubmit={editHandleSubmit(handleEdit)}
              className="space-y-4"
            >
              <Input
                label={t('issues.editDialog.titleLabel')}
                placeholder={t('issues.editDialog.titlePlaceholder')}
                icon={<LuCircleDot size={18} />}
                error={editErrors.title?.message}
                {...editRegister('title')}
              />
              <Input
                label={t('issues.editDialog.descriptionLabel')}
                placeholder={t('issues.editDialog.descriptionPlaceholder')}
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
              {tCommon('cancel')}
            </Button>
            <Button type="submit" form="edit-issue-form" disabled={editing}>
              {editing ? <><Spinner size="sm" /> {tCommon('saving')}</> : tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
