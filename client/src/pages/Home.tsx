import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  CheckCircle2,
  HelpCircle,
  FileQuestion,
  Download,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Database,
  GraduationCap,
  Cpu,
  Zap,
  Box,
  Key,
};

const FALLBACK_MODULES = [
  { id: "stage-damos", code: "MÓDULO 01", title: "Banco de Archivos, Stage, DAMOS, Mappacks", subtitle: "Biblioteca completa de recursos", description: "Archivos originales y modificados, Stages de potencia, DAMOS y Mappacks organizados por marca y modelo.", icon: "Database", accentColor: "#38bdf8", tags: JSON.stringify(["ORIGINALES", "STAGE 1-3", "DAMOS", "MAPPACKS"]) },
  { id: "curso-winols", code: "MÓDULO 02", title: "Curso WinOLS para Descarga", subtitle: "Formación completa paso a paso", description: "Curso profesional desde cero hasta nivel avanzado para leer, editar y grabar centralitas con WinOLS.", icon: "GraduationCap", accentColor: "#f59e0b", tags: JSON.stringify(["DESDE CERO", "PRÁCTICO"]) },
  { id: "winols-software", code: "MÓDULO 03", title: "WinOLS", subtitle: "Software profesional de reprogramación", description: "Guía de instalación, licenciamiento y uso avanzado de WinOLS.", icon: "Cpu", accentColor: "#10b981", tags: JSON.stringify(["INSTALACIÓN", "CONFIGURACIÓN", "USO AVANZADO"]) },
  { id: "ecm-titanium", code: "MÓDULO 04", title: "ECM Titanium", subtitle: "Editor alternativo con drivers ilimitados", description: "Instalación, drivers, edición de mapas y compatibilidad con las principales centralitas.", icon: "Zap", accentColor: "#8b5cf6", tags: JSON.stringify(["DRIVERS", "MAPAS", "COMPATIBILIDAD"]) },
  { id: "software-remap", code: "MÓDULO 05", title: "Paquete de Software Profesional para Remap", subtitle: "Suite completa de herramientas de reprogramación", description: "Instaladores, activadores, generadores de contraseña y herramientas para taller.", icon: "Box", accentColor: "#06b6d4", tags: JSON.stringify(["INSTALADORES", "ACTIVADORES", "ÚTILES"]) },
  { id: "key-immo-airbag", code: "MÓDULO 06", title: "Key Code-v2 / Immo OFF / KM / Airbag / Servicio / Programador", subtitle: "Software para servicios y reparación de módulos", description: "Herramientas para Key Code, Immo OFF, corrección de KM, Airbag, Service y programadores.", icon: "Key", accentColor: "#ec4899", tags: JSON.stringify(["KEY CODE", "IMMO OFF", "KM", "AIRBAG"]) },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  const { data: modules, isLoading } = trpc.library.modules.useQuery();
  const visibleModules = modules?.length ? modules : FALLBACK_MODULES;

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
            Plataforma completa con más de 30.000 archivos, 2.000 vehículos indexados, Stages, DAMOS y formación profesional lista para descargar.
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
              <div className="text-2xl font-bold text-white">+30.000</div>
              <div className="text-xs text-slate-400">Archivos ECU, Stages y DAMOS</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-cyan-400">+2.000</div>
              <div className="text-xs text-slate-400">Vehículos indexados</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-emerald-400">+60</div>
              <div className="text-xs text-slate-400">Marcas y modelos</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-2xl font-bold text-amber-400">+150</div>
              <div className="text-xs text-slate-400">Softwares incluidos</div>
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
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Explora cada sección de contenido estructurado. Pulsa en cualquier módulo para ver sus archivos y detalles.
            </p>
          </div>

        </div>

        <div className="space-y-4">
            {visibleModules.map((item) => {
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
                    <div className="flex md:flex-col items-center md:items-end gap-1 text-cyan-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                      <span>Ver contenido</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div onClick={() => setLocation("/module/bonus")} className="mt-4 glow-card group cursor-pointer p-6 rounded-2xl flex items-center justify-between gap-6 border border-fuchsia-500/20 bg-fuchsia-950/10">
          <div><div className="text-[11px] font-bold tracking-widest text-fuchsia-300 uppercase">BONUS</div><h3 className="text-lg font-bold text-white mt-1">Bonus / Próximamente</h3><p className="text-xs text-slate-400 mt-1">Acceso con contraseña · nuevos recursos en preparación</p></div><div className="text-fuchsia-300 text-xs font-bold">Ver contenido <ArrowRight className="inline h-4 w-4 ml-1" /></div>
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
            <Link href="/login" className="hover:text-slate-300 transition-colors">Acceso / Registro</Link>
          </div>
        </div>
      </footer>

      <Dialog open={openHelp !== null} onOpenChange={(open) => !open && setOpenHelp(null)}>
        <DialogTrigger asChild>
          <button type="button" aria-label="Abrir ayuda" onClick={() => setOpenHelp("inicio")} className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-cyan-500 text-slate-950 shadow-xl shadow-cyan-500/25 hover:bg-cyan-400 hover:scale-105 transition-all flex items-center justify-center">
            <HelpCircle className="h-7 w-7" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto bg-[#07101a] border-cyan-500/25 text-slate-100 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-white"><HelpCircle className="h-5 w-5 text-cyan-400" /> Centro de ayuda</DialogTitle>
            <DialogDescription className="text-slate-400">Respuestas rápidas para encontrar archivos y resolver problemas de descarga.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {[
              ["No encuentro un archivo", "Escribí el nombre, marca, modelo o extensión en el buscador. Probá también con una parte del nombre, por ejemplo WinOLS, BMW, ECM o .rar. Si no aparece, revisá el módulo correspondiente y avisá para incorporarlo al índice."],
              ["El botón no descarga", "Algunos archivos se abren en Google Drive o MEGA en una pestaña nueva. Permití ventanas emergentes y esperá a que cargue la página. En Chrome, revisá si la descarga fue bloqueada arriba a la derecha."],
              ["¿Dónde está cada contenido?", "El Módulo 1 contiene archivos ECU, Stage, DAMOS y Mappacks. El Módulo 2 es el curso WinOLS. Los Módulos 3 y 4 contienen WinOLS y ECM Titanium. El Módulo 5 reúne software, activadores y videoclases. El Módulo 6 contiene herramientas Key Code, Immo y Airbag."],
              ["El archivo aparece pero no abre", "Abrí el resultado desde el enlace Drive y comprobá que tu cuenta tenga permiso. Para archivos RAR o ZIP necesitás un descompresor como 7-Zip. Para videos, esperá a que termine de cargar YouTube o Drive."],
              ["La página se ve vacía o vieja", "Actualizá con Ctrl + F5 en PC o cerrá y abrí nuevamente el navegador en el celular. También podés probar una ventana privada para evitar la caché."],
            ].map(([question, answer]) => (
              <button key={question} type="button" onClick={() => setOpenHelp(openHelp === question ? null : question)} className="w-full text-left rounded-xl border border-white/10 bg-white/[0.03] hover:bg-cyan-500/[0.06] p-4 transition-colors">
                <span className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 font-semibold text-slate-100"><FileQuestion className="h-4 w-4 text-cyan-400 shrink-0" />{question}</span><ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${openHelp === question ? "rotate-180" : ""}`} /></span>
                {openHelp === question && <span className="block text-sm leading-relaxed text-slate-400 mt-3 pl-6">{answer}</span>}
              </button>
            ))}
          </div>
          <div className="mt-2 rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4 text-sm text-slate-300"><MessageCircle className="inline h-4 w-4 mr-2 text-emerald-400" />Si no encontrás una solución, enviá el nombre del archivo y el módulo donde debería estar para poder ayudarte.</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
