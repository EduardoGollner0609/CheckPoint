import { useMutation } from "@tanstack/react-query";
import { registerUser, registerCompany } from "../services/auth-service";
import { RegisterCompanyDTO, RegisterUserDTO } from "../types/auth-types";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";

type RegisterPayload = {
    type: "COMPANY" | "USER";
    data: RegisterUserDTO | RegisterCompanyDTO;
};

export function useRegister() {
    return useMutation({
        mutationFn: ({ type, data }: RegisterPayload) => {
            return type === "COMPANY"
                ? registerCompany(data as RegisterCompanyDTO)
                : registerUser(data as RegisterUserDTO);
        }, onSuccess: (_data, variables) => {
            Toast.show({
                type: "success",
                text1: variables.type === "COMPANY" ? "Empresa cadastrada!" : "Funcionário cadastrado!",
                text2: variables.type === "COMPANY"
                    ? "Sua empresa foi registrada com sucesso."
                    : "Cadastro realizado com sucesso.",
            });
        },
        onError: (error: AxiosError<any>) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Erro ao realizar cadastro";

            Toast.show({
                type: "error",
                text1: "Erro ao cadastrar",
                text2: message,
            });
        },
    });
}