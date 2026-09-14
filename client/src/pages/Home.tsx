import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/_core/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  GraduationCap,
  Cpu,
  Zap,
  Box,
  Key,
  Search,
  ArrowRight,
  ExternalLink,
  Lock,
  Unlock,
  CheckCircle2,
  FolderSync,
  HelpCircle,
  FileCheck,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Database,
  GraduationCap,
  Cpu,
  Zap,
  Box,
  Key,
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const { data: modules, isLoading } = trpc.library.modules.useQuery();

  const isVip = user?.membershipStatus === "vip_lifetime" || user?.membershipStatus === "vip_monthly";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/drive-explorer?q=${encodeURIComponent(search.trim())}`);
    } else {
      setLocation("/drive-explorer");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-10 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            ECU • CHIPTUNING • REPROGRAMACIÓN
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            Ecu<span className="text-cyan-400"> Bank Pro</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
            Plataforma completa para dominar la reprogramación de centralitas: software, archivos, Stages, DAMOS y formación profesional lista para descargar.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center shadow-2xl">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar archivos por marca, modelo, ECU (ej: Golf 7, EDC17, DAMOS, WinOLS)..."
                className="pl-12 pr-32 h-14 bg-slate-900/90 border-white/15 text-white placeholder:text-slate-500 rounded-2xl text-base focus-visible:ring-cyan-400 focus-visible:border-cyan-400"
              />
              <Button
                type="submit"
                className="absolute right-2 h-10 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md"
              >
                Buscar
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
              <span className="text-slate-500">Búsquedas populares:</span>
              {["EDC17C74", "Golf 7 Stage 1", "DAMOS BMW", "SIMOS 18", "WinOLS 4.51", "Immo OFF"].map((term) => (
                <button
                  type="button"
                  key={term}
                  onClick={() => setLocation(`/drive-explorer?q=${encodeURIComponent(term)}`)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>

          {/* Platform Stats / Value Props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-white">+14,000</div>
              <div className="text-xs text-slate-400">Archivos, Stages y DAMOS</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-cyan-400">170+</div>
              <div className="text-xs text-slate-400">Softwares de reparación</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Verificados y testeados</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-amber-400">Drive Cloud</div>
              <div className="text-xs text-slate-400">Sincronización directa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Módulos Disponibles
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Acceso VIP
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Explora cada sección de contenido estructurado. Pulsa en cualquier módulo para ver sus archivos y detalles.
            </p>
          </div>

          <Link href="/pricing">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-300 text-xs hidden sm:flex"
            >
              Ver Planes de Acceso
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {modules?.map((item) => {
              const IconComp = ICON_MAP[item.icon] || Database;
              let tagsArray: string[] = [];
              try {
                tagsArray = JSON.parse(item.tags);
              } catch {
                tagsArray = [item.tags];
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setLocation(`/module/${item.id}`)}
                  className="glow-card group cursor-pointer p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 bg-white/5 text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-500/10 transition-all"
                      style={{ color: item.accentColor }}
                    >
                      <IconComp className="h-6 w-6" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
                          {item.code}
                        </span>
                        {item.requiresVip && !isVip && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            <Lock className="h-2.5 w-2.5" /> Requiere VIP
                          </span>
                        )}
                        {item.requiresVip && isVip && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <Unlock className="h-2.5 w-2.5" /> Desbloqueado
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-400 font-medium">
                        {item.subtitle}
                      </p>

                      <p className="text-xs text-slate-300/90 leading-relaxed max-w-3xl pt-1">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {tagsArray.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 text-slate-300 font-semibold"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <FileCheck className="h-3.5 w-3.5 text-cyan-400" />
                      <span>~{item.fileCountEstimate.toLocaleString()} archivos</span>
                    </div>

                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                      <span>Ver contenido</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Google Drive Connection Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900/60 border border-cyan-500/20 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <FolderSync className="h-4 w-4 text-cyan-400" />
                Arquitectura lista para Google Drive
              </div>
              <h3 className="text-xl font-bold text-white">
                ¿Tienes la carpeta de Google Drive lista para conectar?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Este sitio ya cuenta con el buscador indexado, base de datos relacional y estructura por módulos. Tan pronto descargues o compartas la carpeta de Google Drive, vincularemos los IDs de carpetas y enlaces de descarga directa sin cambiar el diseño.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/drive-explorer">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5">
                  Probar Buscador Drive
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  Simular Compra y Acceso
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Ecu Bank Pro. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
            <Link href="/drive-explorer" className="hover:text-slate-300 transition-colors">Buscador</Link>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">Precios</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Acceso Miembros</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
