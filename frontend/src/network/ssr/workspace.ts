import { QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { network } from '../network';

export async function ssrWorkspaces(client: QueryClient) {
  const serialized = (await cookies()).toString();

  return client.fetchQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await network.get('/workspace', {
        headers: { cookie: serialized },
      });
      return response.data;
    },
  });
}

export async function ssrWorkspace(client: QueryClient, slug: string) {
  const serialized = (await cookies()).toString();

  return client.fetchQuery({
    queryKey: ['workspace', slug],
    queryFn: async () => {
      const response = await network.get(`/workspace/${slug}`, {
        headers: { cookie: serialized },
      });
      return response.data;
    },
  });
}
