import { onlyNumbers } from "./mask";

export const isValidCPF = (cpf: string) => {
    cpf = onlyNumbers(cpf);

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;
    if (firstDigit !== Number(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;

    return secondDigit === Number(cpf[10]);
};

export const isValidCNPJ = (cnpj: string) => {
    cnpj = onlyNumbers(cnpj);

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    const calc = (length: number) => {
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += Number(cnpj[length - i]) * pos--;
            if (pos < 2) pos = 9;
        }

        const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        return result;
    };

    const digit1 = calc(12);
    const digit2 = calc(13);

    return digit1 === Number(cnpj[12]) && digit2 === Number(cnpj[13]);
};

export const isValidEmail = (email: string) => {
    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) return false;

    if (email.includes("..")) return false;

    const [local, domain] = email.split("@");

    if (!local || !domain) return false;

    if (local.length > 64) return false;
    if (domain.length > 255) return false;

    if (domain.startsWith("-") || domain.endsWith("-")) return false;
    if (domain.startsWith(".") || domain.endsWith(".")) return false;

    return true;
};