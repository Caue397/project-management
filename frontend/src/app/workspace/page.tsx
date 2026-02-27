import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ssrWorkspaces } from '@/network/ssr/workspace';
import WorkspacesPage from '@/components/pages/workspaces-page';

export default async function WorkspacesListPage() {
  const queryClient = new QueryClient();

  await ssrWorkspaces(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkspacesPage />
    </HydrationBoundary>
  );
}
