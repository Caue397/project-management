import z from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
});

export type CreateWorkspaceForm = z.infer<typeof createWorkspaceSchema>;
