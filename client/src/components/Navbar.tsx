import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ShieldCheck,
  User as UserIcon,
  LogOut,
  FolderSearch,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  Crown,
  Monitor,
  Smartphone,
  Menu,
  Cpu,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<"ES" | "EN">("ES");
  const [deviceMode, setDeviceMode] = useState<"pc" | "mobile">("pc");
  const utils = trpc.useUtils();

  const simulateAccess = trpc.membership.simulateDirectAccess.useMutation({
    onSuccess: (updated) => {
      utils.auth.me.invalidate();
      toast.success(
        updated?.membershipStatus === "free"
          ? "Modo invitado restaurado."
          : "¡Membresía activada con éxito para pruebas!"
      );
    },
  });

  const isVip = user?.membershipStatus === "vip_lifetime" || user?.membershipStatus === "vip_monthly";

  const selectDeviceMode = (mode: "pc" | "mobile") => {
    setDeviceMode(mode);
    toast.info("Vista responsive protegida", {
      description: "El sitio detecta automáticamente si estás en celular o PC; este selector es solo visual y no cambia la navegación.",
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050811]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm sm:text-xl text-white whitespace-nowrap">
                Ecu<span className="text-cyan-400"> Bank Pro</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                ECU PLATFORM
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Módulos
            </Link>
            <Link
              href="/drive-explorer"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <FolderSearch className="h-4 w-4 text-cyan-400" />
              Buscador Drive
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Crown className="h-4 w-4 text-amber-400" />
              Acceso VIP
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex md:hidden h-9 w-9 shrink-0 border border-white/10 text-slate-300 hover:text-white" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 bg-slate-950 border-white/15 text-slate-200">
              <DropdownMenuItem onClick={() => setLocation("/")} className="cursor-pointer"><Layers className="h-4 w-4 mr-2 text-cyan-400" /> Módulos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/drive-explorer")} className="cursor-pointer"><FolderSearch className="h-4 w-4 mr-2 text-cyan-400" /> Buscador Drive</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/pricing")} className="cursor-pointer"><Crown className="h-4 w-4 mr-2 text-amber-400" /> Acceso VIP</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="flex items-center text-xs bg-slate-900 border border-white/10 rounded-lg p-0.5" title="Selector visual protegido: la vista se adapta automáticamente">
            <button aria-label="Vista PC" aria-pressed={deviceMode === "pc"} onClick={() => selectDeviceMode("pc")} className={`h-7 w-7 sm:w-auto sm:px-2 rounded font-semibold transition-colors flex items-center justify-center gap-1 ${deviceMode === "pc" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"}`}><Monitor className="h-3.5 w-3.5" /><span className="hidden sm:inline">PC</span></button>
            <button aria-label="Vista móvil" aria-pressed={deviceMode === "mobile"} onClick={() => selectDeviceMode("mobile")} className={`h-7 w-7 sm:w-auto sm:px-2 rounded font-semibold transition-colors flex items-center justify-center gap-1 ${deviceMode === "mobile" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"}`}><Smartphone className="h-3.5 w-3.5" /><span className="hidden sm:inline">Móvil</span></button>
          </div>

          <div className="hidden sm:flex items-center text-xs bg-slate-900 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setLang("ES")}
              className={`px-2 py-1 rounded font-semibold transition-colors ${
                lang === "ES" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLang("EN")}
              className={`px-2 py-1 rounded font-semibold transition-colors ${
                lang === "EN" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  isVip
                    ? "border-amber-400/50 bg-amber-500/10 text-amber-300 font-semibold"
                    : "border-slate-700 bg-slate-800 text-slate-400"
                }
              >
                {isVip ? "VIP ACTIVO" : "GRATIS"}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10 flex items-center gap-2"
                  >
                    <UserIcon className="h-4 w-4 text-cyan-400" />
                    <span className="hidden sm:inline max-w-[100px] truncate">{user?.name || "Mi Cuenta"}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-950 border-white/15 text-slate-200">
                  <DropdownMenuLabel>
                    <div className="font-semibold text-white">{user?.name || "Usuario"}</div>
                    <div className="text-xs text-slate-400 font-normal">{user?.email || "Sin email"}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    onClick={() => {
                      simulateAccess.mutate({
                        tier: isVip ? "free" : "vip_lifetime",
                      });
                    }}
                    className="cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-cyan-400" />
                    {isVip ? "Cambiar a Modo Demo Libre" : "Simular Activación VIP"}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setLocation("/pricing")} className="cursor-pointer">
                    <Crown className="h-4 w-4 mr-2 text-amber-400" />
                    Planes de Membresía
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer text-red-400 focus:text-red-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/login")}
                className="border-white/20 bg-transparent text-slate-200 hover:text-white hover:bg-white/5 px-2 sm:px-3"
              >
                <UserIcon className="h-4 w-4 sm:hidden" /><span className="hidden sm:inline">Iniciar Sesión</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setLocation("/pricing")}
                className="hidden sm:inline-flex bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
              >
                Comprar Acceso
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
