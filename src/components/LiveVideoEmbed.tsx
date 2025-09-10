"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";

/** Deklarasi global utk YouTube IFrame API */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

type LiveVideoEmbedProps = {
  /** ID video YouTube */
  videoId?: string;
  /** Autoplay saat mount (biasanya false untuk patuh autoplay policy) */
  autoplay?: boolean;
};

export default function LiveVideoEmbed({
  videoId = "74B253rbVEc",
  autoplay = false,
}: LiveVideoEmbedProps) {
  const { pause: pauseRadio } = usePlayer();

  /** Wrapper tetap (tidak diganti oleh API) */
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  /** Target elemen yang akan diganti <iframe> oleh IFrame API */
  const targetRef = useRef<HTMLDivElement | null>(null);

  const playerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  /** Muat YouTube IFrame API sekali, lalu buat player */
  useEffect(() => {
    let cancelled = false;

    const loadYT = () =>
      new Promise<void>((resolve) => {
        if (window.YT?.Player) return resolve();
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => resolve();
        document.head.appendChild(tag);
      });

    (async () => {
      try {
        await loadYT();
        if (cancelled || !targetRef.current) return;

        playerRef.current = new window.YT.Player(targetRef.current, {
          videoId,
          playerVars: {
            // kontrol utama API
            autoplay: autoplay ? 1 : 0,
            playsinline: 1, // penting di iOS agar inline, bukan fullscreen
            rel: 0,
            // enablejsapi perlu saat kontrol via JS
            enablejsapi: 1,
            origin:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: () => setError(null),
            onStateChange: (e: any) => {
              const YT = window.YT;
              if (!YT) return;
              // Saat video mulai PLAY → radio auto-pause
              if (e.data === YT.PlayerState.PLAYING) {
                pauseRadio(); // HTMLMediaElement.pause() idempoten
              }
            },
          },
        });
      } catch (e) {
        console.error(e);
        setError("Gagal memuat player YouTube.");
      }
    })();

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [videoId, autoplay, pauseRadio]);

  /** Jika RADIO mulai play → pause video */
  useEffect(() => {
    const onRadioPlay = () => {
      try {
        playerRef.current?.pauseVideo?.();
      } catch {}
    };
    window.addEventListener("tj:radio-play", onRadioPlay);
    return () => window.removeEventListener("tj:radio-play", onRadioPlay);
  }, []);

  /** Cadangan: sinkron ukuran iframe dengan kontainer saat resize */
  useEffect(() => {
    if (!("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => {
      if (playerRef.current && wrapperRef.current) {
        const { clientWidth, clientHeight } = wrapperRef.current;
        playerRef.current.setSize?.(clientWidth, clientHeight);
      }
    });
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="
        relative w-full aspect-video rounded-2xl overflow-hidden
        ring-1 ring-white/10 bg-black/40
        /* Paksa iframe buatan YT mengisi penuh kontainer */
        [&>iframe]:absolute [&>iframe]:inset-0
        [&>iframe]:!w-full [&>iframe]:!h-full
        [&>iframe]:!top-0 [&>iframe]:!left-0
        [&>iframe]:block
      "
    >
      {/* Elemen ini akan DIGANTI <iframe> oleh YouTube IFrame API */}
      <div ref={targetRef} />

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 text-red-300 text-sm z-10">
          {error}
        </div>
      )}
    </div>
  );
}
