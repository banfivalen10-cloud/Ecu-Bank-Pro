import { useRoute, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Database,
  GraduationCap,
  Cpu,
  Zap,
  Box,
  Key,
};

export default function ModuleDetail() {
  const [, params] = useRoute("/module/:id");
  const [, setLocation] = useLocation();
  const moduleId = params?.id || "";

  const { user } = useAuth();
  const isVip = user?.membershipStatus === "vip_lifetime" || user?.membershipStatus === "vip_monthly";

  const { data, isLoading } = trpc.library.moduleDetail.useQuery(
    { id: moduleId },
    { enabled: !!moduleId }
  );

  const mod = data?.module;
  const files = data?.files || [];

  const IconComp = mod ? ICON_MAP[mod.icon] || Database : Database;

  const handleDownload = (fileName: string) => {
    if (!isVip) {
      toast.error("Contenido protegido", {
        description: "Adquiere el pase de acceso VIP para descargar este archivo o carpeta.",
        action: {
          label: "Ver Planes",
          onClick: () => setLocation("/pricing"),
        },
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
          <p className="text-sm text-slate-400 mt-2 mb-6">
            El módulo solicitado no existe o aún está en preparación técnica.
          </p>
          <Link href="/">
            <Button variant="outline" className="border-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver al catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  let tagsArray: string[] = [];
  try {
    tagsArray = JSON.parse(mod.tags);
  } catch {
    tagsArray = [mod.tags];
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a todos los módulos
          </Link>
        </div>

        {/* Module Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 relative overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/15 bg-white/5"
                style={{ color: mod.accentColor }}
              >
                <IconComp className="h-7 w-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {mod.code}
                  </span>
                  {isVip ? (
                    <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px]">
                      <Unlock className="h-3 w-3 mr-1" /> Acceso VIP habilitado
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-[10px]">
                      <Lock className="h-3 w-3 mr-1" /> Requiere membresía
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {mod.title}
                </h1>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  {mod.subtitle}
                </p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-3xl">
                  {mod.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {tagsArray.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/5 border border-white/10 text-slate-300 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="text-xs text-slate-400">
                Carpeta Drive vinculada:{" "}
                <span className="text-cyan-400 font-mono text-[11px] block sm:inline">
                  {mod.driveFolderId || "PENDIENTE"}
                </span>
              </div>

              {!isVip ? (
                <Button
                  onClick={() => setLocation("/pricing")}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold w-full md:w-auto"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Comprar Acceso para Descargar
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    toast.success("Carpeta de Google Drive abierta", {
                      description: "Redirigiendo a los archivos sincronizados en la nube.",
                    })
                  }
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold w-full md:w-auto"
                >
                  <FolderSync className="h-4 w-4 mr-2" />
                  Abrir Carpeta Completa en Drive
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Section Content / Drive Files List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Archivos y Recursos en esta Sección
              <span className="text-xs font-normal text-slate-400">
                ({files.length} cargados en maqueta)
              </span>
            </h2>

            <Link href={`/drive-explorer?module=${mod.id}`}>
              <Button variant="ghost" size="sm" className="text-cyan-400 text-xs hover:text-cyan-300">
                Buscar dentro de este módulo
              </Button>
            </Link>
          </div>

          {files.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-sm text-slate-400">
                Cuando me compartas las fotos de cómo se ve esta sección por dentro y su carpeta de Drive, listaremos aquí todos sus archivos ordenados.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {file.name}
                      </span>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {file.extension}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                      <span>Categoría: {file.category}</span>
                      {file.brand && <span>• {file.brand}</span>}
                      {file.ecuType && <span>• {file.ecuType}</span>}
                      <span>• {(file.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isVip ? "outline" : "ghost"}
                    onClick={() => handleDownload(file.name)}
                    className={
                      isVip
                        ? "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                        : "text-slate-400 hover:text-white"
                    }
                  >
                    {isVip ? (
                      <>
                        <Download className="h-4 w-4 mr-1.5" /> Descargar
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Requiere VIP
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
