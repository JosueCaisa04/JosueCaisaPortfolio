import React, { useState, useRef } from "react";
import { 
  X, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  FolderUp, 
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { Project } from "../portfolioData";

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  customImages: Record<string, string>;
  onUploadCustomImage: (projectId: string, file: File) => void;
  onResetCustomImage: (projectId: string) => void;
  resolveAssetUrl: (url: string | undefined) => string;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  customImages,
  onUploadCustomImage,
  onResetCustomImage,
  resolveAssetUrl,
}) => {
  const [activeTab, setActiveTab] = useState<"projects" | "guide">("projects");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadProjectId, setActiveUploadProjectId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerFileInput = (projectId: string) => {
    setActiveUploadProjectId(projectId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadProjectId) {
      onUploadCustomImage(activeUploadProjectId, file);
    }
  };

  const handleCopy = (filename: string) => {
    navigator.clipboard.writeText(filename);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0F0F12] border-2 border-white/20 shadow-[0_0_50px_rgba(230,57,70,0.2)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#16161C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-[#E63946] flex items-center justify-center text-white">
              <FolderUp className="w-4.4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-sans font-black text-sm sm:text-base uppercase tracking-wider">
                Gestione Media &amp; Immagini Lavori
              </h3>
              <p className="text-[10px] font-mono text-white/50">
                Visualizza, sostituisci o carica le grafiche dei tuoi progetti
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#121217]">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === "projects"
                ? "border-[#E63946] text-white bg-white/5"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            I Tuoi Progetti ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "guide"
                ? "border-[#E63946] text-white bg-white/5"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#E63946]" />
            <span>Guida al caricamento su GitHub</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === "projects" ? (
            <div className="space-y-4">
              <div className="p-3 bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div className="text-xs text-white/80 font-sans space-y-1">
                  <p className="font-bold text-white">Tutte le anteprime sono ora caricate e visibili!</p>
                  <p className="text-white/60">
                    Puoi sostituire qualsiasi immagine cliccando su <strong>"Carica dal computer"</strong> per vederla subito online nel tuo browser. Per renderla definitiva su GitHub, consulta la scheda guida in alto.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((project) => {
                  const isCustom = Boolean(customImages[project.id]);
                  const currentSrc = isCustom
                    ? customImages[project.id]
                    : resolveAssetUrl(project.mediaUrl);
                  const filename = (project.mediaUrl || "").replace(/^\.?\//, "");

                  return (
                    <div
                      key={project.id}
                      className="p-3 bg-[#141419] border border-white/10 hover:border-white/30 flex gap-3 transition-colors"
                    >
                      {/* Thumbnail preview */}
                      <div className="w-20 h-24 bg-black border border-white/10 shrink-0 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={currentSrc}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        {isCustom && (
                          <span className="absolute bottom-1 right-1 px-1 bg-[#E63946] text-white text-[7px] font-mono font-bold uppercase">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Details & Actions */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[8px] font-mono text-[#E63946] font-bold uppercase">
                              {project.projectWorkNum}
                            </span>
                            <span className="text-[8px] font-mono text-white/40 truncate">
                              {project.detailCategory}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate mt-0.5" title={project.title}>
                            {project.title}
                          </h4>
                          <p className="text-[9px] font-mono text-white/40 mt-1 truncate">
                            File: {filename}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleTriggerFileInput(project.id)}
                            className="px-2.5 py-1 bg-white hover:bg-[#E63946] text-black hover:text-white transition-colors text-[9px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-2.5 h-2.5" />
                            <span>Carica</span>
                          </button>

                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => onResetCustomImage(project.id)}
                              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white transition-colors text-[9px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer"
                              title="Ripristina grafica originale"
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              <span>Ripristina</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-white/80 font-sans text-xs">
              {/* FAQ Section */}
              <div className="p-4 bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E63946]" />
                  Devo caricare qualcosa per far vedere le immagini?
                </h4>
                <p className="leading-relaxed text-white/70">
                  <strong>No, non è obbligatorio caricare nulla subito:</strong> abbiamo inserito nel progetto tutte le immagini editoriali (Vans Old Skool, Coca-Cola x Jack Daniel's x AC Milan, Jägermeister, Caroselli AC Milan, ecc.) formattate e perfettamente visibili.
                </p>
                <p className="leading-relaxed text-white/70">
                  <strong>Se invece possiedi i tuoi file originali</strong> (esportati da Adobe Photoshop, Canva o Premiere) e vuoi che siano visibili per sempre su GitHub Pages, ti basta seguire i 2 passaggi qui sotto.
                </p>
              </div>

              {/* Step by step guide */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Come caricare i tuoi file su GitHub (Passo dopo passo)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#141419] border border-white/10">
                    <span className="text-[10px] font-mono font-bold text-[#E63946]">PASSO 1</span>
                    <h5 className="font-bold text-white text-xs mt-1">Trascina nella cartella public/</h5>
                    <p className="text-[10px] text-white/60 mt-1 leading-relaxed">
                      Prendi i tuoi file JPG o PNG ed inseriscili direttamente nella cartella <code className="text-[#E63946] bg-black px-1 py-0.5">public/</code> del tuo repository locale.
                    </p>
                  </div>

                  <div className="p-3 bg-[#141419] border border-white/10">
                    <span className="text-[10px] font-mono font-bold text-[#E63946]">PASSO 2</span>
                    <h5 className="font-bold text-white text-xs mt-1">Usa i nomi esatti</h5>
                    <p className="text-[10px] text-white/60 mt-1 leading-relaxed">
                      Assicurati che i file abbiano i nomi indicati nella tabella qui sotto (es. <code className="text-[#E63946] bg-black px-1 py-0.5">coca_acmilan.jpg</code>).
                    </p>
                  </div>

                  <div className="p-3 bg-[#141419] border border-white/10">
                    <span className="text-[10px] font-mono font-bold text-[#E63946]">PASSO 3</span>
                    <h5 className="font-bold text-white text-xs mt-1">Push su GitHub</h5>
                    <p className="text-[10px] text-white/60 mt-1 leading-relaxed">
                      Esegui nel terminale: <br />
                      <code className="text-green-400 bg-black px-1 py-0.5 text-[9px]">git add . &amp;&amp; git commit -m "Update works" &amp;&amp; git push</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* File Names Reference Table */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Nomi dei file per ciascun progetto:
                </h4>
                <div className="border border-white/10 overflow-hidden">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead className="bg-[#181820] text-white/60 border-b border-white/10">
                      <tr>
                        <th className="p-2 font-bold">Progetto</th>
                        <th className="p-2 font-bold">Nome file in public/</th>
                        <th className="p-2 font-bold text-right">Azione</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#101014]">
                      {projects.map((p) => {
                        const filename = (p.mediaUrl || "").replace(/^\.?\//, "");
                        return (
                          <tr key={p.id} className="hover:bg-white/5">
                            <td className="p-2 text-white font-sans font-semibold">
                              <span className="text-[#E63946] font-mono text-[9px] mr-1.5">{p.projectWorkNum}</span>
                              {p.title}
                            </td>
                            <td className="p-2 text-green-400">
                              {filename}
                            </td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() => handleCopy(filename)}
                                className="px-2 py-0.5 bg-white/10 hover:bg-[#E63946] text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                                title="Copia nome file"
                              >
                                {copiedFile === filename ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-green-300" />
                                    <span>Copiato</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>Copia</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#141418] flex items-center justify-between">
          <span className="text-[10px] font-mono text-white/40">
            {Object.keys(customImages).length > 0
              ? `${Object.keys(customImages).length} immagine/i personalizzata/e salvate in cache`
              : "Nessuna personalizzazione attiva"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#E63946] hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
