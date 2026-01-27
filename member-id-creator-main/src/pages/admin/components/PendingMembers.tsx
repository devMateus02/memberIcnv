import { useEffect, useState } from "react";
import { pendingUser } from "@/api/admin.api";
import { PendingMemberCard } from "./PendingMemberCard";
import { PendingMemberModal } from "./PendingMemberModal";

export function PendingMembers() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const load = () => {
    pendingUser().then((data) => setMembers(data));
  };

  useEffect(load, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h2 className="font-semibold">Cadastros Pendentes</h2>

      {members.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum cadastro pendente
        </p>
      )}

      {members.map((member: any) => (
        <PendingMemberCard
          key={member.id}
          member={member}
          onAction={load}
          onView={() => setSelectedMember(member)} // 👈 abre modal
        />
      ))}

      {/* MODAL */}
      {selectedMember && (
        <PendingMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
