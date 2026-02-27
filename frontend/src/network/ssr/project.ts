import { QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { network } from '../network';

export async function ssrProjects(client: QueryClient, workspaceSlug: string) {
  const serialized = (await cookies()).toString();

  return client.fetchQuery({
    queryKey: ['projects', workspaceSlug],
    queryFn: async () => {
      const response = await network.get(`/project/${workspaceSlug}`, {
        headers: { cookie: serialized },
      });
      return response.data;
    },
  });
}

export async function ssrProject(
  client: QueryClient,
  workspaceSlug: string,
  projectId: string,
) {
  const serialized = (await cookies()).toString();

  return client.fetchQuery({
    queryKey: ['project', workspaceSlug, projectId],
    queryFn: async () => {
      const response = await network.get(
        `/project/${workspaceSlug}/${projectId}`,
        {
          headers: { cookie: serialized },
        },
      );
      return response.data;
    },
  });
}
