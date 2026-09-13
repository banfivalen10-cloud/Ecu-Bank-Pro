import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/_core/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  Lock,
  Unlock,
  CheckCircle,
  FileCode,
  FolderOpen,
  ArrowUpDown,
  HardDrive,
  FileBox,
} from "lucide-react";

export default function DriveExplorer() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";
  const initialModule = searchParams.get("module") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedModule, setSelectedModule] = useState(initialModule);
  const [selectedBrand, setSelectedBrand] = useState("all");

  const { user } = useAuth();
  const isVip = user?.membershipStatus === "vip_lifetime" || user?.membershipStatus === "vip_monthly";

  const { data: modules } = trpc.library.modules.useQuery();
  const { data: files, isLoading } = trpc.library.searchFiles.useQuery({
    moduleId: selectedModule || undefined,
    query: query || undefined,
  });

  const brands = useMemo(() => {
    if (!files) return [];
    const set = new Set<string>();
    files.forEach((f) => {
      if (f.brand) set.add(f.brand);
    });
    return Array.from(set);
  }, [files]);

  const filteredFiles = useMemo(() => {
    if (!files) return [];
    if (selectedBrand === "all") return files;
    return files.filter((f) => f.brand === selectedBrand);
  }, [files, selectedBrand]);

  const handleDownloadClick = (fileName: string) => {
    if (!isVip) {
      toast.error("Acceso restringido", {
        description: "Necesitas membresía activa para descargar archivos originales y paquetes completos.",
        action: {
          label: "Comprar Acceso",
          onClick: () => setLocation("/pricing"),
        },
      });
      return;
    }

    toast.success(`Iniciando descarga simulada de: ${fileName}`, {
      description: "En la fase final, este botón se conecta con tu enlace oficial de Google Drive.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
              <HardDrive className="h-3.5 w-3.5" />
              Índice de Google Drive
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Buscador Global de Archivos y Recursos
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Filtra por módulo, marca de vehículo o ECU. Todos los archivos están listos para asociar sus enlaces de descarga de Google Drive.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isVip && (
              <Button
                onClick={() => setLocation("/pricing")}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                <Lock className="h-4 w-4 mr-2" />
                Desbloquear Todo con VIP
              </Button>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, código de centralita, versión..."
                className="pl-10 h-11 bg-slate-950/80 border-white/15 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="h-11 px-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                <option value="">Todos los Módulos</option>
                {modules?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} - {m.title.slice(0, 30)}...
                  </option>
                ))}
              </select>

              {brands.length > 0 && (
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="h-11 px-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="all">Todas las Marcas</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              )}

              {(query || selectedModule || selectedBrand !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setSelectedModule("");
                    setSelectedBrand("all");
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
          <span>Mostrando {filteredFiles.length} recursos encontrados</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Estructura de Google Drive sincronizada
          </span>
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5">
            <FileBox className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No se encontraron archivos</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              Prueba con otro término de búsqueda o selecciona otro módulo del catálogo.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                    {file.extension}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm sm:text-base hover:text-cyan-300 transition-colors">
                        {file.name}
                      </span>
                      {file.isVerified && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-500/10 border-emerald-500/30 text-emerald-300 py-0"
                        >
                          Verificado
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      {file.brand && (
                        <span className="text-slate-300 font-medium">Marca: {file.brand}</span>
                      )}
                      {file.ecuType && (
                        <span>• ECU: <span className="text-slate-200">{file.ecuType}</span></span>
                      )}
                      {file.softwareName && (
                        <span>• Software: {file.softwareName}</span>
                      )}
                      <span>• {(file.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>

                    {file.description && (
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
                        {file.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Button
                    size="sm"
                    variant={isVip ? "default" : "outline"}
                    onClick={() => handleDownloadClick(file.name)}
                    className={
                      isVip
                        ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                        : "border-white/20 text-slate-300 hover:bg-white/5"
                    }
                  >
                    {isVip ? (
                      <>
                        <Download className="h-4 w-4 mr-2" /> Descargar de Drive
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5 mr-2 text-amber-400" /> Desbloquear
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
