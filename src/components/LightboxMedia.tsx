"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Video from "yet-another-react-lightbox/plugins/video";

type Aspect = "16/9" | "9/16" | "1/1" | "4/5";
type Fit = "cover" | "contain";

export default function EventLightbox({
  youtubeIds,
  fileSrc,
  poster,
  title = "Media",
  // rasio saat LIGHTBOX terbuka (preview selalu 16:9)
  aspect = "16/9",
  fit = "contain",
  className = "",
}: {
  youtubeIds?: string[];
  fileSrc?: string;
  poster?: string;
  title?: string;
  aspect?: Aspect;
  fit?: Fit;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const hasVideo = Boolean(fileSrc) || Boolean(youtubeIds && youtubeIds.length > 0);

  // susun slides: video file, youtube, atau fallback gambar
  const slides = useMemo(() => {
    const arr: any[] = [];
    if (fileSrc) {
      arr.push({
        type: "video",
        sources: [{ src: fileSrc, type: "video/mp4" }],
        poster,
        width: aspect === "9/16" ? 1080 : 1920,
        height: aspect === "9/16" ? 1920 : 1080,
        playsInline: true,
        controls: true,
      });
    }
    (youtubeIds || []).forEach((id) => {
      arr.push({ type: "youtube", id, poster, width: 1920, height: 1080 });
    });
    if (!arr.length && poster) arr.push({ src: poster, width: 1920, height: 1080 });
    return arr;
  }, [fileSrc, youtubeIds, poster, aspect]);

  return (
    <>
      {/* PREVIEW ringan: selalu landscape 16:9 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "group relative w-full overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/40",
          "transition hover:ring-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          className,
        ].join(" ")}
        style={{ aspectRatio: "16 / 9" }}
        aria-label={hasVideo ? "Buka video" : "Perbesar gambar"}
      >
        {poster ? (
          <Image src={poster} alt={title} fill sizes="100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/70 text-sm">
            {title}
          </div>
        )}

        {/* overlay halus; ikon Play hanya jika ada video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition" />
        {hasVideo ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/90 text-primary-900 shadow-lg group-hover:scale-105 transition">
              {/* Play icon pakai karakter supaya tanpa import */}
              <span className="text-xl translate-x-[1px]">▶</span>
            </span>
          </div>
        ) : null}
      </button>

      {/* LIGHTBOX: scroll halaman tetap aktif */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Video]}
        noScroll={{ disabled: true }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ imageFit: "contain" }}
        slides={slides}
        render={{
          // YouTube custom slide
          slide: ({ slide }) => {
            if ((slide as any).type === "youtube") {
              return (
                <div className="w-full h-full bg-black" style={{ aspectRatio: aspect.replace("/", " / ") }}>
                  <iframe
                    title={title}
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${(slide as any).id}?rel=0&playsinline=1&modestbranding=1&autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              );
            }
            return undefined; // gunakan renderer default untuk image/video file
          },
        }}
        video={{ controls: true, playsInline: true }}
        styles={{ slide: { objectFit: fit } }}
      />
    </>
  );
}
