import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Lock,
  User,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const utils = trpc.useUtils();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateAccess = trpc.membership.simulateDirectAccess.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      setIsSimulating(false);
      toast.success("Credenciales verificadas y acceso concedido");
      setLocation("/");
    },
  });

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Por favor ingresa usuario y contraseña");
      return;
    }

    setIsSimulating(true);
    // Simular autenticación rápida en la maqueta
    setTimeout(() => {
      if (isAuthenticated) {
        simulateAccess.mutate({ tier: "vip_lifetime" });
      } else {
        setIsSimulating(false);
        toast.info("Para asociar a tu perfil real:", {
          description: "Utiliza el botón de Inicio Oficial para persistir tu cuenta única.",
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="text-center mb-8">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 font-extrabold text-xl">
                TB
              </div>
              <h1 className="text-2xl font-bold text-white">Inicio de Sesión TuneBank</h1>
              <p className="text-xs text-slate-400 mt-1">
                Acceso exclusivo enlazado con tu compra para desbloquear archivos y Google Drive.
              </p>
            </div>

            {isAuthenticated ? (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
                  <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-cyan-400" />
                  Sesión activa como: <strong className="text-white">{user?.name || user?.email}</strong>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={() => setLocation("/")}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    Ir al Catálogo de Archivos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => logout()}
                    className="w-full border-white/10 text-slate-300"
                  >
                    Cerrar Sesión Actual
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Formulario Manual de Ejemplo */}
                <form onSubmit={handleManualLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-cyan-400" />
                      Usuario o Correo Registrado
                    </label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="tunetaller@gmail.com"
                      className="bg-slate-950/80 border-white/15 text-white h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                      Contraseña Única de Compra
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="bg-slate-950/80 border-white/15 text-white h-11"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSimulating}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold h-11 rounded-xl"
                  >
                    {isSimulating ? "Verificando licencia..." : "Entrar a la Plataforma"}
                  </Button>
                </form>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-4 text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
                    O Vincular Automáticamente
                  </span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-center">
                  <p className="text-xs text-slate-400">
                    ¿Todavía no has comprado tu membresía?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/pricing")}
                    className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs font-bold"
                  >
                    Ver Planes y Comprar Acceso
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
