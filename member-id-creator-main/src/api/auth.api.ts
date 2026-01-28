import  api  from './http';
import { RegistrationData } from '@/types/registration';

export const registerUser = async (data: RegistrationData) => {
  const response = await api.post('/auth/register', data);
  console.log("REGISTER USER RESPONSE:", response.data);
  return response.data;
};




export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};


export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};