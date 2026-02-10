import Sidebar from '@/components/layout/sidebar';

const mockProjects = [
  { id: 'projeto-1', name: 'Website Redesign', status: 'IN_PROGRESS' },
  { id: 'projeto-2', name: 'Mobile App', status: 'CREATED' },
  { id: 'projeto-3', name: 'API Integration', status: 'DONE' },
  { id: 'projeto-4', name: 'Documentation', status: 'ARCHIVED' },
];

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar workspaceName="Minha Workspace" projects={mockProjects} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
