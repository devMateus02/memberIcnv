// src/pages/admin/components/UsersTable.tsx

import { useEffect, useState } from "react";
import { getUsers } from "@/api/users.api";
import { updateUser } from "@/api/users.api";
import { getMinistries } from "@/api/ministries.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import {
  Users,
  Search,
  IdCard,
  Info,
  MapPin,
  Church,
 
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  status: string;
  role: string;
  city: string;
  state: string;
  selfie_url?: string;
  sex?: string;
  mother_name?: string;
  father_name?: string;
  birth_date?: string;
  baptism_date?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  zip_code?: string;
  ministries?: any[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const statusConfig: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  approved: {
    label: "Aprovado",
    className: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-500",
  },
  pending: {
    label: "Pendente",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  rejected: {
    label: "Rejeitado",
    className: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
  },
};

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [ministries, setMinistries] = useState<any[]>([]);
  const [openMinistries, setOpenMinistries] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);
  useEffect(() => {
    loadMinistries();
  }, []);

  const toggleMinistry = (ministry: any) => {
    const exists = form.ministries?.some((m: any) => m.id === ministry.id);
    setForm({
      ...form,
      ministries: exists
        ? form.ministries.filter((m: any) => m.id !== ministry.id)
        : [...(form.ministries || []), ministry],
    });
  };

  const loadMinistries = async () => {
    try {
      const data = await getMinistries();
      setMinistries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone1?.toLowerCase().includes(term)
    );
  });

  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const handleSave = async () => {
    try {
      await updateUser(selectedUser!.id, form);
      setSelectedUser(form);
      setEditing(false);
      await loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // ── Shared field wrapper ──────────────────────────────────────────────────
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

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-default disabled:bg-slate-100 disabled:text-slate-500";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* ── Card header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Membros cadastrados
            </p>
         
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Buscar por nome, email ou telefone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-72 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-slate-400">
          Carregando…
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Nome",
                  "Email",
                  "Telefone",
                  "Cidade",
                  "Status",
                  "Perfil",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.filter(users=> users.role === 'member').map((user) => {
                const st = statusConfig[user.status] ?? statusConfig.pending;
                return (
                  <tr
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      setForm(user);
                      setOpen(true);
                    }}
                    className="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/60"
                  >
                    {/* Nome + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {user.selfie_url ? (
                          <img
                            src={user.selfie_url}
                            alt={user.name}
                            className="h-7 w-7 rounded-full object-cover border border-blue-100"
                          />
                        ) : (
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <span className="font-medium text-slate-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{user.email}</td>
                    <td className="px-4 py-3 text-slate-500">{user.phone1}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {user.city}/{user.state}
                    </td>
                    <td className="px-4 py-3">
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium
      ${
        user.status === "active"
          ? "bg-green-100 text-green-700"
          : user.status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : user.status === "inactive"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700"
      }
    `}
  >
    {user.status}
  </span>
</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {user.role}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-2.5">
       
      </div>

      {/* ════════════════════════════════════════════════
          MODAL
      ════════════════════════════════════════════════ */}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setEditing(false);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-0">
          {/* Modal header */}
          <div className="flex items-center gap-3  px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-800">
              <IdCard className="h-4 w-4 text-blue-200" />
            </div>
            <DialogTitle className="text-sm font-semibold text-black">
              {editing
                ? "Editar membro"
                : (selectedUser?.name ?? "Ficha do membro")}
            </DialogTitle>
          </div>

          {selectedUser && (
            <div className="space-y-6 p-6">
              {/* ── Hero: foto + campos básicos ── */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                {selectedUser.selfie_url ? (
                  <img
                    src={selectedUser.selfie_url}
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-blue-200"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700 border-2 border-blue-200">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    disabled={!editing}
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Nome"
                  />
                  <input
                    disabled={!editing}
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputCls}
                    placeholder="Email"
                  />
                  <input
                    disabled={!editing}
                    value={form.phone1 || ""}
                    onChange={(e) =>
                      setForm({ ...form, phone1: e.target.value })
                    }
                    className={inputCls}
                    placeholder="Telefone"
                  />
                </div>
              </div>

              {/* ── Dados Pessoais ── */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Dados Pessoais
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field label="Sexo">
                    <input
                      disabled={!editing}
                      value={form.sex || ""}
                      onChange={(e) =>
                        setForm({ ...form, sex: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Data de Nascimento">
                    <input
                      type="date"
                      disabled={!editing}
                      value={form.birth_date?.split("T")[0] || ""}
                      onChange={(e) =>
                        setForm({ ...form, birth_date: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Nome da Mãe">
                    <input
                      disabled={!editing}
                      value={form.mother_name || ""}
                      onChange={(e) =>
                        setForm({ ...form, mother_name: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Nome do Pai">
                    <input
                      disabled={!editing}
                      value={form.father_name || ""}
                      onChange={(e) =>
                        setForm({ ...form, father_name: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Telefone Secundário">
                    <input
                      disabled={!editing}
                      value={form.phone2 || ""}
                      onChange={(e) =>
                        setForm({ ...form, phone2: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Data de Batismo">
                    <input
                      type="date"
                      disabled={!editing}
                      value={form.baptism_date?.split("T")[0] || ""}
                      onChange={(e) =>
                        setForm({ ...form, baptism_date: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Endereço ── */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Endereço
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field label="Rua">
                    <input
                      disabled={!editing}
                      value={form.address_street || ""}
                      onChange={(e) =>
                        setForm({ ...form, address_street: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Número">
                    <input
                      disabled={!editing}
                      value={form.address_number || ""}
                      onChange={(e) =>
                        setForm({ ...form, address_number: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Complemento">
                    <input
                      disabled={!editing}
                      value={form.address_complement || ""}
                      onChange={(e) =>
                        setForm({ ...form, address_complement: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Bairro">
                    <input
                      disabled={!editing}
                      value={form.neighborhood || ""}
                      onChange={(e) =>
                        setForm({ ...form, neighborhood: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Cidade">
                    <input
                      disabled={!editing}
                      value={form.city || ""}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Estado">
                    <input
                      disabled={!editing}
                      value={form.state || ""}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="CEP">
                    <input
                      disabled={!editing}
                      value={form.zip_code || ""}
                      onChange={(e) =>
                        setForm({ ...form, zip_code: e.target.value })
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Ministérios ── */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Church className="h-4 w-4 text-blue-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Ministérios
                  </h3>
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {form.ministries?.filter(Boolean).length ? (
                        form.ministries.filter(Boolean).map((ministry: any) => (
                          <span
                            key={ministry.id}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                          >
                            {ministry.name}

                            <button
                              className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
                              onClick={() => toggleMinistry(ministry)}
                            />
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          Nenhum ministério selecionado
                        </span>
                      )}
                    </div>

                    <Popover
                      open={openMinistries}
                      onOpenChange={setOpenMinistries}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between border-slate-200 bg-slate-50 text-sm font-normal text-slate-600 hover:bg-blue-50 hover:border-blue-300"
                        >
                          Selecionar ministérios
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar ministério..." />
                          <CommandEmpty>
                            Nenhum ministério encontrado.
                          </CommandEmpty>
                          <CommandGroup>
                            {ministries.map((ministry) => (
                              <CommandItem
                                key={ministry.id}
                                onSelect={() => toggleMinistry(ministry)}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 text-blue-600 ${
                                    form.ministries?.some(
                                      (m: any) => m.id === ministry.id,
                                    )
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {ministry.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {form.ministries?.filter(Boolean).length ? (
                      form.ministries.filter(Boolean).map((ministry: any) => (
                        <span
                          key={ministry.id}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {ministry.name}

                          <button
                            className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
                            onClick={() => toggleMinistry(ministry)}
                          />
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">
                        Nenhum ministério selecionado
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ── Botões ── */}
              <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-100 bg-white pt-4">
                {editing ? (
                  <>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setForm(selectedUser);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                    >
                      Salvar alterações
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
