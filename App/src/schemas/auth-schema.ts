import { z } from 'zod';
import { onlyNumbers } from '../helpers/mask';
import { isValidCNPJ, isValidCPF, isValidEmail } from '../helpers/validations';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email é obrigatório")
        .email("Email inválido")
        .refine(isValidEmail, "Email inválido"),
    password: z.string().min(6, "A senha deve conter no minímo 6 caracteres")
});

export type LoginForm = z.infer<typeof loginSchema>;
const baseSchema = z.object({
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
    password: z.string().min(6, "A senha deve conter no minímo 6 caracteres")
});


const companySchema = baseSchema.extend({
    type: z.literal("COMPANY"),
}).refine((data) => isValidCNPJ(data.document), {
    path: ["document"],
    message: "CNPJ inválido",
});

const employeeSchema = baseSchema.extend({
    type: z.literal("EMPLOYEE"),
    companyCode: z.string().min(1, "Código da empresa é obrigatório"),
}).refine((data) => isValidCPF(data.document), {
    path: ["document"],
    message: "CPF inválido",
});

const selfEmployedSchema = baseSchema.extend({
    type: z.literal("SELF_EMPLOYED"),
}).refine((data) => isValidCPF(data.document), {
    path: ["document"],
    message: "CPF inválido",
});

export const registerSchema = z.discriminatedUnion("type", [
    companySchema,
    employeeSchema,
    selfEmployedSchema,
]);

export type RegisterForm = z.infer<typeof registerSchema>;



