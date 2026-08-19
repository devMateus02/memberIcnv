export type EventStatus = "scheduled" | "cancelled" | "postponed" | "moved_up";

export interface ChurchEvent {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  event_time: string; // "HH:MM:SS"
  start_date: string; // "YYYY-MM-DD"
  end_date: string | null;
  status: EventStatus;
  created_at?: string;
  updated_at?: string;
}

export interface EventFormData {
  name: string;
  description: string;
  image_url: string;
  event_time: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
}

export const initialEventFormData: EventFormData = {
  name: "",
  description: "",
  image_url: "",
  event_time: "",
  start_date: "",
  end_date: "",
  status: "scheduled",
};
