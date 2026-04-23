import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ message: 'E-mail obrigatório' })
        .email('E-mail inválido'),
    password: z
        .string({ message: 'Senha obrigatória' })
        .min(6, 'Mínimo 6 caracteres'),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    type: z.enum(["COMPANY", "USER"]),
    name: z.string().optional(),
    document: z.string().optional(),
    companyCode: z.string().optional(),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type RegisterForm = z.infer<typeof registerSchema>;