import { network } from '../network';

export function projectsQuery(workspaceSlug: string) {
  return {
    queryKey: ['projects', workspaceSlug],
    queryFn: () =>
      network.get(`/project/${workspaceSlug}`).then((r) => r.data),
  };
}

export function projectQuery(workspaceSlug: string, projectId: string) {
  return {
    queryKey: ['project', workspaceSlug, projectId],
    queryFn: () =>
      network
        .get(`/project/${workspaceSlug}/${projectId}`)
        .then((r) => r.data),
  };
}
