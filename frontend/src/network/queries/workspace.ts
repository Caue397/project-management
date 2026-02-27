import { network } from '../network';

export function workspacesQuery() {
  return {
    queryKey: ['workspaces'],
    queryFn: () => network.get('/workspace').then((r) => r.data),
  };
}

export function workspaceQuery(slug: string) {
  return {
    queryKey: ['workspace', slug],
    queryFn: () => network.get(`/workspace/${slug}`).then((r) => r.data),
  };
}
