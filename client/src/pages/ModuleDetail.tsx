import { useMemo, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  Database,
  GraduationCap,
  Cpu,
  Zap,
  Box,
  Key,
  Download,
  FolderSync,
  Lock,
  Unlock,
  ExternalLink,
  FileCheck,
  ShieldAlert,
  Folder,
  ChevronRight,
  Home,
  Search,
  ArrowUpRight,
  FileBox,
  HardDrive,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Database,
  GraduationCap,
  Cpu,
  Zap,
  Box,
  Key,
};

const DRIVE_ROOT_ID = "1wY57MfifTjXkTDrMH-daf5_8EhAgwSyq";
const DRIVE_ROOT_LINK = `https://drive.google.com/drive/folders/${DRIVE_ROOT_ID}`;

const moduleOneFolders = [
  { id: "software", driveId: "1NOyjwivenVXr6YXgl16w2FgdZGnTpgJT", name: "01 Software y Herramientas", count: 3, description: "IMMO CODE CALC SERVICE DIAGN PROG, ECM Titanium y WinOLS" },
  { id: "remap", driveId: "1XAJUxry2PKM0-k-1rP8qrfQmbhEoBOAF", name: "02 Archivos de Remap", count: 4, description: "Motos y Marine, Agrícola, Camiones y Buses, Turismos y Pickups" },
  { id: "damos", driveId: "1ohH-9v9ewktFBWrHKl3-_xUkzt229Il7", name: "03 DAMOS y Map Packs", count: 3, description: "WINOLS DAMOS, MAP PACKS POTENCIA y archivo de 100GB" },
  { id: "manuales", driveId: "1IJCgYEQGsEJG0l7Z0u8sFztHIPMxBGKK", name: "04 Manuales y Curso", count: 3, description: "Vídeo aulas de instalación, manual ECU y documentación PDF" },
  { id: "bonus", driveId: "1wL5jBljsFAu3V5xcmuU8EELa6MJmCJCd", name: "05 Bonus", count: 6, description: "Certificados, apostillas WinOLS, precios, mapas y manuales técnicos" },
  { id: "allfilesecure", driveId: "1KAwtsZkvHLIxGeYsuhIA6oxqF3ajjnaN", name: "allfilesecure-home", count: 6, description: "Código, logo, términos, contacto y sitio allfilesecure" },
  { id: "velora", driveId: "15daOLHmWD3iEMzTnn2pQWXGevcv4Bkid", name: "velora-labs-home", count: 6, description: "Código, logo, términos, contacto y sitio velora labs" },
];

export default function ModuleDetail() {
  const [, params] = useRoute("/module/:id");
  const [, setLocation] = useLocation();
  const moduleId = params?.id || "";
  const [folderId, setFolderId] = useState<string | null>(null);
  const [folderSearch, setFolderSearch] = useState("");

  const { user } = useAuth();
  const isVip = user?.membershipStatus === "vip_lifetime" || user?.membershipStatus === "vip_monthly";

  const { data, isLoading } = trpc.library.moduleDetail.useQuery(
    { id: moduleId },
    { enabled: !!moduleId }
  );

  const mod = data?.module;
  const files = data?.files || [];
  const IconComp = mod ? ICON_MAP[mod.icon] || Database : Database;
  const isDriveIndexedModule = moduleId === "stage-damos";

  const visibleFolders = useMemo(() => {
    const term = folderSearch.trim().toLowerCase();
    if (!term) return moduleOneFolders;
    return moduleOneFolders.filter((folder) =>
      `${folder.name} ${folder.description}`.toLowerCase().includes(term)
    );
  }, [folderSearch]);

  const selectedFolder = moduleOneFolders.find((folder) => folder.id === folderId);

  const handleOpenDrive = () => {
    window.open(DRIVE_ROOT_LINK, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (fileName: string) => {
    if (!isVip) {
      toast.error("Contenido protegido", {
        description: "Adquiere el pase de acceso VIP para descargar este archivo o carpeta.",
        action: { label: "Ver Planes", onClick: () => setLocation("/pricing") },
      });
      return;
    }

    toast.success(`Enlace listo para ${fileName}`, {
      description: "Este archivo está conectado a la carpeta de Google Drive correspondiente.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-16 w-full space-y-4">
          <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto my-auto text-center py-20 px-4">
          <ShieldAlert className="h-12 w-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Módulo no encontrado</h2>
          <p className="text-sm text-slate-400 mt-2 mb-6">El módulo solicitado no existe o aún está en preparación técnica.</p>
          <Link href="/"><Button variant="outline" className="border-white/20"><ArrowLeft className="h-4 w-4 mr-2" /> Volver al catálogo</Button></Link>
        </div>
      </div>
    );
  }

  let tagsArray: string[] = [];
  try { tagsArray = JSON.parse(mod.tags); } catch { tagsArray = [mod.tags]; }

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a los módulos
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
              <IconComp className="h-4 w-4" /> {mod.code}
            </span>
            {isVip ? (
              <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px]"><Unlock className="h-3 w-3 mr-1" /> Acceso VIP habilitado</Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-[10px]"><Lock className="h-3 w-3 mr-1" /> Requiere membresía</Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{mod.title}</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">{mod.subtitle}</p>
        </div>

        {isDriveIndexedModule ? (
          <section className="rounded-2xl border border-white/15 bg-[#07101a]/90 shadow-2xl shadow-cyan-950/20 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Biblioteca completa conectada en tiempo real. Navega por las carpetas o busca cualquier archivo por nombre (marca, modelo, ECU...).
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Carpetas indexadas de Google Drive
                  </div>
                </div>
                  <Button onClick={handleOpenDrive} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shrink-0">
                  <ArrowUpRight className="h-4 w-4 mr-2" /> Abrir en Google Drive
                </Button>
              </div>

              <div className="relative mt-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  value={folderSearch}
                  onChange={(event) => { setFolderSearch(event.target.value); setFolderId(null); }}
                  placeholder="Buscar archivo por nombre..."
                  className="h-11 pl-10 bg-[#050b12] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
                />
              </div>
            </div>

            <div className="px-5 sm:px-6 pt-4 pb-2 flex items-center gap-2 text-xs text-slate-400">
              <Home className="h-3.5 w-3.5" />
              <span>Raíz</span>
              {selectedFolder && (
                <>
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  <span className="text-cyan-300">{selectedFolder.name}</span>
                </>
              )}
            </div>

            {!selectedFolder ? (
              <div className="px-5 sm:px-6 pb-6">
                <div className="rounded-xl border border-white/10 overflow-hidden bg-[#050b12]/70">
                  {visibleFolders.map((folder, index) => (
                    <button
                      type="button"
                      key={folder.id}
                      onClick={() => setFolderId(folder.id)}
                      className={`w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-cyan-500/10 transition-colors group ${index !== visibleFolders.length - 1 ? "border-b border-white/10" : ""}`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <Folder className="h-5 w-5 text-cyan-400 shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-slate-100 truncate">{folder.name}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5 truncate">{folder.description}</span>
                        </span>
                      </span>
                      <span className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline text-[11px] text-slate-500">{folder.count.toLocaleString()} recursos</span>
                        <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                      </span>
                    </button>
                  ))}
                  {visibleFolders.length === 0 && (
                    <div className="py-10 text-center text-sm text-slate-500">No se encontraron carpetas indexadas.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-5 sm:px-6 pb-6">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2"><Folder className="h-4 w-4 text-cyan-400" /> {selectedFolder.name}</h2>
                    <p className="text-xs text-slate-500 mt-1">{selectedFolder.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFolderId(null)} className="text-cyan-300 hover:text-white">Volver a raíz</Button>
                </div>
                <div className="p-6 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 text-center">
                  <FileBox className="h-9 w-9 mx-auto text-cyan-400 mb-2" />
                  <p className="text-sm font-semibold text-white">Carpeta indexada correctamente</p>
                  <p className="text-xs text-slate-400 mt-1">Aquí aparecerán los archivos reales de Drive cuando conectemos el ID de esta carpeta.</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Button onClick={() => setLocation(`/drive-explorer?module=${moduleId}`)} variant="outline" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">Abrir explorador de archivos</Button>
                    <Button onClick={() => window.open(`https://drive.google.com/drive/folders/${selectedFolder.driveId}`, "_blank", "noopener,noreferrer")} variant="ghost" className="text-slate-300 hover:text-white">Abrir carpeta real</Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 relative overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/15 bg-white/5" style={{ color: mod.accentColor }}><IconComp className="h-7 w-7" /></div>
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{mod.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-4">{tagsArray.map((tag) => <Badge key={tag} variant="secondary" className="bg-white/5 border border-white/10 text-slate-300 text-xs">{tag}</Badge>)}</div>
                </div>
              </div>
              {!isVip ? <Button onClick={() => setLocation("/pricing")} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold w-full md:w-auto"><Lock className="h-4 w-4 mr-2" /> Comprar Acceso para Descargar</Button> : <Button onClick={handleOpenDrive} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold w-full md:w-auto"><FolderSync className="h-4 w-4 mr-2" /> Abrir Carpeta Completa en Drive</Button>}
            </div>
          </div>
        )}

        {!isDriveIndexedModule && (
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-white flex items-center gap-2">Archivos y Recursos en esta Sección <span className="text-xs font-normal text-slate-400">({files.length} cargados)</span></h2><Link href={`/drive-explorer?module=${mod.id}`}><Button variant="ghost" size="sm" className="text-cyan-400 text-xs hover:text-cyan-300">Buscar dentro de este módulo</Button></Link></div>
            {files.length === 0 ? <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5"><p className="text-sm text-slate-400">Cuando compartas la carpeta de Drive listaremos aquí todos sus archivos ordenados.</p></div> : <div className="space-y-3">{files.map((file) => <div key={file.id} className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div className="flex items-center gap-2"><span className="font-semibold text-white text-sm">{file.name}</span><span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">{file.extension}</span></div><div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1"><span>Categoría: {file.category}</span>{file.brand && <span>• {file.brand}</span>}{file.ecuType && <span>• {file.ecuType}</span>}<span>• {(file.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span></div></div><Button size="sm" variant={isVip ? "outline" : "ghost"} onClick={() => handleDownload(file.name)} className={isVip ? "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10" : "text-slate-400 hover:text-white"}>{isVip ? <><Download className="h-4 w-4 mr-1.5" /> Descargar</> : <><Lock className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Requiere VIP</>}</Button></div>)}</div>}
          </div>
        )}
      </main>
    </div>
  );
}
