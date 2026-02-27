import z from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter no mínimo 2 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres"),
    email: z.email(),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Deve conter pelo menos um número")
      .regex(
        /[@#$%^&+=]/,
        "Deve conter pelo menos um caractere especial (@#$%^&+=)"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignUpForm = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type SignInForm = z.infer<typeof signInSchema>;
