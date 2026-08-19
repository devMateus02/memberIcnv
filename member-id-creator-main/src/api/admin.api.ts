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

export const deactivateUser = async (id: string) => {
  const response = await api.put(`/admin/users/${id}/deactivate`);
  return response.data;
};

export const activateUser = async (id: string) => {
  const response = await api.put(`/admin/users/${id}/activate`);
  return response.data;
};