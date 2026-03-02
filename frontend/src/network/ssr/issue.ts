import { QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { network } from '../network';

export async function ssrIssues(
  client: QueryClient,
  workspaceSlug: string,
  projectId: string,
) {
  const serialized = (await cookies()).toString();

  return client.fetchQuery({
    queryKey: ['issues', workspaceSlug, projectId],
    queryFn: async () => {
      const response = await network.get(
        `/issue/${workspaceSlug}/${projectId}`,
        { headers: { cookie: serialized } },
      );
      return response.data;
    },
  });
}
