import { z } from 'zod';
import { onlyNumbers } from '../helpers/mask';
import { isValidCNPJ, isValidCPF, isValidEmail } from '../helpers/validations';

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
    name: z
        .string()
        .min(4, "O nome deve ter entre 4 e 70 caracteres")
        .max(70, "O nome deve ter entre 4 e 70 caracteres"),
    document: z
        .string()
        .min(1, "Documento é obrigatório")
        .transform(onlyNumbers),
    companyCode: z.string().optional(),
    email: z
        .string()
        .min(1, "Email é obrigatório")
        .email("Email inválido")
        .refine(isValidEmail, "Email inválido"),
    password: z.string().min(6, "A senha deve conter no minímo 6 caracteres"),
}).superRefine((data, ctx) => {
    if (data.type === "USER") {
        if (!isValidCPF(data.document)) {
            ctx.addIssue({
                path: ["document"],
                code: z.ZodIssueCode.custom,
                message: "CPF inválido",
            });
        }

        if (!data.companyCode) {
            ctx.addIssue({
                path: ["companyCode"],
                code: z.ZodIssueCode.custom,
                message: "Código da empresa é obrigatório",
            });
        }
    }

    if (data.type === "COMPANY") {
        if (!isValidCNPJ(data.document)) {
            ctx.addIssue({
                path: ["document"],
                code: z.ZodIssueCode.custom,
                message: "CNPJ inválido",
            });
        }
    }
});;

export type RegisterForm = z.infer<typeof registerSchema>;