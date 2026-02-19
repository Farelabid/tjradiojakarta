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

/**
 * Smart Mutual Exclusion:
 * - Video pause Radio HANYA jika video benar-benar playing 500ms+ (bukan sekadar buffering)
 * - Radio pause Video langsung (user intent jelas)
 * - Tidak ada konflik saat page load atau buffering
 */
export default function LiveVideoEmbed({
  videoId = "-02uE2J8up8",
  autoplay = false,
}: LiveVideoEmbedProps) {
  const { pause: pauseRadio, isPlaying: isRadioPlaying } = usePlayer();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounce timer untuk konfirmasi video benar-benar playing
  const playConfirmTimerRef = useRef<number | null>(null);

  /** Clear the confirmation timer */
  const clearPlayConfirm = () => {
    if (playConfirmTimerRef.current != null) {
      window.clearTimeout(playConfirmTimerRef.current);
      playConfirmTimerRef.current = null;
    }
  };

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
            autoplay: autoplay ? 1 : 0,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
            origin:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: () => setError(null),
            onStateChange: (e: any) => {
              const YT = window.YT;
              if (!YT) return;

              if (e.data === YT.PlayerState.PLAYING) {
                // Video mulai PLAYING — tapi jangan langsung pause radio!
                // Tunggu 500ms untuk konfirmasi ini bukan sekadar buffering/preload
                clearPlayConfirm();
                playConfirmTimerRef.current = window.setTimeout(() => {
                  // Setelah 500ms masih playing? Berarti user memang mau nonton.
                  // Pause radio agar tidak bertumpuk.
                  pauseRadio();
                  // Dispatch event untuk sinkronisasi komponen lain jika ada
                  window.dispatchEvent(new Event("tj:video-play"));
                }, 500);
              } else {
                // Video paused/buffering/ended → batalkan timer
                clearPlayConfirm();
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
      clearPlayConfirm();
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [videoId, autoplay, pauseRadio]);

  /** Jika RADIO mulai play → pause video (user intent jelas) */
  useEffect(() => {
    const onRadioPlay = () => {
      clearPlayConfirm(); // Batalkan timer jika ada
      try {
        playerRef.current?.pauseVideo?.();
      } catch {}
    };
    window.addEventListener("tj:radio-play", onRadioPlay);
    return () => window.removeEventListener("tj:radio-play", onRadioPlay);
  }, []);

  /** Sinkron ukuran iframe dengan kontainer saat resize */
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
        [&>iframe]:absolute [&>iframe]:inset-0
        [&>iframe]:!w-full [&>iframe]:!h-full
        [&>iframe]:!top-0 [&>iframe]:!left-0
        [&>iframe]:block
      "
    >
      <div ref={targetRef} />

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 text-red-300 text-sm z-10">
          {error}
        </div>
      )}
    </div>
  );
}
