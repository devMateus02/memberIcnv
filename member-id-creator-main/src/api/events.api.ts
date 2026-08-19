import api from "./http";
import { ChurchEvent, EventFormData } from "@/types/event";

export const getEvents = async (): Promise<ChurchEvent[]> => {
  const response = await api.get("/events");
  return response.data;
};

export const createEvent = async (data: EventFormData) => {
  const response = await api.post("/events", data);
  return response.data;
};

export const updateEvent = async (id: string, data: EventFormData) => {
  const response = await api.put(`/events/${id}`, data);
  return response.data;
};

export const uploadEventImage = async (imageBase64: string): Promise<string> => {
  const response = await api.post("/upload/event-image", { imageBase64 });
  return response.data.url;
};
