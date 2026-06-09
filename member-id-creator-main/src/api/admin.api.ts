import api  from './http';
import { RegistrationData } from '@/types/registration';

export const pendingUser = async (data: RegistrationData) => {
  const res = await api.get('/admin/pending');
  console.log("PENDING USERS:", res.data);
  return res.data;
};

export const getUsersStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};