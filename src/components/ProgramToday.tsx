"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Mic, Clock, Play, Pause } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext"; // sesuaikan jika lokasinya berbeda
import {
  nowJakarta,
  getSchedule,
  findCurrent,
  toMin,
  type Seg,
} from "@/lib/schedule";
import React from "react";

export default function ProgramToday() {
  const { togglePlay, isPlaying } = usePlayer();

  // WIB realtime
  const [clock, setClock] = useState(nowJakarta());
  const { isoDate, minutes } = clock;
  useEffect(() => {
    const t = setInterval(() => setClock(nowJakarta()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Ambil jadwal & segmen aktif
  const schedule: Seg[] = useMemo(() => getSchedule(isoDate), [isoDate]);
  const { current } = useMemo(
    () => findCurrent(isoDate, minutes, schedule),
    [isoDate, minutes, schedule]
  );

  // Progress acara (aman lintas tengah malam)
  const progress = useMemo(() => {
    if (!current) return null;
    const s = toMin(current.start);
    const e = toMin(current.end);
    const duration = e >= s ? e - s : 1440 - s + e;

    let elapsed =
      e >= s
        ? Math.min(Math.max(minutes - s, 0), duration)
        : minutes >= s
        ? minutes - s
        : minutes + (1440 - s);

    elapsed = Math.max(0, Math.min(elapsed, duration));
    const pct = Math.round((elapsed / duration) * 100);
    const hE = Math.floor(elapsed / 60);
    const mE = elapsed % 60;
    const hD = Math.floor(duration / 60);
    const mD = duration % 60;
    return { pct, label: `${hE}j ${mE}m / ${hD}j ${mD}m` };
  }, [current, minutes]);

  const title = current?.show ?? "TJRadio Jakarta";
  const host = current?.host ?? "TJRadio";
  const timeLabel = current ? `${current.start} - ${current.end} WIB` : "—";
  const desc = "Teman Perjalanan Jakarta";

  const [imgOk, setImgOk] = React.useState(Boolean(current?.image));
  React.useEffect(() => {
  setImgOk(Boolean(current?.image));
}, [current?.image]);


  return (
  <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
    {/* lembutkan background seperti di live */}
    <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-orange-500/10 blur-2xl" />

    {/* GRID: mobile 2 kolom (gambar | detail) + baris CTA di bawah (col-span-2).
       Di desktop, CTA otomatis pindah ke kolom kanan saja. */}
    <div className="relative grid grid-cols-[auto,1fr] gap-4 md:gap-6">

      {/* Kolom kiri — Artwork dengan fallback Mic + judul */}
      <div className="relative w-24 sm:w-28 md:w-32 aspect-square md:aspect-auto md:self-stretch">
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg
                     bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"
          aria-label={current?.show || "Program TJRadio"}
        >
          {imgOk && current?.image ? (
            <Image
              src={current.image}
              alt={current.show || "Program TJRadio"}
              fill
              className="object-cover"
              sizes="(max-width:768px) 112px, 128px"
              loading="lazy"
              onError={() => setImgOk(false)}   // jika 404 ⇒ fallback
            />
          ) : (
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <Mic className="text-white/90 mb-1" size={28} aria-hidden="true" />
              <span className="text-[10px] md:text-xs font-medium text-white/95 leading-tight line-clamp-2">
                {current?.show || "TJRadio"}
              </span>
            </div>
          )}
        </div>
      </div>


        {/* Kolom kanan — Detail */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {current && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-white/80">
                <Clock className="h-3.5 w-3.5" />
                {timeLabel}
              </span>
            )}
            {current?.live && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-semibold">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                LIVE
              </span>
            )}
          </div>

          <h3 className="mt-2 text-2xl md:text-3xl font-bold leading-tight text-white">
            {title}
          </h3>
          <p className="mt-1 font-semibold text-orange-300">dengan {host}</p>
          <p className="mt-2 text-sm text-white/80">{desc}</p>
        </div>

        {/* BARIS CTA + PROGRESS
            - Mobile: col-span-2 (DI BAWAH FOTO)
            - Desktop: pindah ke kolom kanan (md:col-span-1 md:col-start-2) */}
        <div className="col-span-2 md:col-span-1 md:col-start-2 mt-2 md:mt-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <button
              className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition
                w-full md:w-auto
                ${isPlaying ? "bg-primary-700/30 hover:bg-primary-600" : "bg-primary-600 hover:bg-primary-500"}`}
              onPointerUp={() => void togglePlay()}
              aria-label={isPlaying ? "Jeda" : "Dengarkan"}
              title={isPlaying ? "Jeda" : "Dengarkan"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Sedang Diputar" : "Dengarkan Langsung"}
            </button>

            {progress && (
              <div className="md:flex-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                    style={{ width: `${progress.pct}%` }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-white/55">
                  Berjalan {progress.label}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
