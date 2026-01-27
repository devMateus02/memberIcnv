import api  from './http';
import { RegistrationData } from '@/types/registration';

export const pendingUser = async (data: RegistrationData) => {
  const res = await api.get('/admin/pending');
  return res.data;
};
