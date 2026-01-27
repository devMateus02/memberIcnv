import  api  from "@/api/http";

export function PendingMemberCard({ member, onAction, onView }) {
  const approve = async () => {
    try {
      await api.put(`/admin/users/${member.id}/approve`);
      onAction();
    } catch (err) {
      console.error("Erro ao aprovar usuário:", err);
    }
  };

  const reject = async () => {
    try {
      await api.put(`/admin/users/${member.id}/reject`);
      onAction();
    } catch (err) {
      console.error("Erro ao rejeitar usuário:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-end md:items-start gap-4 border rounded-lg p-3">
     <div  className="flex-1 flex items-center gap-4">
       <img
        src={member.selfie_url}
        className="w-14 h-18 rounded object-cover"
      />

      <div className="flex-1 cursor-pointer" onClick={onView}>
        <p className="font-medium">{member.name}</p>
        <p className="text-xs text-muted-foreground">{member.email}</p>
      </div>
     </div>

      <div className="flex gap-2">
        <button
          onClick={approve}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded"
        >
          Aprovar
        </button>
        <button
          onClick={reject}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded"
        >
          Rejeitar
        </button>
      </div>
    </div>
  );
}
