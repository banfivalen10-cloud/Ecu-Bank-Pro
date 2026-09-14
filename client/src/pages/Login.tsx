import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, Cpu, LogIn, Mail } from "lucide-react";

const SESSION_KEY = "ecu-bank-pro-session";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => setSession(localStorage.getItem(SESSION_KEY)), []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Ingresá un Gmail válido para continuar.");
      return;
    }
    localStorage.setItem(SESSION_KEY, cleanEmail);
    setSession(cleanEmail);
    toast.success("Acceso iniciado correctamente");
    setLocation("/");
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    toast.success("Sesión cerrada");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl">
          <div className="text-center mb-7">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4"><Cpu className="h-7 w-7" /></div>
            <h1 className="text-2xl font-bold text-white">Acceso a Ecu Bank Pro</h1>
            <p className="text-xs text-slate-400 mt-2">Ingresá tu Gmail para acceder a la plataforma.</p>
          </div>
          {session ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm"><CheckCircle2 className="h-5 w-5 mx-auto mb-2" />Sesión activa como <strong className="text-white">{session}</strong></div>
              <Button onClick={() => setLocation("/")} className="w-full bg-cyan-500 text-slate-950 font-bold">Entrar a la plataforma</Button>
              <Button onClick={logout} variant="outline" className="w-full border-white/10 text-slate-300">Cerrar sesión</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-cyan-400" />Gmail</label>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tucorreo@gmail.com" autoComplete="email" className="mt-1 bg-slate-950/80 border-white/15 text-white" />
                <p className="text-[11px] text-slate-500 mt-2">Se usa para identificar tu acceso en este dispositivo.</p>
              </div>
              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"><LogIn className="h-4 w-4 mr-2" />Entrar</Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
