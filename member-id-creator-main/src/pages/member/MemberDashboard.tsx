import { useEffect, useState } from "react";
import { MemberCard } from "./MemberCard";
import { getUserProfile } from "../../api/users.api";

type MemberStatus = "pending" | "active" | "blocked" | "rejected";

export default function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMember = async () => {
      try {
        const data = await getUserProfile();
        setMember(data);
      } catch (error) {
        console.error("Erro ao carregar membro:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando dados...</p>
      </div>
    );
  }

  if (!member) return null;

  const status: MemberStatus = member.status;

  // ⏳ PENDENTE
  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Cadastro em análise
          </h2>
          <p className="text-gray-500 text-sm">
            Seu cadastro foi recebido e está sendo analisado pela administração.
            Assim que for aprovado, sua carteirinha ficará disponível aqui.
          </p>
        </div>
      </div>
    );
  }

  // ❌ BLOQUEADO / RECUSADO
  if (status === "blocked" || status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Cadastro não aprovado
          </h2>
          <p className="text-gray-500 text-sm">
            Seu cadastro não foi aceito. Caso tenha dúvidas, procure a secretaria.
          </p>
        </div>
      </div>
    );
  }

  // ✅ ATIVO
  if (status === "active") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <MemberCard />
      </div>
    );
  }

  return null;
}
