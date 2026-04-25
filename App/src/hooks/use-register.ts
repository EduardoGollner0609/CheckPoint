import { useMutation } from "@tanstack/react-query";
import { registerCompany, registerEmployee, registerSelfEmployed } from "../services/auth-service";
import { RegisterCompanyDTO, RegisterEmployeeDTO, RegisterSelfEmployedDTO } from "../types/auth-types";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";

type RegisterPayload = {
    type: "COMPANY" | "EMPLOYEE" | "SELF_EMPLOYED";
    data: RegisterCompanyDTO | RegisterEmployeeDTO | RegisterSelfEmployedDTO;
};

export default function useRegister() {
    return useMutation({
        mutationKey: ['use-register'],
        mutationFn: ({ type, data }: RegisterPayload) => {
            switch (type) {
                case "COMPANY":
                    return registerCompany(data as RegisterCompanyDTO);
                case "EMPLOYEE":
                    return registerEmployee(data as RegisterEmployeeDTO);
                case "SELF_EMPLOYED":
                    return registerSelfEmployed(data as RegisterSelfEmployedDTO);
            }
        },
        onSuccess: (_data, variables) => {
            Toast.show({
                type: "success",
                text1: variables.type === "COMPANY" ? "Empresa cadastrada!" : "Usuário cadastrado!",
                text2: "Cadastro realizado com sucesso.",
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