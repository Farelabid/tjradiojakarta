import Image from "next/image";

export default function MediaPlayer({
  youtubeId,
  src,
  poster,
  title = "Video promosi",
  aspect = "16/9",
  fit = "cover",
}: {
  youtubeId?: string;
  src?: string;
  poster?: string;
  title?: string;
  aspect?: "16/9" | "9/16" | "1/1" | "4/5";
  fit?: "cover" | "contain";
}) {
  if (!youtubeId && !src) return null;

  const aspectStyle = { aspectRatio: aspect.replace("/", " / ") };
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/40"
      style={aspectStyle}
    >
      {youtubeId ? (
        <iframe
          title={title}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&playsinline=1&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <video
          className={`w-full h-full ${fitClass}`}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
        />
      )}

      <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-black/60 text-white ring-1 ring-white/20">
        Media
      </span>
    </div>
  );
}
