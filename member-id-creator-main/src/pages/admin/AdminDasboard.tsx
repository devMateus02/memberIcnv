import { StatsCards } from "./components/StatsCards";
import { PendingMembers } from "./components/PendingMembers";
import { Birthdays } from "./components/Birthdays";
import { MembersByMinistry } from "./components/MembersByMinistry";
import { logout } from "../../api/auth.api";

export default function AdminDashboard() {

  const handleLogout = async () => {
    try {
      await logout(); // 🔹 chama API
    } catch {
      // ignora erro de backend
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
        >
          Sair
        </button>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingMembers />
        <Birthdays />
      </div>

      <MembersByMinistry />
    </div>
  );
}
