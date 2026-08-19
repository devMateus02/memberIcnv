import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDay,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { getEvents } from "@/api/events.api";
import { ChurchEvent } from "@/types/event";
import { EVENT_STATUS_BADGE_CLASS, EVENT_STATUS_BORDER_CLASS, EVENT_STATUS_LABELS } from "@/lib/eventStatus";
import { EventDetailModal } from "./EventDetailModal";

const WEEKDAY_LETTERS = ["D", "S", "T", "Q", "Q", "S", "S"];

function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// evita reinterpretar o valor UTC do backend no fuso do navegador
function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatShortDate(value: string): string {
  const [year, month, day] = value.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

function formatTime(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 5);
}

function EventCard({ event, onClick }: { event: ChurchEvent; onClick: () => void }) {
  const cancelled = event.status === "cancelled";

  return (
    <button
      onClick={onClick}
      className={`flex w-full gap-3 rounded-lg border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:bg-slate-50 border-l-4 ${EVENT_STATUS_BORDER_CLASS[event.status]}`}
    >
      {event.image_url && (
        <img src={event.image_url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`text-sm font-medium text-slate-800 ${cancelled ? "line-through text-slate-400" : ""}`}>
            {event.name}
          </p>
          {event.status !== "scheduled" && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${EVENT_STATUS_BADGE_CLASS[event.status]}`}>
              {EVENT_STATUS_LABELS[event.status]}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500">
          {formatTime(event.event_time)}
          {event.end_date ? ` · até ${formatShortDate(event.end_date)}` : ""}
        </p>

        {event.description && <p className="mt-1 text-xs text-slate-600">{event.description}</p>}
      </div>
    </button>
  );
}

export default function MemberAgenda() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((err) => console.error("Erro ao carregar eventos:", err))
      .finally(() => setLoading(false));
  }, []);

  // mapeia cada dia coberto por um evento (do início ao fim) para a lista de eventos daquele dia
  const eventsByDate = useMemo(() => {
    const map = new Map<string, ChurchEvent[]>();

    for (const event of events) {
      const start = parseDateOnly(event.start_date);
      const end = event.end_date ? parseDateOnly(event.end_date) : start;

      const cursor = new Date(start);
      while (cursor <= end) {
        const key = dateKey(cursor);
        const list = map.get(key) || [];
        list.push(event);
        map.set(key, list);
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return map;
  }, [events]);

  const goToMonth = (next: Date) => {
    setCurrentMonth(next);
    const today = new Date();
    setSelectedDate(isSameMonth(next, today) ? today : startOfMonth(next));
  };

  const gridDays = useMemo(() => {
    const first = startOfMonth(currentMonth);
    const last = endOfMonth(currentMonth);
    const leadingBlanks = getDay(first); // 0 = domingo

    const days: Date[] = [];
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return { leadingBlanks, days };
  }, [currentMonth]);

  const selectedDayEvents = eventsByDate.get(dateKey(selectedDate)) || [];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando agenda...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-blue-600" />
        <h1 className="text-xl font-bold text-foreground">Agenda</h1>
      </div>

      {/* navegação de mês */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
        <button
          onClick={() => goToMonth(subMonths(currentMonth, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="text-sm font-semibold capitalize text-slate-800">
          {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
        </p>

        <button
          onClick={() => goToMonth(addMonths(currentMonth, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* grade do calendário */}
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-slate-400">
          {WEEKDAY_LETTERS.map((letter, i) => (
            <div key={i} className="py-1">
              {letter}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: gridDays.leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {gridDays.days.map((day) => {
            const key = dateKey(day);
            const dayEvents = eventsByDate.get(key) || [];
            const hasEvents = dayEvents.length > 0;
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(day)}
                className={`relative flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-sm transition ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : hasEvents
                    ? "bg-green-100 text-green-800 font-semibold hover:bg-green-200"
                    : "text-slate-700 hover:bg-slate-100"
                } ${isToday && !isSelected ? "ring-2 ring-inset ring-blue-400" : ""}`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* eventos do dia selecionado */}
      <div className="space-y-2">
        <p className="text-sm font-semibold capitalize text-slate-700">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>

        {selectedDayEvents.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
            Nenhum evento neste dia
          </p>
        ) : (
          selectedDayEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
          ))
        )}
      </div>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
