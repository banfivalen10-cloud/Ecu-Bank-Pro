import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/_core/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Database,
  Download,
  FolderSearch,
  Gauge,
  GraduationCap,
  KeyRound,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  Wrench,
  X,
  Zap,
} from "lucide-react";

const painPoints = [
  "Revolvés grupos y foros con el cliente esperando, sin saber si el archivo aparece.",
  "Cargás un genérico que debería servir y te jugás la ECU del cliente.",
  "Rechazás trabajos de airbag, ABS u odómetro porque no tenés el software.",
  "Pagás créditos sueltos y dependés de terceros en cada auto.",
];

const benefits = [
  "Encontrá el par OEM + modificado de esa ECU en menos de 2 minutos.",
  "Cerrá el trabajo el mismo día, sin mandarlo a otro taller.",
  "Resolvé airbag, ABS y odómetro con la suite de softwares incluida.",
  "Trabajá tranquilo: el modificado siempre tiene su OEM al lado.",
  "Dejá de pagar crédito suelto: un pago, acceso de por vida.",
  "Confirmá si tu ECU está en el índice antes de subir el auto al elevador.",
];

const bonuses = [
  ["01", "Curso Remap desde el Inicio", "WinOLS + ECM Titanium y certificado."],
  ["02", "Mapas E85, Pop & Bangs y Flames", "Ampliá los servicios que ofrecés en tu taller."],
  ["03", "Herramientas y adaptadores", "Tutorial de conexión, pinouts y adaptadores."],
  ["04", "Apertura de módulos ECU", "Técnicas para abrir módulos sin dañarlos."],
  ["05", "Guía de soldadura en ECU", "Conexiones firmes y seguras para trabajar mejor."],
  ["06", "Interpretación de diagramas", "Ubicá la ECU y leé el diagrama sin perder tiempo."],
];

const testimonials = [
  ["D", "Diego M.", "DM Performance · Córdoba", "Entró una Amarok con EDC17 y el cliente lo necesitaba para el otro día. Busqué por ECU, cargué el par y lo entregué el mismo día."],
  ["N", "Nahuel R.", "Tuning San Justo · Buenos Aires", "Lo que más me sirve es tener el OEM al lado del modificado. Cargo tranquilo, sin miedo a brickear una ECU."],
  ["F", "Facundo L.", "FL Diesel · Rosario", "Una Hilux 3.0 con DPF tapado la resolví con el archivo de la base en 10 minutos. Recuperé lo que pagué en el primer trabajo."],
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { data: modules, isLoading } = trpc.library.modules.useQuery();
  const isVip = user?.membershipStatus === "vip_lifetime" || user?.membershipStatus === "vip_monthly";

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLocation(search.trim() ? `/drive-explorer?q=${encodeURIComponent(search.trim())}` : "/drive-explorer");
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 overflow-x-hidden">
      <Navbar />

      <div className="bg-cyan-500 text-slate-950 text-center text-xs sm:text-sm font-bold px-4 py-2.5">
        <Timer className="inline h-4 w-4 mr-1.5 -mt-0.5" /> Oferta de lanzamiento · Acceso de por vida · Sin mensualidad
      </div>

      <main>
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(8,145,178,0.22),transparent_58%)] pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <Badge className="bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 mb-6"><Cpu className="h-3.5 w-3.5 mr-1.5" /> ECU BANK PRO · BANCO INDEXADO POR ECU</Badge>
            <h1 className="max-w-4xl mx-auto text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.04]">El archivo correcto para cualquier ECU, <span className="text-cyan-400">en 2 minutos</span></h1>
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed mt-6">Accedé al banco de archivos de remap indexado por ECU: OEM + modificado, organizados para encontrar exactamente lo que necesitás cuando el auto está arriba del elevador.</p>
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto mt-9">
              <div className="relative flex items-center rounded-2xl bg-slate-900 border border-cyan-400/30 p-1.5 shadow-2xl shadow-cyan-950/40">
                <Search className="absolute left-5 h-5 w-5 text-slate-400" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscá por marca, modelo o ECU (ej: Golf 7, EDC17, DAMOS)" className="pl-12 pr-28 h-12 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0" />
                <Button type="submit" className="absolute right-2 h-10 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl">Buscar</Button>
              </div>
            </form>
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-slate-400">Búsquedas rápidas: {['EDC17C74', 'Golf 7 Stage 1', 'DAMOS BMW', 'WinOLS', 'Immo OFF'].map((term) => <button key={term} onClick={() => setLocation(`/drive-explorer?q=${encodeURIComponent(term)}`)} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:border-cyan-400/40">{term}</button>)}</div>
            <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-3xl mx-auto mt-12 text-left">
              {[['+2.000', 'Vehículos indexados'], ['+60', 'Marcas disponibles'], ['+150', 'Softwares incluidos']].map(([value, label], index) => <div key={label} className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10"><div className={`text-2xl sm:text-3xl font-black ${index === 1 ? 'text-cyan-400' : index === 2 ? 'text-emerald-400' : 'text-white'}`}>{value}</div><div className="text-[11px] sm:text-xs text-slate-400 mt-1">{label}</div></div>)}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div><span className="text-xs font-bold uppercase tracking-widest text-red-300">El problema</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-3 leading-tight">El auto arriba del elevador y vos buscando el archivo</h2><p className="text-slate-400 mt-4 leading-relaxed">Cada minuto perdido se transforma en un trabajo derivado, un cliente que espera o una ECU que cargás sin la seguridad necesaria.</p></div>
            <div className="grid gap-3">{painPoints.map((point) => <div key={point} className="flex gap-3 p-4 rounded-xl bg-red-500/[0.04] border border-red-400/10"><X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" /><span className="text-sm text-slate-300 leading-relaxed">{point}</span></div>)}</div>
          </div>
        </section>

        <section className="bg-slate-950/80 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20"><div className="text-center max-w-2xl mx-auto"><span className="text-xs font-bold uppercase tracking-widest text-cyan-300">La solución</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Con Ecu Bank Pro vas a trabajar con el archivo correcto</h2><p className="text-slate-400 mt-4">No es un archivo suelto: es un banco indexado por ECU, con el par original y el modificado juntos.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">{benefits.map((benefit) => <div key={benefit} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"><CheckCircle2 className="h-5 w-5 text-emerald-400 mb-3" /><p className="text-sm text-slate-300 leading-relaxed">{benefit}</p></div>)}</div></div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20"><div className="text-center max-w-2xl mx-auto"><span className="text-xs font-bold uppercase tracking-widest text-amber-300">El mecanismo Par-Listo</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Identificá la ECU. Descargá el par. Cobrá.</h2></div><div className="grid md:grid-cols-3 gap-5 mt-10">{[{number: '01', title: 'Identificá la ECU', description: 'Buscás por marca, modelo y ECU en el índice.', Icon: Search}, {number: '02', title: 'Descargá el par', description: 'El OEM original y el modificado correcto, juntos.', Icon: Download}, {number: '03', title: 'Aplicá y cobrá', description: 'Cargás con tu equipo y cerrás el trabajo el mismo día.', Icon: Zap}].map(({number, title, description, Icon}) => <div key={number} className="relative p-6 rounded-2xl bg-slate-900 border border-white/10"><div className="flex items-center justify-between"><span className="text-4xl font-black text-cyan-400/30">{number}</span><div className="h-11 w-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"><Icon className="h-5 w-5" /></div></div><h3 className="text-xl font-bold text-white mt-5">{title}</h3><p className="text-sm text-slate-400 mt-2 leading-relaxed">{description}</p></div>)}</div></section>

        <section className="bg-gradient-to-b from-cyan-950/20 to-transparent border-y border-cyan-500/10"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Demostración real</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Probá el índice antes de comprar</h2><p className="text-slate-400 mt-3">Navegá la estructura real de Drive y comprobá cómo se organiza cada ECU.</p></div><Link href="/drive-explorer"><Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black">Abrir Buscador Drive <ArrowRight className="h-4 w-4 ml-2" /></Button></Link></div><div className="mt-8 p-5 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 flex flex-col md:flex-row items-center gap-6"><div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0"><FolderSearch className="h-8 w-8" /></div><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-bold text-white">Índice de Google Drive conectado</h3><Badge className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">Snapshot verificado</Badge></div><p className="text-sm text-slate-400 mt-2">Carpetas por software, remap, DAMOS, manuales y bonus. Búsqueda recursiva sobre 1.994 archivos indexados.</p></div><Link href="/drive-explorer"><Button variant="outline" className="border-white/15 text-slate-200 hover:bg-white/5 shrink-0">Explorar ahora</Button></Link></div></div></section>

        <section id="modulos" className="bg-slate-950/80 border-y border-white/5"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Tu biblioteca de trabajo</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Módulos dentro de Ecu Bank Pro</h2><p className="text-slate-400 mt-3">Cada sección está ordenada para que llegues al recurso correcto sin perder tiempo.</p></div><Link href="/drive-explorer"><Button variant="outline" className="border-white/15 text-slate-200 hover:bg-white/5">Ver índice completo</Button></Link></div>{isLoading ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-36 rounded-2xl bg-white/5 animate-pulse" />)}</div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">{modules?.slice(0, 6).map((item) => <button key={item.id} onClick={() => setLocation(`/module/${item.id}`)} className="text-left p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-400/40 transition-colors group"><div className="flex items-center justify-between"><div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"><Cpu className="h-5 w-5" /></div><ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" /></div><div className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold mt-4">{item.code}</div><h3 className="text-base font-bold text-white mt-1">{item.title}</h3><p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.subtitle}</p><div className="text-[11px] text-slate-500 mt-4">~{item.fileCountEstimate.toLocaleString()} archivos</div></button>)}</div>}</div></section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20"><div className="text-center"><span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Lo que incluye</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Todo lo que entra en tu acceso</h2></div><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">{[{code: '01', title: 'Banco ECU Indexado', description: '+2.000 vehículos, +60 marcas y el par OEM + modificado.', Icon: Database}, {code: '02', title: 'Suite de Diagnóstico', description: '+150 softwares para ABS, airbag, odómetro, BCM e inmovilizador.', Icon: Wrench}, {code: '03', title: 'Índice de Compatibilidad', description: 'Confirmá si está tu ECU antes de subir el auto al elevador.', Icon: Gauge}, {code: '04', title: 'Ruta Par-Listo', description: 'Del acceso a tu primer remap facturado, paso a paso.', Icon: GraduationCap}].map(({code, title, description, Icon}) => <div key={code} className="p-5 rounded-2xl bg-slate-900 border border-white/10"><div className="flex justify-between items-start"><div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"><Icon className="h-5 w-5" /></div><span className="text-xs text-cyan-300 font-bold">{code}</span></div><h3 className="text-base font-bold text-white mt-4">{title}</h3><p className="text-xs text-slate-400 mt-2 leading-relaxed">{description}</p></div>)}</div></section>

        <section className="bg-slate-950/80 border-y border-white/5"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20"><div className="text-center"><span className="text-xs font-bold uppercase tracking-widest text-amber-300">Bonos de lanzamiento</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-3">6 bonos para trabajar mejor desde el día uno</h2></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">{bonuses.map(([code, title, description]) => <div key={code} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"><span className="text-xs font-black text-amber-300">BONO {code}</span><h3 className="font-bold text-white mt-2">{title}</h3><p className="text-sm text-slate-400 mt-2">{description}</p></div>)}</div></div></section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20"><div className="text-center"><span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Talleres</span><h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Talleres que cierran el trabajo el mismo día</h2></div><div className="grid md:grid-cols-3 gap-4 mt-10">{testimonials.map(([initial, name, business, quote]) => <div key={name} className="p-6 rounded-2xl bg-slate-900 border border-white/10"><div className="flex gap-3 items-center"><div className="h-10 w-10 rounded-full bg-cyan-500/15 text-cyan-300 flex items-center justify-center font-bold">{initial}</div><div><div className="font-bold text-white text-sm">{name}</div><div className="text-xs text-slate-500">{business}</div></div></div><p className="text-sm text-slate-300 leading-relaxed mt-5">“{quote}”</p><div className="text-amber-400 text-sm mt-4">★★★★★</div></div>)}</div></section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20"><div className="grid lg:grid-cols-2 gap-6 items-stretch"><div className="p-7 sm:p-9 rounded-3xl bg-slate-900 border border-white/10"><div className="flex items-center gap-2 text-cyan-300 text-sm font-bold"><ShieldCheck className="h-5 w-5" /> Acceso seguro y de por vida</div><h2 className="text-3xl font-black text-white mt-4">Un pago. Tu banco ECU para siempre.</h2><p className="text-slate-400 mt-3">Sin mensualidad, descargas ilimitadas y acceso enlazado a tu cuenta después de confirmar la compra.</p><ul className="space-y-3 mt-6 text-sm text-slate-300">{['Banco ECU Indexado', 'Suite de Diagnóstico', 'Índice de compatibilidad', '6 bonos de lanzamiento', 'Garantía de 30 días'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> {item}</li>)}</ul></div><div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 relative overflow-hidden"><Sparkles className="absolute -right-5 -top-5 h-36 w-36 opacity-15" /><div className="relative"><Badge className="bg-slate-950/20 border-slate-950/20 text-slate-950">ACCESO COMPLETO</Badge><h3 className="text-2xl font-black mt-5">Ecu Bank Pro</h3><div className="flex items-end gap-3 mt-5"><span className="text-5xl font-black">$12.990</span><span className="font-bold mb-2">ARS<br /><span className="text-xs font-medium">pago único</span></span></div><p className="font-semibold mt-4">Acceso de por vida · sin mensualidad</p><Link href="/pricing"><Button className="w-full mt-7 h-12 bg-slate-950 hover:bg-slate-800 text-white font-black">Quiero empezar hoy <ArrowRight className="h-4 w-4 ml-2" /></Button></Link><p className="text-xs text-center mt-3 font-medium">Compra y acceso vinculados a tu usuario</p></div></div></div></section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20"><div className="text-center"><h2 className="text-3xl font-black text-white">Preguntas frecuentes</h2></div><div className="mt-8 space-y-3">{[['¿El acceso es mensual?', 'No. Es un pago único con acceso de por vida y descargas ilimitadas según tu membresía.'], ['¿Puedo revisar si está mi ECU antes de comprar?', 'Sí. El buscador Drive está disponible para navegar el índice y buscar por marca, modelo o ECU.'], ['¿Cómo recibo el acceso?', 'Después de confirmar la compra, el acceso queda enlazado a tu usuario y podrás ingresar desde cualquier dispositivo.'], ['¿El OEM viene junto al modificado?', 'La estructura está organizada para localizar el par OEM + modificado de cada ECU cuando esté disponible.']].map(([question, answer], index) => <div key={question} className="rounded-2xl border border-white/10 bg-slate-900/70 overflow-hidden"><button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-white"><span>{question}</span><ChevronDown className={`h-5 w-5 text-cyan-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} /></button>{openFaq === index && <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{answer}</p>}</div>)}</div></section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80 py-8"><div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"><div>© 2026 Ecu Bank Pro. Todos los derechos reservados.</div><div className="flex flex-wrap justify-center gap-5"><Link href="/drive-explorer" className="hover:text-slate-300">Buscador Drive</Link><Link href="/pricing" className="hover:text-slate-300">Precios</Link><Link href="/login" className="hover:text-slate-300">Acceso Miembros</Link></div></div></footer>
    </div>
  );
}
