import React, { useState, useEffect, useRef } from "react";
import { Play, Upload, Image as ImageIcon } from "lucide-react";
import { Project } from "../portfolioData";

interface ProjectCardMediaProps {
  project: Project;
  isHovered: boolean;
  hasVideo: boolean;
  customImage?: string;
  onOpenUpload: (projectId: string, e: React.MouseEvent) => void;
  resolveAssetUrl: (url: string | undefined) => string;
  getYouTubeId: (url: string | undefined) => string | null;
  getProjectVideoSrc: (url: string | undefined) => string;
}

export const ProjectCardMedia: React.FC<ProjectCardMediaProps> = ({
  project,
  isHovered,
  hasVideo,
  customImage,
  onOpenUpload,
  resolveAssetUrl,
  getYouTubeId,
  getProjectVideoSrc,
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryStep, setRetryStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Compute active image source (custom image override or resolved public path)
  const resolvedUrl = customImage || resolveAssetUrl(project.mediaUrl);
  const [imgSrc, setImgSrc] = useState(resolvedUrl);

  useEffect(() => {
    setHasError(false);
    setRetryStep(0);
    const nextSrc = customImage || resolveAssetUrl(project.mediaUrl);
    setImgSrc(nextSrc);

    // If preloaded and cached in memory, immediately mark as loaded to eliminate black screen/skeleton delay
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [project.id, project.mediaUrl, customImage]);

  const handleImageError = () => {
    if (customImage || (project.mediaUrl || "").startsWith("http")) {
      setHasError(true);
      return;
    }

    const clean = (project.mediaUrl || "").replace(/^\.?\//, "");
    if (retryStep === 0) {
      // First retry: alternate between absolute and relative root path
      const nextSrc = imgSrc.startsWith("/") ? `./${clean}` : `/${clean}`;
      setRetryStep(1);
      setImgSrc(nextSrc);
    } else {
      // Both attempts failed: switch to styled brutalist graphic fallback
      setHasError(true);
    }
  };

  const ytId = getYouTubeId(project.videoUrl);

  return (
    <div className="h-52 relative overflow-hidden bg-[#0A0A0C] border-b-2 border-[#0F0F10] select-none">
      {/* Top Left Project Work Number Badge */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <span className="px-2 py-0.5 bg-black border border-[#FF3B3F]/40 text-[8px] font-mono text-white uppercase rounded-none font-bold tracking-widest shadow-sm">
          {project.projectWorkNum}
        </span>
      </div>

      {/* Top Right Quick Upload / Customize Button on Card Hover */}
      <button
        type="button"
        onClick={(e) => onOpenUpload(project.id, e)}
        className="absolute top-3 right-3 z-30 px-2 py-1 bg-black/85 hover:bg-[#FF3B3F] text-white/80 hover:text-white border border-white/20 hover:border-[#FF3B3F] text-[9px] font-mono font-bold uppercase transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center gap-1 shadow-md cursor-pointer"
        title="Sostituisci o visualizza file originale"
      >
        <Upload className="w-2.5 h-2.5" />
        <span className="hidden sm:inline">Sostituisci</span>
      </button>

      {/* Fallback Graphic UI if Image Fails to Load */}
      {hasError ? (
        <div className="absolute inset-0 bg-[#0F0F14] p-4 flex flex-col justify-between border-2 border-[#FF3B3F]/30 z-10">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-[#FF3B3F] uppercase tracking-wider font-bold">
              {project.detailCategory}
            </span>
            <span className="text-[9px] font-mono text-white/40 uppercase">
              {project.software[0]}
            </span>
          </div>

          <div className="my-auto text-center px-2 py-2">
            <div className="w-9 h-9 mx-auto mb-2 rounded-none bg-[#FF3B3F]/10 border border-[#FF3B3F]/40 flex items-center justify-center text-[#FF3B3F]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h4 className="text-white font-sans text-xs sm:text-sm font-black line-clamp-2 uppercase tracking-wide">
              {project.title}
            </h4>
            <p className="text-[9px] font-mono text-white/50 mt-1">
              Visual preview pronta. Clicca per inserire la tua grafica.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[8px] font-mono text-white/40">
              PUBLIC: /{(project.mediaUrl || "").replace(/^\.?\//, "")}
            </span>
            <button
              type="button"
              onClick={(e) => onOpenUpload(project.id, e)}
              className="px-2 py-1 bg-[#FF3B3F] hover:bg-white text-white hover:text-black font-mono text-[9px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-2.5 h-2.5" />
              <span>Carica</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Image */}
          <img
            ref={imgRef}
            src={imgSrc}
            alt={project.title}
            loading="eager"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={handleImageError}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 select-none group-hover:scale-105 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } ${hasVideo && isHovered ? "opacity-0" : ""}`}
          />

          {/* Skeleton while loading */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-[#0E0E12] flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/10 border-t-[#FF3B3F] animate-spin" />
            </div>
          )}
        </>
      )}

      {/* Video Hover Previews */}
      {hasVideo && !ytId && (
        <video
          src={getProjectVideoSrc(project.videoUrl)}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {hasVideo && ytId && isHovered && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&enablejsapi=1`}
            className="absolute w-[130%] h-[130%] -top-[15%] -left-[15%] pointer-events-none border-none select-none max-w-none max-h-none rounded-none"
            title={project.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {/* Play Icon Badge for Video Projects */}
      {project.mediaType === "video" && (
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
          <div className="w-7 h-7 rounded-none bg-white border border-black flex items-center justify-center group-hover:bg-[#FF3B3F] group-hover:text-white transition-colors duration-200 shadow-[2px_2px_0px_#000]">
            <Play className="w-3 h-3 fill-current group-hover:scale-110 transition-transform duration-200" />
          </div>
        </div>
      )}
    </div>
  );
};
