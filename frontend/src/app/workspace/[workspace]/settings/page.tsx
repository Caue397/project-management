'use client';

import { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuPencil, LuTrash2, LuTriangleAlert, LuLanguages } from 'react-icons/lu';
import { useTranslations, useLocale } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Dropdown from '@/components/ui/dropdown';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { workspaceQuery } from '@/network/queries/workspace';
import { CreateWorkspaceForm, createWorkspaceSchema } from '@/schemas/workspace-schema';
import { slugify } from '@/libs/string';
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/libs/api-error';

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const;

function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function SettingsPage() {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const { addToast } = useToast();
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const tLocales = useTranslations('locales');
  const currentLocale = useLocale();

  const { data: workspace } = useSuspenseQuery(workspaceQuery(slug));

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: workspace.name },
  });

  const { loading: updating, exec: execUpdate } = usePromiseStatus(
    (data: CreateWorkspaceForm) => network.put(`/workspace/${slug}`, data)
  );

  const { loading: deleting, exec: execDelete } = usePromiseStatus(
    () => network.delete(`/workspace/${slug}`)
  );

  const localeOptions = SUPPORTED_LOCALES.map((locale) => ({
    value: locale,
    label: tLocales(locale),
  }));

  async function onSubmit(data: CreateWorkspaceForm) {
    try {
      await execUpdate(data);
      const newSlug = slugify(data.name);
      addToast({ type: 'success', message: t('workspaceName.successMessage') });
      router.push(`/workspace/${newSlug}/settings`);
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

  function handleLanguageChange(locale: string) {
    setLocaleCookie(locale);
    addToast({ type: 'success', message: t('language.success') });
    router.refresh();
  }

  async function handleDelete() {
    try {
      await execDelete();
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      addToast({ type: 'success', message: t('danger.deleteSuccess') });
      router.push('/workspace');
    } catch (error) {
      addToast({ type: 'error', message: getApiErrorMessage(error) });
    }
  }

  return (
    <div className="p-6 max-w-container mx-auto lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-sm text-foreground/60 mt-1">{t('subtitle')}</p>
      </header>

      <div className="space-y-8">
        <section className="bg-white border border-foreground/10 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground">{t('workspaceName.title')}</h2>
            <p className="text-sm text-foreground/50 mt-0.5">{t('workspaceName.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('workspaceName.label')}
              placeholder={t('workspaceName.placeholder')}
              icon={<LuPencil size={18} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={updating || !isDirty}>
                {updating ? tCommon('saving') : tCommon('save')}
              </Button>
            </div>
          </form>
        </section>

        <section className="bg-white border border-foreground/10 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <LuLanguages size={18} />
              {t('language.title')}
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">{t('language.subtitle')}</p>
          </div>

          <Dropdown
            label={t('language.label')}
            options={localeOptions}
            value={currentLocale}
            onChange={handleLanguageChange}
          />
        </section>

        <section className="bg-white border border-red-200 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-red-600 flex items-center gap-2">
              <LuTriangleAlert size={18} />
              {t('danger.title')}
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">{t('danger.subtitle')}</p>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">{t('danger.deleteLabel')}</p>
              <p className="text-sm text-foreground/50">{t('danger.deleteDescription')}</p>
            </div>
            <Button
              variant="secondary"
              className="!border-red-200 !text-red-600 hover:!bg-red-50 shrink-0"
              onClick={() => setIsDeleteOpen(true)}
            >
              <LuTrash2 size={16} />
              {t('danger.deleteButton')}
            </Button>
          </div>
        </section>
      </div>

      <Dialog open={isDeleteOpen} close={() => { setIsDeleteOpen(false); setDeleteConfirm(''); }}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-red-600 flex items-center gap-2">
              <LuTriangleAlert size={18} />
              {t('deleteDialog.title')}
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">{t('deleteDialog.subtitle')}</p>
          </DialogHeader>

          <DialogBody>
            <p className="text-sm text-foreground/70 mb-4">
              {t('deleteDialog.confirmInstructions')}{' '}
              <span className="font-semibold text-foreground">{workspace.name}</span>{' '}
              {t('deleteDialog.confirmBelow')}
            </p>
            <Input
              placeholder={workspace.name}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />
          </DialogBody>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => { setIsDeleteOpen(false); setDeleteConfirm(''); }}
              disabled={deleting}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              className="!bg-red-600 hover:!bg-red-700"
              disabled={deleteConfirm !== workspace.name || deleting}
              onClick={handleDelete}
            >
              {deleting ? tCommon('deleting') : t('deleteDialog.deleteButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
