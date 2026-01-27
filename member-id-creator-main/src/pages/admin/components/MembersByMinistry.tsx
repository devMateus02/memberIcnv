import { useEffect, useState } from "react";
import api  from "@/api/http";

export function MembersByMinistry() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/admin/ministries/stats").then(res => setData(res.data));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h2 className="font-semibold">Membros por Ministério</h2>

      {data.map((m) => (
        <div key={m.name} className="flex justify-between text-sm">
          <span>{m.name}</span>
          <span className="font-semibold">{m.total}</span>
        </div>
      ))}
    </div>
  );
}
