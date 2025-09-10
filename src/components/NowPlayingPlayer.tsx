"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  X,
  Radio,
  Mic,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext"; // sesuaikan jika lokasinya berbeda
import {
  nowJakarta,
  getSchedule,
  findCurrent,
  type Seg,
} from "@/lib/schedule";

/* ===========================
 * Hook: program saat ini (WIB)
 * ===========================*/
function useCurrentProgram() {
  const [clock, setClock] = useState(nowJakarta());
  const { isoDate, minutes } = clock;

  useEffect(() => {
    const t = setInterval(() => setClock(nowJakarta()), 30_000);
    return () => clearInterval(t);
  }, []);

  const schedule: Seg[] = useMemo(() => getSchedule(isoDate), [isoDate]);
  const { current } = useMemo(
    () => findCurrent(isoDate, minutes, schedule),
    [isoDate, minutes, schedule]
  );

  const timeLabel = current ? `${current.start}–${current.end} WIB` : null;

  return { program: current, timeLabel};
}

/* ===========================
 * Portal target helper
 * ===========================*/
const usePortalTarget = (id: string) => {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setEl(typeof window !== "undefined" ? document.getElementById(id) : null);
  }, [id]);
  return el;
};

/* ===========================
 * Mini Player (fixed bottom) — putih + tombol oranye
 * ===========================*/
const MiniBar: React.FC = () => {
  const { isPlaying, togglePlay, setExpanded } = usePlayer();
  const { program, timeLabel } = useCurrentProgram();

  const title = program?.show ?? "TJ Radio Jakarta — Teman Perjalanan Jakarta";
  const sub = program
    ? [
        timeLabel,
        program.live ? "LIVE" : null,
        program.host ? `dengan ${program.host}` : null,
      ]
        .filter(Boolean)
        .join(" • ")
    : "Streaming TJ RADIO Jakarta";

  return (
    <div className="fixed left-0 right-0 bottom-0 z-player-safe px-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl flex items-center gap-3 px-4 py-3.5 md:px-5 md:py-4">
          {/* Play/Pause (ORANYE) */}
          <button
            className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-orange-600 text-white shadow-md hover:bg-orange-500 transition"
            onPointerUp={(e) => {
              e.preventDefault();
              void togglePlay();
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          {/* Title & sub */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight truncate">{title}</p>
            <p className="text-xs text-slate-500 truncate">{sub}</p>
          </div>

          {/* Buka (biarkan biru seperti sebelumnya) */}
          <button
            className="shrink-0 inline-flex items-center justify-center h-11 px-4 rounded-full bg-primary-600 text-white hover:bg-primary-500 transition text-sm font-semibold"
            onPointerUp={(e) => {
              e.preventDefault();
              setExpanded(true);
            }}
            aria-label="Expand player"
          >
            <ChevronUp className="w-5 h-5 mr-1" />
            Buka
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===========================
 * Expanded Overlay (portal) — kembali ke tema gelap sebelumnya
 * ===========================*/
const ExpandedOverlay: React.FC = () => {
  const {
    isExpanded,
    setExpanded,
    isPlaying,
    togglePlay,
    muted,
    setMuted,
    volume,
    setVolume,
  } = usePlayer();

  const { program, timeLabel} = useCurrentProgram();
  const target = usePortalTarget("player-portal");
  const [imgOk, setImgOk] = React.useState(Boolean(program?.image));
  React.useEffect(() => setImgOk(Boolean(program?.image)), [program?.image]);
  
  if (!isExpanded || !target) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setExpanded(false)}
      />
      {/* ⬇️ CARD: dari bg-neutral-900 -> bg-neutral-900/70 + backdrop-blur */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[min(92vw,720px)] rounded-3xl
                  bg-neutral-900/70 backdrop-blur-md
                  border border-white/15 text-white
                  shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">

    {/* ⬇️ HEADER: tambahkan lapisan tipis agar teks kontras, sisanya tetap */}
    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
          <Radio className="w-5 h-5 text-orange-300" />
        </div>
        <div>
          <p className="font-semibold">TJ Radio Jakarta</p>
          <p className="text-xs text-white/60">Teman Perjalanan Jakarta</p>
        </div>
      </div>
      <button
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
        onPointerUp={() => setExpanded(false)}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

        {/* body */}
<div className="p-6 flex flex-col gap-6">
  {/* Info Program Realtime */}
  <div className="rounded-2xl bg-gradient-to-br from-primary-700/60 via-primary-600/40 to-orange-600/30 p-6 border border-white/10">
    <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
      {timeLabel && (
        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5">
          {timeLabel}
        </span>
      )}
      {program?.live && (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-semibold">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          LIVE
        </span>
      )}
    </div>

    <div className="mt-2 flex items-start gap-4">
      {/* Artwork: img valid ⇒ <Image>, kalau tidak ⇒ ikon Mic + judul */}
      <div
        className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-white/15 shadow
                   bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"
        aria-label={program?.show || "Program TJRadio"}
      >
        {imgOk && program?.image ? (
          <Image
            src={program.image}
            alt={program.host ?? program.show ?? "Program TJRadio"}
            fill
            className="object-cover"
            sizes="96px"
            loading="lazy"
            onError={() => setImgOk(false)}  // 404 ⇒ fallback
          />
        ) : (
          <div className="flex flex-col items-center justify-center px-2 text-center">
            <Mic className="text-white/90 mb-1" size={22} aria-hidden="true" />
            <span className="text-[10px] font-medium text-white/95 leading-tight line-clamp-2">
              {program?.show ?? "TJRadio"}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xl md:text-2xl font-semibold truncate">
          {program?.show ?? "Live Stream — TJ Radio Jakarta"}
        </p>
        {program?.host && (
          <p className="text-sm text-orange-200 font-medium mt-0.5">
            dengan {program.host}
          </p>
        )}
        {program?.desc && (
          <p className="text-sm text-white/80 mt-2">{program.desc}</p>
        )}
      </div>
    </div>
  </div>

          {/* Controls (tema gelap klasik) */}
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/15 hover:bg-white/25"
              onPointerUp={(e) => {
                e.preventDefault();
                void togglePlay();
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
            </button>

            <button
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20"
              onPointerUp={() => setMuted(!muted)}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-2 rounded-lg bg-white/20 accent-orange-500 outline-none"
              aria-label="Volume"
            />
          </div>

          <div className="text-xs text-white/60">
            Catatan: Jika audio tidak mulai, sentuh tombol Play (browser butuh gesture untuk
            memutar audio).
          </div>
        </div>
      </div>
    </div>,
    target
  );
};

/* ===========================
 * Wrapper
 * ===========================*/
const NowPlayingPlayer: React.FC = () => {
  return (
    <>
      <MiniBar />
      <ExpandedOverlay />
    </>
  );
};

export default NowPlayingPlayer;
