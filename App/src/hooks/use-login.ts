import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth-service";
import { LoginRequestDTO } from "../types/auth-types";
import Toast from "react-native-toast-message";
import { AxiosError } from "axios";

export default function useLogin() {
    return useMutation({
        mutationKey: ['use-login'],
        mutationFn: async (data: LoginRequestDTO) => {
            const response = await login(data);
            return response;
        },
        onSuccess: async (response) => {

            const token = response?.token;

            if (token) {
                // TODO: salvar token
                Toast.show({
                    type: "success",
                    text1: "Login feito com sucesso!",
                    text2: "Login realizado com sucesso."
                })
            }
        },
        onError: (error: AxiosError<any>) => {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Erro ao realizar login";

            Toast.show({
                type: "error",
                text1: "Erro ao fazer login",
                text2: message,
            });
        },
    });
}