'use client';

import { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { LuPlus, LuFolder } from 'react-icons/lu';
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { workspacesQuery } from '@/network/queries/workspace';
import { CreateWorkspaceForm, createWorkspaceSchema } from '@/schemas/workspace-schema';
import { slugify } from '@/libs/string';

export default function WorkspacesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: workspaces } = useSuspenseQuery(workspacesQuery());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: '' },
  });

  const { loading, exec } = usePromiseStatus(async (data: CreateWorkspaceForm) => {
    await network.post('/workspace', data);
    const slug = slugify(data.name);
    await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    reset();
    setIsOpen(false);
    router.push(`/workspace/${slug}`);
  });

  function onSubmit(data: CreateWorkspaceForm) {
    exec(data);
  }

  return (
    <main className="min-h-screen bg-background p-6 lg:p-8 max-w-container mx-auto">
      <header className="flex items-center border-b pb-6 border-foreground/30 border-dashed justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workspaces</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Selecione ou crie uma workspace para começar
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <LuPlus size={18} />
          Nova Workspace
        </Button>
      </header>

      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center text-foreground/30 mb-4">
            <LuFolder size={24} />
          </div>
          <p className="text-sm font-medium text-foreground/60">Nenhuma workspace encontrada</p>
          <p className="text-xs text-foreground/40 mt-1">
            Crie sua primeira workspace para começar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace: { id: string; name: string; slug: string }) => (
            <Link
              key={workspace.id}
              href={`/workspace/${workspace.slug}`}
              className="group bg-white flex gap-4 rounded-2xl border border-foreground/10 p-6 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/[0.08] flex items-center justify-center text-primary">
                <LuFolder size={20} />
              </div>
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {workspace.name}
                </p>
                <p className="text-xs text-foreground/40">{workspace.slug}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={isOpen} close={() => setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-base font-semibold text-foreground">Nova Workspace</h2>
            <p className="text-sm text-foreground/50 mt-0.5">
              Dê um nome para identificar sua workspace
            </p>
          </DialogHeader>

          <DialogBody>
            <form id="create-workspace-form" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Nome"
                placeholder="Minha Workspace"
                icon={<LuFolder size={18} />}
                error={errors.name?.message}
                {...register('name')}
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
              form="create-workspace-form"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
