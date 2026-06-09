import  api  from "./http";

export const uploadSelfie = async (imageBase64: string): Promise<string> => {
  const response = await api.post("/upload/selfie", {
    imageBase64,
  });

  return response.data.url;
};

export const getUserProfile = async (): Promise<any> => {
  const response = await api.get("/me");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/allUser");
  return response.data;
};

export const updateUser = async (
  id: string,
  data: any
) => {
  const response = await api.put(
    `/users/${id}`,
    data
  );

  return response.data;
};