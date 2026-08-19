import { useEffect, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { getEvents } from "@/api/events.api";
import { ChurchEvent } from "@/types/event";
import { EVENT_STATUS_BADGE_CLASS, EVENT_STATUS_LABELS } from "@/lib/eventStatus";
import { EventFormModal } from "./EventFormModal";

function formatDate(value?: string | null): string {
  if (!value) return "";
  const datePart = value.split("T")[0];
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

function formatTime(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 5);
}

export function EventsManager() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);

  const load = () => {
    setLoading(true);
    getEvents()
      .then(setEvents)
      .catch((err) => console.error("Erro ao carregar eventos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const openEdit = (event: ChurchEvent) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Agenda de eventos</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" />
          Novo evento
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-slate-400">Carregando…</div>
      ) : events.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-sm text-slate-400">
          Nenhum evento cadastrado
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => openEdit(event)}
              className="flex w-full items-center gap-4 px-6 py-3 text-left transition hover:bg-blue-50/60"
            >
              {event.image_url ? (
                <img src={event.image_url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <CalendarDays className="h-4 w-4 text-blue-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{event.name}</p>
                <p className="text-xs text-slate-500">
                  {formatDate(event.start_date)}
                  {event.end_date ? ` até ${formatDate(event.end_date)}` : ""} · {formatTime(event.event_time)}
                </p>
              </div>

              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${EVENT_STATUS_BADGE_CLASS[event.status]}`}>
                {EVENT_STATUS_LABELS[event.status]}
              </span>
            </button>
          ))}
        </div>
      )}

      {modalOpen && (
        <EventFormModal
          event={editingEvent}
          onClose={() => setModalOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
