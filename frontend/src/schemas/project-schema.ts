import z from 'zod';

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(2, 'Título deve ter no mínimo 2 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string().optional(),
});

export type CreateProjectForm = z.infer<typeof createProjectSchema>;
