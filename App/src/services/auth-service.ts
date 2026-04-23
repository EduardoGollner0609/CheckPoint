import { RegisterForm } from "../schemas/auth-schema";
import { api } from "./request";

export const register = async (data: RegisterForm) => {
  const url =
    data.type === "COMPANY"
      ? "/auth/register/company"
      : "/auth/register/user";

  const { data: response } = await api.post(url, data);

  return response;
};