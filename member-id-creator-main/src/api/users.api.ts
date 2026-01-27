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
}
