'use client';

import { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuPencil, LuTrash2, LuTriangleAlert } from 'react-icons/lu';
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { workspaceQuery } from '@/network/queries/workspace';
import { CreateWorkspaceForm, createWorkspaceSchema } from '@/schemas/workspace-schema';
import { slugify } from '@/libs/string';

export default function SettingsPage() {
  const { workspace: slug } = useParams<{ workspace: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const { data: workspace } = useSuspenseQuery(workspaceQuery(slug));

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: workspace.name },
  });

  const { loading: updating, exec: updateWorkspace } = usePromiseStatus(
    async (data: CreateWorkspaceForm) => {
      await network.put(`/workspace/${slug}`, data);
      const newSlug = slugify(data.name);
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      await queryClient.invalidateQueries({ queryKey: ['workspace', slug] });
      router.push(`/workspace/${newSlug}/settings`);
    }
  );

  const { loading: deleting, exec: deleteWorkspace } = usePromiseStatus(async () => {
    await network.delete(`/workspace/${slug}`);
    await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    router.push('/workspace');
  });

  function onSubmit(data: CreateWorkspaceForm) {
    updateWorkspace(data);
  }

  return (
    <div className="p-6 max-w-container mx-auto lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Gerencie as configurações da workspace
        </p>
      </header>

      <div className="space-y-8">
        <section className="bg-white border border-foreground/10 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground">Nome da Workspace</h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              Altere o nome da sua workspace. O slug será atualizado automaticamente.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome"
              placeholder="Minha Workspace"
              icon={<LuPencil size={18} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={updating || !isDirty}>
                {updating ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </section>

        <section className="bg-white border border-red-200 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-red-600 flex items-center gap-2">
              <LuTriangleAlert size={18} />
              Zona de Perigo
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              Ações irreversíveis. Tenha cuidado ao prosseguir.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">Deletar workspace</p>
              <p className="text-sm text-foreground/50">
                Todos os projetos serão excluídos permanentemente.
              </p>
            </div>
            <Button
              variant="secondary"
              className="!border-red-200 !text-red-600 hover:!bg-red-50 shrink-0"
              onClick={() => setIsDeleteOpen(true)}
            >
              <LuTrash2 size={16} />
              Deletar
            </Button>
          </div>
        </section>
      </div>

      <Dialog open={isDeleteOpen} close={() => { setIsDeleteOpen(false); setDeleteConfirm(''); }}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-red-600 flex items-center gap-2">
              <LuTriangleAlert size={18} />
              Deletar Workspace
            </h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              Esta ação não pode ser desfeita.
            </p>
          </DialogHeader>

          <DialogBody>
            <p className="text-sm text-foreground/70 mb-4">
              Para confirmar, digite <span className="font-semibold text-foreground">{workspace.name}</span> abaixo:
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
              Cancelar
            </Button>
            <Button
              className="!bg-red-600 hover:!bg-red-700"
              disabled={deleteConfirm !== workspace.name || deleting}
              onClick={() => deleteWorkspace()}
            >
              {deleting ? 'Deletando...' : 'Deletar Workspace'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
