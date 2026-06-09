import { useEffect, useState } from "react";
import { Users, UserCheck, Clock, UserX } from "lucide-react";
import api from "@/api/http";

export function StatsCards() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total de Membros"
        value={stats.total}
        icon={Users}
        variant="blue"
      />
      <StatCard
        title="Membros Ativos"
        value={stats.approved}
        icon={UserCheck}
        variant="green"
      />
      <StatCard
        title="Pendentes"
        value={stats.pending}
        icon={Clock}
        variant="amber"
      />
      <StatCard
        title="Recusados"
        value={stats.rejected}
        icon={UserX}
        variant="red"
      />
    </div>
  );
}

type Variant = "blue" | "green" | "amber" | "red";

const variantStyles: Record<
  Variant,
  {
    card: string;
    iconWrap: string;
    icon: string;
    value: string;
    bar: string;
  }
> = {
  blue: {
    card: "border-blue-100 hover:border-blue-200",
    iconWrap: "bg-blue-50",
    icon: "text-blue-600",
    value: "text-blue-700",
    bar: "bg-blue-500",
  },
  green: {
    card: "border-green-100 hover:border-green-200",
    iconWrap: "bg-green-50",
    icon: "text-green-600",
    value: "text-green-700",
    bar: "bg-green-500",
  },
  amber: {
    card: "border-amber-100 hover:border-amber-200",
    iconWrap: "bg-amber-50",
    icon: "text-amber-600",
    value: "text-amber-700",
    bar: "bg-amber-400",
  },
  red: {
    card: "border-red-100 hover:border-red-200",
    iconWrap: "bg-red-50",
    icon: "text-red-600",
    value: "text-red-700",
    bar: "bg-red-500",
  },
};

function StatCard({
  title,
  value,
  icon: Icon,
  variant,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  variant: Variant;
}) {
  const s = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${s.card}`}
    >
      {/* Accent bar */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${s.bar}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <p className={`mt-2 text-4xl font-bold leading-none ${s.value}`}>
            {value}
          </p>
        </div>

        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.iconWrap}`}>
          <Icon className={`h-5 w-5 ${s.icon}`} />
        </div>
      </div>
    </div>
  );
}