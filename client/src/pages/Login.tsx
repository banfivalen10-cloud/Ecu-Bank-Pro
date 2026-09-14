import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, Cpu, KeyRound, User, UserPlus } from "lucide-react";

type LocalAccount = { username: string; password: string; displayName: string };
const ACCOUNT_KEY = "ecu-bank-pro-account";
const SESSION_KEY = "ecu-bank-pro-session";

export default function Login() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => setSession(localStorage.getItem(SESSION_KEY)), []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser || password.length < 4 || (mode === "register" && !displayName.trim())) {
      toast.error(mode === "register" ? "Completa usuario, nombre y una contraseña de 4 caracteres o más." : "Ingresa usuario y contraseña.");
      return;
    }
    const existing = localStorage.getItem(ACCOUNT_KEY);
    if (mode === "register") {
      if (existing) {
        toast.error("Ya existe una cuenta en este dispositivo. Inicia sesión o usa otro navegador.");
        return;
      }
      const account: LocalAccount = { username: cleanUser, password, displayName: displayName.trim() };
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
      localStorage.setItem(SESSION_KEY, cleanUser);
      setSession(cleanUser);
      toast.success("Cuenta creada correctamente");
      setLocation("/");
      return;
    }
    const account = existing ? (JSON.parse(existing) as LocalAccount) : null;
    if (!account || account.username !== cleanUser || account.password !== password) {
      toast.error("Usuario o contraseña incorrectos", { description: "Si todavía no tienes cuenta, regístrate primero." });
      return;
    }
    localStorage.setItem(SESSION_KEY, cleanUser);
    setSession(cleanUser);
    toast.success("Sesión iniciada");
    setLocation("/");
  };

  const logout = () => { localStorage.removeItem(SESSION_KEY); setSession(null); toast.success("Sesión cerrada"); };

  return <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100"><Navbar /><main className="flex-1 flex items-center justify-center p-4"><div className="w-full max-w-md p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl"><div className="text-center mb-7"><div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4"><Cpu className="h-7 w-7" /></div><h1 className="text-2xl font-bold text-white">Acceso a Ecu Bank Pro</h1><p className="text-xs text-slate-400 mt-2">Crea tu usuario y contraseña para entrar a la plataforma.</p></div>{session ? <div className="space-y-4 text-center"><div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm"><CheckCircle2 className="h-5 w-5 mx-auto mb-2" />Sesión activa como <strong className="text-white">{session}</strong></div><Button onClick={() => setLocation("/")} className="w-full bg-cyan-500 text-slate-950 font-bold">Entrar a la plataforma</Button><Button onClick={logout} variant="outline" className="w-full border-white/10 text-slate-300">Cerrar sesión</Button></div> : <><div className="grid grid-cols-2 gap-2 mb-5"><Button type="button" variant={mode === "login" ? "default" : "outline"} onClick={() => setMode("login")} className={mode === "login" ? "bg-cyan-500 text-slate-950" : "border-white/10 text-slate-300"}><KeyRound className="h-4 w-4 mr-2" />Iniciar sesión</Button><Button type="button" variant={mode === "register" ? "default" : "outline"} onClick={() => setMode("register")} className={mode === "register" ? "bg-cyan-500 text-slate-950" : "border-white/10 text-slate-300"}><UserPlus className="h-4 w-4 mr-2" />Registrarse</Button></div><form onSubmit={submit} className="space-y-4">{mode === "register" && <div><label className="text-xs text-slate-300">Nombre visible</label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Tu nombre" className="mt-1 bg-slate-950/80 border-white/15 text-white" /></div>}<div><label className="text-xs text-slate-300 flex items-center gap-1"><User className="h-3.5 w-3.5 text-cyan-400" />Nombre de usuario</label><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="tunombre" className="mt-1 bg-slate-950/80 border-white/15 text-white" /></div><div><label className="text-xs text-slate-300 flex items-center gap-1"><KeyRound className="h-3.5 w-3.5 text-cyan-400" />Contraseña</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 4 caracteres" className="mt-1 bg-slate-950/80 border-white/15 text-white" /></div><Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">{mode === "register" ? "Crear cuenta" : "Entrar"}</Button></form></>}</div></main></div>;
}
