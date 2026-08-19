import { Outlet, useNavigate } from "react-router-dom";
import { IdCard, CalendarDays, Settings, LogOut, Menu } from "lucide-react";
import { logout } from "@/api/auth.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MemberLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignora erro de backend
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const itemCls =
    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-foreground transition hover:bg-accent focus:bg-accent cursor-pointer";

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/Logo.png" className="h-8 w-8" alt="Logo" />
            <span className="font-semibold text-foreground">Carteirinha Digital</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Abrir menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className={itemCls} onSelect={() => navigate("/member")}>
                <IdCard className="h-4 w-4" />
                Carteirinha
              </DropdownMenuItem>
              <DropdownMenuItem className={itemCls} onSelect={() => navigate("/member/agenda")}>
                <CalendarDays className="h-4 w-4" />
                Agenda
              </DropdownMenuItem>
              <DropdownMenuItem className={itemCls} onSelect={() => navigate("/member/settings")}>
                <Settings className="h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={`${itemCls} text-destructive hover:bg-destructive/10 focus:bg-destructive/10`}
                onSelect={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
