"use client";

export default function MediaBlock({
  youtubeId,
  src,
  poster,
  className = "",
  title = "Video",
  controls = true,
}: {
  youtubeId?: string;
  src?: string;           // file video (mp4/m3u8)
  poster?: string;
  className?: string;
  title?: string;
  controls?: boolean;
}) {
  const isYouTube = !!youtubeId;

  if (!isYouTube && !src) return null;

  return (
    <div className={`relative w-full aspect-video overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/40 ${className}`}>
      {isYouTube ? (
        <iframe
          title={title}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <video
          className="w-full h-full object-cover"
          src={src}
          poster={poster}
          controls={controls}
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}
