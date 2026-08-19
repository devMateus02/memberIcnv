import { EventStatus } from "@/types/event";

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: "Agendado",
  cancelled: "Cancelado",
  postponed: "Adiado",
  moved_up: "Antecipado",
};

export const EVENT_STATUS_BADGE_CLASS: Record<EventStatus, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  postponed: "bg-amber-100 text-amber-700",
  moved_up: "bg-emerald-100 text-emerald-700",
};

export const EVENT_STATUS_DOT_CLASS: Record<EventStatus, string> = {
  scheduled: "bg-blue-500",
  cancelled: "bg-red-500",
  postponed: "bg-amber-500",
  moved_up: "bg-emerald-500",
};

export const EVENT_STATUS_BORDER_CLASS: Record<EventStatus, string> = {
  scheduled: "border-l-blue-500",
  cancelled: "border-l-red-500",
  postponed: "border-l-amber-500",
  moved_up: "border-l-emerald-500",
};
