'use client';

import { cn } from '@/libs/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { LuFolder, LuSettings, LuLogOut, LuPlus } from 'react-icons/lu';

interface SidebarProps {
  workspaceName: string;
  projects: { id: string; name: string; status: string }[];
}

export default function Sidebar({ workspaceName, projects }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col max-w-[280px] w-full bg-white border-r border-foreground/10 h-screen">
      <div className="p-4 border-b border-foreground/10">
        <h1 className="text-lg font-bold text-foreground">{workspaceName}</h1>
        <p className="text-xs text-foreground/50">Workspace</p>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <SidebarCategory name="Projetos">
          {projects.map((project) => (
            <NavItem
              key={project.id}
              name={project.name}
              href={`/${workspaceName}/${project.id}`}
              icon={<LuFolder size={18} />}
              isActive={pathname === `/${workspaceName}/${project.id}`}
              badge={<StatusBadge status={project.status} />}
            />
          ))}
          <button className="flex items-center gap-3 w-full py-2 px-2 rounded-xl text-foreground/50 hover:bg-foreground/[0.04] hover:text-foreground transition-colors">
            <LuPlus size={18} />
            <span className="text-sm font-medium">Novo Projeto</span>
          </button>
        </SidebarCategory>

        <SidebarCategory name="Configuracoes">
          <NavItem
            name="Settings"
            href={`/${workspaceName}/settings`}
            icon={<LuSettings size={18} />}
            isActive={pathname.includes('/settings')}
          />
        </SidebarCategory>
      </nav>

      <div className="p-4 border-t border-foreground/10">
        <button className="flex items-center gap-3 w-full py-2 px-2 rounded-xl text-foreground/50 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LuLogOut size={18} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
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
