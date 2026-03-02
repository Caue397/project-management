import { network } from '../network';

export function issuesQuery(workspaceSlug: string, projectId: string) {
  return {
    queryKey: ['issues', workspaceSlug, projectId],
    queryFn: () =>
      network.get(`/issue/${workspaceSlug}/${projectId}`).then((r) => r.data),
  };
}

export function issueQuery(
  workspaceSlug: string,
  projectId: string,
  issueId: string,
) {
  return {
    queryKey: ['issue', workspaceSlug, projectId, issueId],
    queryFn: () =>
      network
        .get(`/issue/${workspaceSlug}/${projectId}/${issueId}`)
        .then((r) => r.data),
  };
}
