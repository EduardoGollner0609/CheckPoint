import { LoginRequestDTO, RegisterCompanyDTO, RegisterEmployeeDTO, RegisterSelfEmployedDTO } from "../types/auth-types";
import { api } from "../utils/request";

export const registerCompany = async (data: RegisterCompanyDTO) => {
  const url = "/auth/register/company"

  const { data: response } = await api.post(url, data);

  return response;
};

export const registerEmployee = async (data: RegisterEmployeeDTO) => {
  const url = "/auth/register/employee"

  const { data: response } = await api.post(url, data);

  return response;
};

export const registerSelfEmployed = async (data: RegisterSelfEmployedDTO) => {
  const url = "/auth/register/self-employed"

  const { data: response } = await api.post(url, data);

  return response;
};

export const login = async (data: LoginRequestDTO) => {
  const url = "/auth/login"

  const { data: response } = await api.post(url, data);

  return response
}