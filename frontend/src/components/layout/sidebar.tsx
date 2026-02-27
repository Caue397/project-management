'use client';

import { cn } from '@/libs/merge-classname';
import { usePromiseStatus } from '@/libs/promise-status';
import { network } from '@/network/network';
import { workspacesQuery } from '@/network/queries/workspace';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickAway } from '@uidotdev/usehooks';
import { LuFolder, LuSettings, LuLogOut, LuPlus, LuChevronsUpDown, LuCheck } from 'react-icons/lu';
import { HiFolder, HiHome } from 'react-icons/hi';
import { IoSettings } from 'react-icons/io5';

interface SidebarProps {
  workspaceName: string;
  workspaceSlug: string;
  projects: { id: string; name: string; status: string }[];
}

export default function Sidebar({ workspaceName, workspaceSlug, projects }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { loading: loggingOut, exec: logout } = usePromiseStatus(async () => {
    await network.post('/auth/sign-out');
    router.push('/sign-in');
  });

  return (
    <aside className="hidden lg:flex flex-col max-w-[280px] w-full bg-white border-r border-foreground/10 h-screen">
      <WorkspaceSwitcher currentName={workspaceName} currentSlug={workspaceSlug} />

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <SidebarCategory name='Navegação'>
          <NavItem
            name="Home"
            href={`/workspace/${workspaceSlug}`}
            icon={<HiHome size={18} />}
            isActive={pathname === `/workspace/${workspaceSlug}`}
          />
        </SidebarCategory>
        <SidebarCategory name="Projetos">
          {projects.length === 0 ? (
            <p className="text-xs flex items-center gap-4 border border-dashed rounded-lg text-foreground/50 px-2 py-3">
              <HiFolder size={18} />
              Nenhum projeto...
            </p>
          ) : (
            projects.map((project) => (
              <NavItem
                key={project.id}
                name={project.name}
                href={`/workspace/${workspaceSlug}/${project.id}`}
                icon={<HiFolder size={18} />}
                isActive={pathname === `/workspace/${workspaceSlug}/${project.id}`}
                badge={<StatusBadge status={project.status} />}
              />
            ))
          )}
        </SidebarCategory>

        <SidebarCategory name="Configuracoes">
          <NavItem
            name="Settings"
            href={`/workspace/${workspaceSlug}/settings`}
            icon={<IoSettings size={18} />}
            isActive={pathname.includes('/settings')}
          />
        </SidebarCategory>
      </nav>

      <div className="p-4 border-t border-foreground/10">
        <button
          onClick={() => logout()}
          disabled={loggingOut}
          className="flex cursor-pointer items-center gap-3 w-full py-2 px-2 rounded-xl text-foreground/50 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <LuLogOut size={18} />
          <span className="text-sm font-medium">{loggingOut ? 'Saindo...' : 'Sair'}</span>
        </button>
      </div>
    </aside>
  );
}

function WorkspaceSwitcher({ currentName, currentSlug }: { currentName: string; currentSlug: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useClickAway<HTMLDivElement>(() => setOpen(false));

  const { data: workspaces } = useSuspenseQuery(workspacesQuery());

  function handleSelect(slug: string) {
    setOpen(false);
    if (slug !== currentSlug) {
      router.push(`/workspace/${slug}`);
    }
  }

  return (
    <div ref={ref} className="relative p-4 border-b border-foreground/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center justify-between w-full gap-2 py-2 px-2 rounded-xl hover:bg-foreground/[0.04] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/[0.08] flex items-center justify-center text-primary shrink-0">
            <LuFolder size={16} />
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{currentName}</p>
            <p className="text-[10px] text-foreground/50">Workspace</p>
          </div>
        </div>
        <LuChevronsUpDown size={16} className="text-foreground/40 shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-4 right-4 top-full z-50 bg-white border border-foreground/10 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-1.5 flex flex-col gap-1 max-h-[240px] overflow-y-auto">
              {workspaces.map((ws: { id: string; name: string; slug: string }) => (
                <button
                  key={ws.id}
                  onClick={() => handleSelect(ws.slug)}
                  className={cn(
                    'flex items-center cursor-pointer justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors',
                    ws.slug === currentSlug
                      ? 'bg-primary/[0.08] text-primary font-medium'
                      : 'text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground'
                  )}
                >
                  <span className="truncate">{ws.name}</span>
                  {ws.slug === currentSlug && <LuCheck size={14} />}
                </button>
              ))}
            </div>
            <div className="border-t border-foreground/10 p-1.5">
              <Link
                href="/workspace"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-foreground/50 hover:bg-foreground/[0.04] hover:text-foreground transition-colors"
              >
                <LuPlus size={14} />
                Nova Workspace
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarCategory({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section className="space-y-1">
      <h2 className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2">
        {name}
      </h2>
      {children}
    </section>
  );
}

interface NavItemProps {
  name: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
  badge?: ReactNode;
}

function NavItem({ name, href, icon, isActive, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between gap-3 py-2 px-2 rounded-xl transition-colors min-h-[40px]',
        isActive
          ? 'bg-primary/[0.08] ring-1 ring-primary/20 text-primary'
          : 'text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground'
      )}
    >
      <div className="flex gap-3 items-center">
        {icon}
        <span className="text-sm font-medium">{name}</span>
      </div>
      {badge}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    CREATED: 'bg-gray-100 text-gray-600',
    IN_PROGRESS: 'bg-blue-100 text-blue-600',
    DONE: 'bg-green-100 text-green-600',
    ARCHIVED: 'bg-foreground/10 text-foreground/50',
  };

  const statusLabels: Record<string, string> = {
    CREATED: 'Novo',
    IN_PROGRESS: 'Em andamento',
    DONE: 'Concluido',
    ARCHIVED: 'Arquivado',
  };

  return (
    <span
      className={cn(
        'text-[10px] font-medium px-2 py-0.5 rounded-full',
        statusStyles[status] || statusStyles.CREATED
      )}
    >
      {statusLabels[status] || status}
    </span>
  );
}
