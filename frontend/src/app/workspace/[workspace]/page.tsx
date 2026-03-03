'use client';

import { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
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
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/libs/api-error';

const statusColors: Record<string, string> = {
  CREATED: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-600',
  DONE: 'bg-green-100 text-green-600',
  ARCHIVED: 'bg-foreground/10 text-foreground/50',
};

const statusIcons: Record<string, React.ReactNode> = {
  CREATED: <LuFolder size={14} />,
  IN_PROGRESS: <LuClock size={14} />,
  DONE: <LuCircleCheck size={14} />,
  ARCHIVED: <LuArchive size={14} />,
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const DATE_LOCALES: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

export default function WorkspacePage() {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToast();
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const dateLocale = DATE_LOCALES[locale] ?? 'en-US';

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

  const { loading, exec } = usePromiseStatus((data: CreateProjectForm) =>
    network.post(`/project/${slug}`, data)
  );

  async function onSubmit(data: CreateProjectForm) {
    try {
      await exec(data);
      await queryClient.invalidateQueries({ queryKey: ['projects', slug] });
      addToast({ type: 'success', message: t('successMessage') });
      reset();
      setIsOpen(false);
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

  return (
    <div className="p-6 max-w-container mx-auto lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{workspace.name}</h1>
          <p className="text-sm text-foreground/60 mt-1">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <LuPlus size={18} />
          {t('newProject')}
        </Button>
      </header>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center text-foreground/30 mb-4">
            <LuFileText size={24} />
          </div>
          <p className="text-sm font-medium text-foreground/60">{t('empty.title')}</p>
          <p className="text-xs text-foreground/40 mt-1">{t('empty.subtitle')}</p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableHeader><LuFileText size={14} /> {t('table.project')}</TableHeader>
            <TableHeader><LuCircleDot size={14} /> {t('table.status')}</TableHeader>
            <TableHeader><LuCalendar size={14} /> {t('table.createdAt')}</TableHeader>
            <TableHeader><LuClock size={14} /> {t('table.updatedAt')}</TableHeader>
            <TableHeader><LuMousePointerClick size={14} /> {t('table.actions')}</TableHeader>
          </TableHead>
          <TableBody>
            {projects.map((project: Project, index: number) => (
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
                      statusColors[project.status]
                    )}
                  >
                    {statusIcons[project.status]}
                    {t(`status.${project.status as 'CREATED' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'}`)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-foreground/60">
                  {new Date(project.createdAt).toLocaleDateString(dateLocale)}
                </TableCell>
                <TableCell className="text-sm text-foreground/60">
                  {new Date(project.updatedAt).toLocaleDateString(dateLocale)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link href={`/workspace/${slug}/${project.id}`}>
                      <Button variant="ghost" size="sm" className="p-2" title={t('actions.view')}>
                        <LuEye size={16} />
                      </Button>
                    </Link>
                    <Link href={`/workspace/${slug}/${project.id}?edit=true`}>
                      <Button variant="ghost" size="sm" className="p-2" title={t('actions.edit')}>
                        <LuPencil size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-red-500 hover:bg-red-100 hover:text-red-700"
                      title={t('actions.delete')}
                    >
                      <LuTrash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isOpen} close={() => setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-foreground">{t('dialog.title')}</h2>
            <p className="text-sm text-foreground/50 mt-0.5">{t('dialog.subtitle')}</p>
          </DialogHeader>

          <DialogBody>
            <form id="create-project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label={t('dialog.titleLabel')}
                placeholder={t('dialog.titlePlaceholder')}
                icon={<LuFileText size={18} />}
                error={errors.title?.message}
                {...register('title')}
              />
              <Input
                label={t('dialog.descriptionLabel')}
                placeholder={t('dialog.descriptionPlaceholder')}
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
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              form="create-project-form"
              disabled={loading}
            >
              {loading ? t('dialog.creating') : t('dialog.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
