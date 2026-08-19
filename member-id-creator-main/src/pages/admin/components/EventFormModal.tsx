import { useEffect, useRef, useState } from "react";
import { ImageUp, Loader2, X } from "lucide-react";
import { createEvent, updateEvent, uploadEventImage } from "@/api/events.api";
import { ChurchEvent, EventFormData, EventStatus, initialEventFormData } from "@/types/event";
import { EVENT_STATUS_LABELS } from "@/lib/eventStatus";
import { StatusModal } from "@/components/StatusModal";

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wide text-blue-500">{label}</label>
      {children}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface EventFormModalProps {
  event?: ChurchEvent | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EventFormModal({ event, onClose, onSaved }: EventFormModalProps) {
  const isEditing = !!event;

  const [form, setForm] = useState<EventFormData>(initialEventFormData);
  const [multiDay, setMultiDay] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!event) {
      setForm(initialEventFormData);
      setMultiDay(false);
      return;
    }

    setForm({
      name: event.name || "",
      description: event.description || "",
      image_url: event.image_url || "",
      event_time: event.event_time || "",
      start_date: event.start_date?.split("T")[0] || "",
      end_date: event.end_date?.split("T")[0] || "",
      status: event.status,
    });
    setMultiDay(!!event.end_date);
  }, [event]);

  const handleChange = (field: keyof EventFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const base64 = await fileToBase64(file);
      const url = await uploadEventImage(base64);
      handleChange("image_url", url);
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
      setStatusModal({ type: "error", title: "Não foi possível enviar a imagem" });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.event_time || !form.start_date) {
      setStatusModal({
        type: "error",
        title: "Preencha os campos obrigatórios",
        message: "Nome, horário e data de início são obrigatórios.",
      });
      return;
    }

    setSaving(true);
    try {
      const payload: EventFormData = {
        ...form,
        end_date: multiDay ? form.end_date : "",
      };

      if (isEditing) {
        await updateEvent(event!.id, payload);
      } else {
        await createEvent(payload);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      console.error("Erro ao salvar evento:", err);
      setStatusModal({
        type: "error",
        title: "Não foi possível salvar o evento",
        message: err.response?.data?.error,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <StatusModal
        open={!!statusModal}
        type={statusModal?.type ?? "success"}
        title={statusModal?.title ?? ""}
        message={statusModal?.message}
        onClose={() => setStatusModal(null)}
      />

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold text-gray-700">{isEditing ? "Editar evento" : "Novo evento"}</h3>
          <button onClick={onClose} className="text-xl" aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="space-y-4 p-4">
          <Field label="Nome do evento">
            <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Imagem (opcional)">
            <div className="flex items-center gap-3">
              {form.image_url ? (
                <div className="relative h-16 w-16 shrink-0">
                  <img src={form.image_url} alt="" className="h-16 w-16 rounded-lg object-cover border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => handleChange("image_url", "")}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                    aria-label="Remover imagem"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:border-blue-300 disabled:opacity-60"
              >
                {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
                {form.image_url ? "Trocar imagem" : "Adicionar imagem"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Horário">
              <input
                type="time"
                value={form.event_time}
                onChange={(e) => handleChange("event_time", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value as EventStatus)}
                className={inputCls}
              >
                {(Object.keys(EVENT_STATUS_LABELS) as EventStatus[]).map((key) => (
                  <option key={key} value={key}>
                    {EVENT_STATUS_LABELS[key]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={multiDay}
              onChange={(e) => setMultiDay(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Evento de vários dias
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de início">
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className={inputCls}
              />
            </Field>
            {multiDay && (
              <Field label="Data de término">
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                  className={inputCls}
                />
              </Field>
            )}
          </div>

          <Field label="Descrição (opcional)">
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t bg-gray-50 px-4 py-3">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar evento"}
          </button>
        </div>
      </div>
    </div>
  );
}
