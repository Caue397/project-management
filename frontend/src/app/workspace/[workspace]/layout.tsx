import ErrorPage from '@/components/pages/error-page';
import Sidebar from '@/components/layout/sidebar';
import { ssrWorkspace, ssrWorkspaces } from '@/network/ssr/workspace';
import { ssrProjects } from '@/network/ssr/project';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { LuLock, LuSearch } from 'react-icons/lu';

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: slug } = await params;
  const queryClient = new QueryClient();

  try {
    const [workspace, projects] = await Promise.all([
      ssrWorkspace(queryClient, slug),
      ssrProjects(queryClient, slug),
      ssrWorkspaces(queryClient),
    ]);

    const sidebarProjects = projects.map(
      (p: { id: string; title: string; status: string }) => ({
        id: p.id,
        name: p.title,
        status: p.status,
      })
    );

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex min-h-screen bg-background">
          <Sidebar workspaceName={workspace.name} workspaceSlug={slug} projects={sidebarProjects} />
          <main className="flex-1 overflow-auto mt-6">{children}</main>
        </div>
      </HydrationBoundary>
    );
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        return (
          <ErrorPage
            icon={<LuSearch size={24} />}
            title="Workspace não encontrada"
            description="A workspace que você está tentando acessar não existe ou foi removida."
            action={{ label: 'Voltar ao início', href: '/workspaces' }}
          />
        );
      }

      if (error.response?.status === 401) {
        return (
          <ErrorPage
            icon={<LuLock size={24} />}
            title="Acesso negado"
            description="Você não tem permissão para acessar esta workspace."
            hint="Apenas o dono da workspace pode acessá-la."
            action={{ label: 'Voltar ao início', href: '/workspaces' }}
          />
        );
      }
    }

    return (
      <ErrorPage
        title="Erro inesperado"
        description="Não foi possível carregar a workspace. Tente novamente mais tarde."
        action={{ label: 'Voltar ao início', href: '/workspaces' }}
      />
    );
  }
}
