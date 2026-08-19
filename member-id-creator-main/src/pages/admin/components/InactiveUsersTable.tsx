import { useEffect, useState } from "react";
import { UserX } from "lucide-react";
import { getUsers } from "@/api/users.api";
import { activateUser } from "@/api/admin.api";

interface User {
  id: string;
  name: string;
  email: string;
  phone1: string;
  city: string;
  state: string;
  status: string;
  role: string;
  selfie_url?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function InactiveUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactivatingId, setReactivatingId] = useState<string | null>(null);

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

  useEffect(() => {
    loadUsers();
  }, []);

  const inactiveUsers = users.filter((u) => u.role === "member" && u.status === "inactive");

  const handleReactivate = async (id: string) => {
    setReactivatingId(id);
    try {
      await activateUser(id);
      await loadUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setReactivatingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
          <UserX className="h-4 w-4 text-red-600" />
        </div>
        <p className="text-sm font-semibold text-slate-800">Usuários inativos</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-slate-400">Carregando…</div>
      ) : inactiveUsers.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-sm text-slate-400">
          Nenhum usuário inativo
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Nome", "Email", "Telefone", "Cidade", ""].map((h) => (
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
              {inactiveUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {user.selfie_url ? (
                        <img
                          src={user.selfie_url}
                          alt={user.name}
                          className="h-7 w-7 rounded-full object-cover border border-red-100"
                        />
                      ) : (
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-700">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <span className="font-medium text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3 text-slate-500">{user.phone1}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.city}/{user.state}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleReactivate(user.id)}
                      disabled={reactivatingId === user.id}
                      className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-60"
                    >
                      {reactivatingId === user.id ? "Reativando..." : "Reativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
