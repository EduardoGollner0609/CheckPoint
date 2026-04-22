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
    type: z.enum(["OWNER", "EMPLOYEE"]),
    companyName: z.string().optional(),
    cnpj: z.string().optional(),
    companyCode: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
}).superRefine((data, ctx) => {
    if (data.type === "OWNER") {
        if (!data.companyName || data.companyName.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Nome da empresa obrigatório",
                path: ["companyName"],
            });
        }
        const cnpjLimpo = data.cnpj?.replace(/\D/g, '') ?? '';
        if (cnpjLimpo.length !== 14) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CNPJ inválido",
                path: ["cnpj"],
            });
        }
    }
    if (data.type === "EMPLOYEE") {
        if (!data.companyCode || data.companyCode.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Código da empresa obrigatório",
                path: ["companyCode"],
            });
        }
    }
});

export type RegisterForm = z.infer<typeof registerSchema>;