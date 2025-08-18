"use client";
import React, { useEffect, useState } from "react";

export default function LiveVideoEmbed({ videoId = "DOOrIxw5xOw", autoplay = false }: { videoId?: string; autoplay?: boolean; }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [videoId]);

  const params = new URLSearchParams({
    autoplay: String(autoplay ? 1 : 0),
    mute: "0",
    playsinline: "1",
    rel: "0",
  });

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
      {loading && !error && (
        <div className="absolute inset-0 grid place-items-center bg-black/40 text-white/80">Memuat…</div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/50 text-red-300 text-sm">{error}</div>
      )}
      <iframe
        className="w-full h-full relative z-[10] pointer-events-auto"
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setLoading(false)}
        onError={() => setError("Gagal memuat player YouTube.")}
      />
    </div>
  );
}