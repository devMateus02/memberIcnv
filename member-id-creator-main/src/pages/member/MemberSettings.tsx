import { useEffect, useRef, useState } from "react";
import { Camera, ImageUp, Loader2, X } from "lucide-react";
import { getUserProfile, updateUser, uploadSelfie } from "@/api/users.api";
import { StatusModal } from "@/components/StatusModal";
import { SelfieCapture } from "@/components/SelfieCapture";

const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8MB

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

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export default function MemberSettings() {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUserProfile()
      .then(setForm)
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
        setStatusModal({ type: "error", title: "Erro ao carregar seus dados" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((f: any) => ({ ...f, [field]: value }));
  };

  // ministérios não entram no payload: quem gerencia é o admin (ver [[member-self-edit]])
  const buildPayload = (data: any) => {
    const { ministries, ...payload } = data;
    return payload;
  };

  const persist = async (data: any) => {
    await updateUser(data.id, buildPayload(data));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusModal(null);
    try {
      await persist(form);
      setStatusModal({ type: "success", title: "Dados atualizados com sucesso" });
    } catch (err: any) {
      setStatusModal({
        type: "error",
        title: "Não foi possível salvar",
        message: err.response?.data?.error || "Erro ao salvar suas informações",
      });
    } finally {
      setSaving(false);
    }
  };

  const applyNewPhoto = async (imageBase64: string) => {
    setStatusModal(null);
    try {
      const selfie_url = await uploadSelfie(imageBase64, form.selfie_url);
      const updated = { ...form, selfie_url };
      setForm(updated);
      await persist(updated);
      setStatusModal({ type: "success", title: "Foto atualizada com sucesso" });
    } catch (err) {
      console.error("Erro ao atualizar foto:", err);
      setStatusModal({ type: "error", title: "Não foi possível atualizar a foto" });
      throw err;
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_SIZE) {
      setStatusModal({ type: "error", title: "Foto muito grande", message: "A foto deve ter no máximo 8MB" });
      e.target.value = "";
      return;
    }

    setUploadingPhoto(true);
    try {
      const base64 = await fileToBase64(file);
      await applyNewPhoto(base64);
    } catch {
      // erro já exibido pelo applyNewPhoto
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleCameraConfirm = async (imageBase64: string) => {
    await applyNewPhoto(imageBase64);
    setCameraOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-xl font-bold text-foreground">Configurações da conta</h1>

      <StatusModal
        open={!!statusModal}
        type={statusModal?.type ?? "success"}
        title={statusModal?.title ?? ""}
        message={statusModal?.message}
        onClose={() => setStatusModal(null)}
      />

      {/* Foto */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative h-20 w-20 shrink-0">
          {form.selfie_url ? (
            <img
              src={form.selfie_url}
              alt={form.name}
              className="h-20 w-20 rounded-full border-2 border-blue-200 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100 text-xl font-semibold text-blue-700">
              {getInitials(form.name)}
            </div>
          )}
          {uploadingPhoto && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">Foto do perfil</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:border-blue-300 disabled:opacity-60"
            >
              <ImageUp className="h-4 w-4" />
              Da galeria
            </button>
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              disabled={uploadingPhoto}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:border-blue-300 disabled:opacity-60"
            >
              <Camera className="h-4 w-4" />
              Tirar foto
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      {cameraOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Tirar foto</h3>
              <button onClick={() => setCameraOpen(false)} aria-label="Fechar">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <SelfieCapture onConfirm={handleCameraConfirm} confirmLabel="Usar essa foto" />
          </div>
        </div>
      )}

      {/* Dados pessoais */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-blue-600">Dados pessoais</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Nome">
            <input value={form.name || ""} onChange={(e) => handleChange("name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Telefone principal">
            <input value={form.phone1 || ""} onChange={(e) => handleChange("phone1", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Telefone secundário">
            <input value={form.phone2 || ""} onChange={(e) => handleChange("phone2", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Sexo">
            <select value={form.sex || ""} onChange={(e) => handleChange("sex", e.target.value)} className={inputCls}>
              <option value="">—</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </Field>
          <Field label="Nascimento">
            <input
              type="date"
              value={form.birth_date?.split("T")[0] || ""}
              onChange={(e) => handleChange("birth_date", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Nome da mãe">
            <input value={form.mother_name || ""} onChange={(e) => handleChange("mother_name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Nome do pai">
            <input value={form.father_name || ""} onChange={(e) => handleChange("father_name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Batismo">
            <input
              type="date"
              value={form.baptism_date?.split("T")[0] || ""}
              onChange={(e) => handleChange("baptism_date", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {/* Endereço */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-blue-600">Endereço</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Rua">
            <input value={form.address_street || ""} onChange={(e) => handleChange("address_street", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Número">
            <input value={form.address_number || ""} onChange={(e) => handleChange("address_number", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Complemento">
            <input
              value={form.address_complement || ""}
              onChange={(e) => handleChange("address_complement", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Bairro">
            <input value={form.neighborhood || ""} onChange={(e) => handleChange("neighborhood", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Cidade">
            <input value={form.city || ""} onChange={(e) => handleChange("city", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Estado">
            <input value={form.state || ""} onChange={(e) => handleChange("state", e.target.value)} className={inputCls} />
          </Field>
          <Field label="CEP">
            <input value={form.zip_code || ""} onChange={(e) => handleChange("zip_code", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Ministérios (somente leitura — gerenciado pela administração) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-blue-600">Ministérios</h2>
        <div className="flex flex-wrap gap-2">
          {form.ministries?.filter(Boolean).length ? (
            form.ministries.filter(Boolean).map((name: string) => (
              <span key={name} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {name}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">Nenhum ministério vinculado</span>
          )}
        </div>
        <p className="text-xs text-slate-400">Para alterar seus ministérios, procure a secretaria.</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}
