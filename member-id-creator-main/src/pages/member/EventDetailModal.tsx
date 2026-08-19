import { CalendarDays, Clock } from "lucide-react";
import { ChurchEvent } from "@/types/event";
import { EVENT_STATUS_BADGE_CLASS, EVENT_STATUS_LABELS } from "@/lib/eventStatus";

function formatLongDate(value: string): string {
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatTime(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 5);
}

interface EventDetailModalProps {
  event: ChurchEvent;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const cancelled = event.status === "cancelled";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {event.image_url ? (
          <img src={event.image_url} alt="" className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-24 w-full items-center justify-center bg-blue-50">
            <CalendarDays className="h-10 w-10 text-blue-300" />
          </div>
        )}

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className={`text-lg font-bold text-slate-800 ${cancelled ? "line-through text-slate-400" : ""}`}>
              {event.name}
            </h2>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${EVENT_STATUS_BADGE_CLASS[event.status]}`}>
              {EVENT_STATUS_LABELS[event.status]}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-blue-500" />
              <span>
                {formatLongDate(event.start_date)}
                {event.end_date ? ` até ${formatLongDate(event.end_date)}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-blue-500" />
              <span>{formatTime(event.event_time)}</span>
            </div>
          </div>

          {event.description && (
            <p className="whitespace-pre-line text-sm text-slate-600">{event.description}</p>
          )}
        </div>

        <div className="border-t px-5 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
