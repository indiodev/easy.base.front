import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string({
      message: "E-mail obrigatório",
    })
    .email({ message: "E-mail inválido" }),
  password: z
    .string({
      message: "Senha obrigatória",
    })
    .min(8, { message: "Senha deve ter no mínimo de 8 caracteres" }),
});

export type SignIn = z.infer<typeof SignInSchema>;
