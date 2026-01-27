import { useEffect, useState } from "react";
import api  from "@/api/http";

export function StatsCards() {
  const [stats, setStats] = useState({
    totalActive: 0,
    totalPending: 0,
    totalBlocked: 0,
  });

  useEffect(() => {
    api.get("/admin/stats").then(res => setStats(res.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Membros Ativos" value={stats.totalActive} color="green" />
      <Card title="Pendentes" value={stats.totalPending} color="yellow" />
      <Card title="Bloqueados" value={stats.totalBlocked} color="red" />
    </div>
  );
}

function Card({ title, value, color }) {
  const colors = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="text-sm text-muted-foreground">{title}</p>
      <h2 className={`text-2xl font-bold ${colors[color]}`}>{value}</h2>
    </div>
  );
}
