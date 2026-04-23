import { RegisterForm } from "../schemas/auth-schema";
import { RegisterCompanyDTO, RegisterUserDTO } from "../types/auth-types";
import { api } from "./request";

export const registerUser = async (data: RegisterUserDTO) => {
  const url = "/auth/register/user"


  const { data: response } = await api.post(url, data);

  return response;
};

export const registerCompany = async (data: RegisterCompanyDTO) => {
  const url = "/auth/register/company"

  const { data: response } = await api.post(url, data);

  return response;
};