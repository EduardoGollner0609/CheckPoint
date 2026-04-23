import axios from "axios";
import { UseFormSetError } from "react-hook-form";
import { ValidationError } from "../types/errors-types";

export const api = axios.create({
    baseURL: "http://192.168.27.112:8080"
})

export function backendErrorInForm(errorsResponse: ValidationError[], setError: UseFormSetError<any>) {
    errorsResponse.forEach(({ fieldName, message }) => {
        setError(fieldName, {
            message: message
        })
    });
}
