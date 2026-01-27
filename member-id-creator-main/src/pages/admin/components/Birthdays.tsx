import { useEffect, useState } from "react";
import  api  from "@/api/http";

export function Birthdays() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/admin/birthdays?range=week").then(res => setList(res.data));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h2 className="font-semibold">Aniversariantes da Semana</h2>

      {list.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum aniversariante</p>
      )}

      {list.map((p) => (
        <div key={p.id} className="flex justify-between text-sm">
          <span>{p.name}</span>
          <span>{p.birth_date}</span>
        </div>
      ))}
    </div>
  );
}
