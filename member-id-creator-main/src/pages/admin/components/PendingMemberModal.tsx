import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { updateUser } from "@/api/users.api";
import { getMinistries } from "@/api/ministries.api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wide text-blue-500">
        {label}
      </label>
      {children}
    </div>
  );
}

export function PendingMemberModal({ member, onClose, onSaved }) {
  const [lado, setLado] = useState<"frente" | "verso">("frente");
  const [form, setForm] = useState<any>({});
  const [allMinistries, setAllMinistries] = useState<any[]>([]);
  const [openMinistries, setOpenMinistries] = useState(false);
  const [saving, setSaving] = useState(false);

  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);
  const refAtual = lado === "frente" ? cardFrontRef : cardBackRef;

  // carrega lista de ministérios disponíveis
  useEffect(() => {
    getMinistries()
      .then(setAllMinistries)
      .catch((e) => console.error("Erro ao carregar ministérios:", e));
  }, []);

  // popula o form; converte ministries (pode vir string "A, B" ou array) em array de objetos {id,name}
  useEffect(() => {
    if (!member) return;

    let mins: any[] = [];
    if (Array.isArray(member.ministries)) {
      mins = member.ministries.filter(Boolean);
    } else if (typeof member.ministries === "string" && member.ministries) {
      const names = member.ministries.split(",").map((n: string) => n.trim());
      mins = names
        .filter(Boolean)
        .map((name: string) => {
          const found = allMinistries.find(
            (m) => m.name.toLowerCase() === name.toLowerCase()
          );
          return found ?? { id: name, name };
        });
    }

    setForm({ ...member, ministries: mins });
  }, [member, allMinistries]);

  const toggleMinistry = (ministry: any) => {
    const exists = form.ministries?.some((m: any) => m.id === ministry.id);
    setForm({
      ...form,
      ministries: exists
        ? form.ministries.filter((m: any) => m.id !== ministry.id)
        : [...(form.ministries || []), ministry],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // envia só ministérios com id resolvido contra a lista real (evita quebrar FK)
      const ministries = (form.ministries || []).filter((m: any) =>
        allMinistries.some((mm) => mm.id === m.id)
      );
      await updateUser(member.id, { ...form, ministries });
      onSaved?.();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
      alert("Erro ao salvar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  const getTituloCarteirinha = (m: any) => {
    const names = (m?.ministries || [])
      .map((x: any) => (x.name || "").toLowerCase())
      .join(" ");
    if (names.includes("pastoral")) return "Carteirinha de Pastor";
    if (names.includes("diáconato") || names.includes("diaconato"))
      return "Carteirinha de Diácono";
    return "Carteirinha de Membro";
  };

  const downloadPDF = async () => {
    if (!refAtual.current) return;
    refAtual.current.style.transform = "none";

    const canvas = await html2canvas(refAtual.current, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [450, 450],
    });
    pdf.addImage(imgData, "PNG", 12, 12, 200, 100);
    pdf.save(`carteirinha-${form.name}.pdf`);
  };

  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-1">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg max-h-[95vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-700">Editar Membro Pendente</h3>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">

            {/* FORMULÁRIO EDITÁVEL */}
            <div className="w-full max-w-xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Nome">
                  <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Email">
                  <input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Telefone 1">
                  <input value={form.phone1 || ""} onChange={(e) => setForm({ ...form, phone1: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Telefone 2">
                  <input value={form.phone2 || ""} onChange={(e) => setForm({ ...form, phone2: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Sexo">
                  <select value={form.sex || ""} onChange={(e) => setForm({ ...form, sex: e.target.value })} className={inputCls}>
                    <option value="">—</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </Field>
                <Field label="Nascimento">
                  <input type="date" value={form.birth_date?.split("T")[0] || ""} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Nome da Mãe">
                  <input value={form.mother_name || ""} onChange={(e) => setForm({ ...form, mother_name: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Nome do Pai">
                  <input value={form.father_name || ""} onChange={(e) => setForm({ ...form, father_name: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Batismo">
                  <input type="date" value={form.baptism_date?.split("T")[0] || ""} onChange={(e) => setForm({ ...form, baptism_date: e.target.value })} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Rua">
                  <input value={form.address_street || ""} onChange={(e) => setForm({ ...form, address_street: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Número">
                  <input value={form.address_number || ""} onChange={(e) => setForm({ ...form, address_number: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Complemento">
                  <input value={form.address_complement || ""} onChange={(e) => setForm({ ...form, address_complement: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Bairro">
                  <input value={form.neighborhood || ""} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Cidade">
                  <input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Estado">
                  <input value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputCls} />
                </Field>
                <Field label="CEP">
                  <input value={form.zip_code || ""} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} className={inputCls} />
                </Field>
              </div>

              {/* Ministérios */}
              <Field label="Ministérios">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {form.ministries?.filter(Boolean).length ? (
                      form.ministries.filter(Boolean).map((ministry: any) => (
                        <span key={ministry.id} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {ministry.name}
                          <button type="button" onClick={() => toggleMinistry(ministry)} className="opacity-60 hover:opacity-100">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Nenhum ministério selecionado</span>
                    )}
                  </div>

                  <Popover open={openMinistries} onOpenChange={setOpenMinistries}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between border-slate-200 bg-white text-sm font-normal text-slate-600 hover:bg-blue-50 hover:border-blue-300">
                        Selecionar ministérios
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar ministério..." />
                        <CommandEmpty>Nenhum ministério encontrado.</CommandEmpty>
                        <CommandGroup>
                          {allMinistries.map((ministry) => (
                            <CommandItem key={ministry.id} onSelect={() => toggleMinistry(ministry)}>
                              <Check className={`mr-2 h-4 w-4 text-blue-600 ${form.ministries?.some((m: any) => m.id === ministry.id) ? "opacity-100" : "opacity-0"}`} />
                              {ministry.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </Field>
            </div>

            {/* CARTEIRINHA */}
            <div className="flex flex-col items-center gap-4 px-3">
              <div className="origin-top">
                <div className="relative w-[420px] h-[220px]">
                  <AnimatePresence mode="wait">
                    {lado === "frente" && (
                      <motion.div key="frente" initial={{ rotateY: -180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 180, opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                        <div ref={cardFrontRef} className="w-[420px] h-[220px] rounded-xl shadow-lg overflow-hidden bg-white flex">
                          <div className="w-[140px] bg-blue-900 relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-r-[120px] bg-blue-800" />
                            <div className="relative z-10 w-28 h-28 rounded-full border-2 border-white overflow-hidden">
                              <img src={form.selfie_url} alt={`Selfie de ${form.name}`} className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" loading="eager" />
                            </div>
                          </div>
                          <div className="flex-1 px-4 py-3" style={{ backgroundImage: "url('/bg_carterinha.jpg')", backgroundSize: "cover" }}>
                            <div className="flex justify-between">
                              <div>
                                <p className="text-[11px] font-semibold">Igreja Cristã Nova Vida</p>
                                <p className="text-[10px] text-gray-600">Mesquita - RJ</p>
                              </div>
                              <img src="/Logo.png" className="w-12" />
                            </div>
                            <p className="text-center text-sm mt-2">{getTituloCarteirinha(form)}</p>
                            <div className="mt-2 text-[11px]">
                              <p><strong>Nome:</strong> {form.name}</p>
                              <p><strong>Batismo:</strong> {form.baptism_date ? format(parseISO(form.baptism_date), "dd/MM/yyyy", { locale: ptBR }) : "—"}</p>
                              <p><strong>Nascimento:</strong> {form.birth_date ? format(parseISO(form.birth_date), "dd/MM/yyyy", { locale: ptBR }) : "—"}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {lado === "verso" && (
                      <motion.div key="verso" initial={{ rotateY: 180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -180, opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                        <div ref={cardBackRef} className="w-[420px] h-[220px] rounded-xl shadow-lg relative overflow-hidden" style={{ backgroundImage: "url('/bg_carterinha.jpg')", backgroundSize: "cover" }}>
                          <svg viewBox="0 0 420 120" className="absolute bottom-0 w-full h-[190px]" preserveAspectRatio="none">
                            <path d="M0,60 C80,20 160,60 240,45 320,20 360,40 420,30 L420,120 L0,120 Z" fill="#1e3a8a" />
                          </svg>
                          <div className="relative z-10 p-4 flex gap-4">
                            <img src="Logo_trans.png" className="w-14" />
                            <div>
                              <p className="font-semibold">Igreja Cristã Nova Vida</p>
                              <p className="text-xs">Rua Crispim 115 – Mesquita</p>
                            </div>
                          </div>
                          <div className="absolute bottom-2 w-full px-4 flex justify-center text-white text-[10px] z-20">
                            <img src="assinatura.png" className="w-42 z-[10]" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button onClick={() => setLado(lado === "frente" ? "verso" : "frente")} className="px-4 py-2 bg-blue-600 text-white rounded">
                Ver {lado === "frente" ? "Verso" : "Frente"}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between px-4 py-3 border-t bg-gray-50">
          <button onClick={downloadPDF} className="px-4 py-2 bg-emerald-600 text-white rounded">
            Baixar PDF
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">Fechar</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-60">
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}