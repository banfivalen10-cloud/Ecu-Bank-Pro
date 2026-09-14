import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { driveTree } from "@/data/driveTree";
import {
  Search,
  Download,
  Lock,
  Unlock,
  CheckCircle,
  FileCode,
  FolderOpen,
  HardDrive,
  FileBox,
  Folder,
  ChevronRight,
  ArrowLeft,
  Home,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Archive,
} from "lucide-react";

type DriveNode = {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  size?: string | null;
  modifiedTime?: string;
  children?: DriveNode[];
};

const FOLDER_MIME = "application/vnd.google-apps.folder";
const rootNode: DriveNode = {
  id: driveTree.rootId,
  name: "TuneBank - Archivos/Files",
  mimeType: FOLDER_MIME,
  children: driveTree.children as unknown as DriveNode[],
};

function isFolder(node: DriveNode) {
  return node.mimeType === FOLDER_MIME;
}

function flattenFiles(node: DriveNode, path: DriveNode[] = []): Array<DriveNode & { path: DriveNode[] }> {
  if (!node.children) return isFolder(node) ? [] : [{ ...node, path }];
  return node.children.flatMap((child) => flattenFiles(child, [...path, node]));
}

function findNode(node: DriveNode, id: string): DriveNode | undefined {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const result = findNode(child, id);
    if (result) return result;
  }
  return undefined;
}

function formatSize(size?: string | null) {
  if (!size) return "—";
  const bytes = Number(size);
  if (!Number.isFinite(bytes)) return "—";
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function fileIcon(node: DriveNode) {
  if (node.mimeType.includes("pdf") || node.mimeType.includes("document")) return <FileText className="h-5 w-5" />;
  if (node.mimeType.includes("image")) return <ImageIcon className="h-5 w-5" />;
  if (node.mimeType.includes("zip") || node.mimeType.includes("rar") || node.mimeType.includes("7z")) return <Archive className="h-5 w-5" />;
  if (node.mimeType.includes("octet-stream")) return <FileCode className="h-5 w-5" />;
  return <FileBox className="h-5 w-5" />;
}

export default function DriveExplorer() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const initialFolder = params.get("folder") || rootNode.id;
  const [query, setQuery] = useState(initialQuery);
  const [currentFolderId, setCurrentFolderId] = useState(initialFolder);

  const isVip = true;
  const currentFolder = findNode(rootNode, currentFolderId) ?? rootNode;
  const allFiles = useMemo(() => flattenFiles(rootNode), []);
  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const breadcrumbs = useMemo(() => {
    const result: DriveNode[] = [];
    const walk = (node: DriveNode, trail: DriveNode[]): boolean => {
      if (node.id === currentFolder.id) {
        result.push(...trail, node);
        return true;
      }
      return (node.children ?? []).some((child) => walk(child, [...trail, node]));
    };
    walk(rootNode, []);
    return result.length ? result : [rootNode];
  }, [currentFolder.id]);

  const visibleFolders = isSearching
    ? []
    : (currentFolder.children ?? []).filter(isFolder);
  const visibleFiles = isSearching
    ? allFiles.filter(({ name, path }) => `${name} ${path.map((item) => item.name).join(" ")}`.toLowerCase().includes(normalizedQuery))
    : (currentFolder.children ?? []).filter((node) => !isFolder(node)).map((node) => ({ ...node, path: breadcrumbs.slice(0, -1) }));

  const navigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
    if (query) setQuery("");
    window.history.replaceState({}, "", `/drive-explorer?folder=${encodeURIComponent(folderId)}`);
  };

  const openDriveItem = (node: DriveNode) => {
    if (!node.webViewLink) {
      toast.error("Este elemento no tiene enlace de Drive disponible.");
      return;
    }
    window.open(node.webViewLink, "_blank", "noopener,noreferrer");
  };

  const goBack = () => {
    const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : rootNode;
    navigateToFolder(parent.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3"><HardDrive className="h-3.5 w-3.5" /> Índice de Google Drive</div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Explorador de Archivos</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">Navega por la estructura real de TuneBank - Archivos/Files o busca cualquier archivo indexado por nombre.</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en todo Drive: WinOLS, BMW, DAMOS, .rar..." className="pl-10 h-11 bg-slate-950/80 border-white/15 text-white placeholder:text-slate-500 rounded-xl" />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-300 bg-emerald-500/5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5" /> Snapshot verificado de Google Drive</Badge>
            <Badge variant="outline" className="border-white/10 text-slate-400">{allFiles.length.toLocaleString()} archivos indexados</Badge>
            {query && <Button variant="ghost" size="sm" onClick={() => setQuery("")} className="h-7 text-slate-400 hover:text-white">Limpiar búsqueda</Button>}
          </div>
        </div>

        {!isSearching && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-4 overflow-x-auto pb-1">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.id} className="flex items-center gap-1 shrink-0">
                {index > 0 && <ChevronRight className="h-3 w-3 text-slate-600" />}
                <button onClick={() => navigateToFolder(crumb.id)} className={`hover:text-cyan-300 transition-colors ${index === breadcrumbs.length - 1 ? "text-cyan-300 font-semibold" : ""}`}>
                  {index === 0 ? <span className="inline-flex items-center gap-1"><Home className="h-3 w-3" /> Raíz</span> : crumb.name}
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-3 px-1">
          <div><h2 className="text-lg font-bold text-white">{isSearching ? `Resultados para “${query}”` : currentFolder.name}</h2><p className="text-xs text-slate-500 mt-1">{isSearching ? `${visibleFiles.length} coincidencias encontradas` : `${visibleFolders.length} carpetas · ${visibleFiles.length} archivos en esta ubicación`}</p></div>
          {!isSearching && currentFolder.id !== rootNode.id && <Button variant="outline" size="sm" onClick={goBack} className="border-white/15 text-slate-300 hover:bg-white/5"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Atrás</Button>}
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-900/50">
          {!isSearching && visibleFolders.map((folder, index) => (
            <button key={folder.id} type="button" onClick={() => navigateToFolder(folder.id)} className={`w-full flex items-center justify-between gap-4 px-4 py-4 text-left hover:bg-cyan-500/10 transition-colors group ${index ? "border-t border-white/10" : ""}`}>
              <span className="flex items-center gap-3 min-w-0"><FolderOpen className="h-5 w-5 text-cyan-400 shrink-0" /><span className="min-w-0"><span className="block text-sm font-semibold text-slate-100 truncate">{folder.name}</span><span className="block text-[11px] text-slate-500 mt-1">{(folder.children ?? []).length} elementos indexados</span></span></span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-300 shrink-0" />
            </button>
          ))}

          {visibleFiles.map((file, index) => (
            <div key={file.id} className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.03] ${!isSearching && (visibleFolders.length || index) ? "border-t border-white/10" : ""}`}>
              <div className="flex items-start gap-3.5 min-w-0"><div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">{fileIcon(file)}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-semibold text-white text-sm truncate">{file.name}</span><Badge variant="outline" className="text-[10px] bg-emerald-500/10 border-emerald-500/30 text-emerald-300"><CheckCircle className="h-3 w-3 mr-1" /> Indexado</Badge></div><div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1"><span>{formatSize(file.size)}</span>{file.modifiedTime && <span>• {new Date(file.modifiedTime).toLocaleDateString("es-AR")}</span>}{isSearching && file.path.length > 0 && <span className="text-cyan-300">• {file.path.map((item) => item.name).join(" / ")}</span>}</div></div></div>
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center"><Button size="sm" onClick={() => openDriveItem(file)} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"><ExternalLink className="h-4 w-4 mr-1.5" /> Abrir en Drive</Button></div>
            </div>
          ))}

          {visibleFolders.length === 0 && visibleFiles.length === 0 && <div className="p-14 text-center"><FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" /><h3 className="text-lg font-bold text-white">Esta carpeta está vacía</h3><p className="text-sm text-slate-400 mt-1">Prueba otra carpeta o cambia el término de búsqueda.</p></div>}
        </div>
      </main>
    </div>
  );
}
