import z from 'zod';

export const issueStatusValues = [
  'OPEN',
  'IN_PROGRESS',
  'DONE',
  'CANCELLED',
] as const;

export type IssueStatus = (typeof issueStatusValues)[number];

export const createIssueSchema = z.object({
  title: z
    .string()
    .min(2, 'Título deve ter no mínimo 2 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string().optional(),
});

export type CreateIssueForm = z.infer<typeof createIssueSchema>;
