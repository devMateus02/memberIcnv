import api  from './http';

export interface Ministry {
  id: string;
  name: string;
}

export const getMinistries = async (): Promise<Ministry[]> => {
  const response = await api.get('/ministries');
  return response.data;
};


