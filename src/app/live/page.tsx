"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mic, Clock, Play, Pause, MessageCircle } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext"; // sesuaikan jika lokasinya berbeda
import {
  nowJakarta,
  getSchedule,
  findCurrent,
  toMin,
  type Seg,
} from "@/lib/schedule";

export default function LivePage() {
  const { setExpanded, isPlaying, togglePlay } = usePlayer();

  // buka player (expanded) sekali ketika masuk halaman ini
  useEffect(() => {
    setExpanded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WIB realtime
  const [clock, setClock] = useState(nowJakarta());
  const { isoDate, minutes, fullDateLabel } = clock;
  useEffect(() => {
    const t = setInterval(() => setClock(nowJakarta()), 30_000);
    return () => clearInterval(t);
  }, []);


  // jadwal hari ini & segmen aktif
  const schedule: Seg[] = useMemo(() => getSchedule(isoDate), [isoDate]);
  const { idx: currentIdx, current } = useMemo(
    () => findCurrent(isoDate, minutes, schedule),
    [isoDate, minutes, schedule]
  );

  // progress segmen (lintas tengah malam aman)
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

  // list untuk panel jadwal kanan
  const scheduleList = useMemo(
    () =>
      schedule.map((s, i) => ({
        time: `${s.start} - ${s.end}`,
        show: s.show,
        host: s.host ?? "",
        live: s.live === true,
        current: i === currentIdx,
      })),
    [schedule, currentIdx]
  );

  // link WA Request Lagu (sesuai permintaan)
  const waLink =
    "https://wa.me/6282234534570?text=" +
    encodeURIComponent(
      "Halo TJRadio! Saya ingin request lagu / kirim salam"
    );

  const pageTitle ="Live Radio";
  const pageDesc = "Dengarkan siaran langsung TJ Radio Jakarta dengan kualitas audio terbaik";

  return (
    <div className="py-8 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold text-sm">SEDANG MENGUDARA</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{pageTitle}</h1>
          <p className="text-white/70 max-w-2xl mx-auto">{pageDesc}</p>
          <p className="text-white/50 text-xs mt-2">
            {fullDateLabel} • Zona waktu: <b>WIB (Asia/Jakarta)</b>
          </p>
        </div>

        {/* Grid utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom kiri: Kartu program aktif + CTA Request */}
          <div className="lg:col-span-2 space-y-6">
            {/* KARTU PROGRAM AKTIF — layout seragam dengan ProgramToday */}
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
              <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-orange-500/10 blur-2xl" />

              {/* GRID: mobile 2 kolom (foto | detail) + baris CTA di bawah (col-span-2) */}
              <div className="relative grid grid-cols-[auto,1fr] gap-4 md:gap-6">
                {/* Foto penyiar */}
                <div className="relative w-24 sm:w-28 md:w-32 aspect-square md:aspect-auto md:self-stretch">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    {current?.image ? (
                      <Image
                        src={current.image}
                        alt={current.host ?? current.show}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 112px, 128px"
                        priority
                      />
                    ) : (
                      <Mic className="text-white" size={80} />
                    )}
                  </div>
                </div>

                {/* Detail program */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {current && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-white/80">
                        <Clock className="h-3.5 w-3.5" />
                        {current.start}–{current.end} WIB
                      </span>
                    )}
                    {current?.live && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-semibold">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        LIVE
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-tight text-white">
                    {current?.show ?? "TJRadio Jakarta"}
                  </h2>
                  <p className="mt-1 font-semibold text-orange-300">
                    dengan {current?.host ?? "TJRadio"}
                  </p>
                  <p className="mt-2 text-sm text-white/80">
                    {current?.desc ??
                      "Program musik & informasi untuk menemani perjalanan Anda"}
                  </p>
                </div>

                {/* BARIS CTA + PROGRESS (di mobile col-span-2; di desktop menempel kolom kanan) */}
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
            </div>

            {/* HANYA 1 MENU CTA: Request Lagu (WhatsApp) */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 inline-flex w-full items-center gap-4"
              aria-label="Request lagu via WhatsApp"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-xl" />
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-white">Request Lagu</div>
                <div className="text-sm text-white/60">
                  Kirim permintaan & salam via WhatsApp
                </div>
                <div className="mt-1 text-xs text-orange-300 opacity-0 transition group-hover:opacity-100">
                  Buka WhatsApp →
                </div>
              </div>
            </a>
          </div>

          {/* Kolom kanan: Panel Jadwal */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Jadwal Siaran</h3>
              <div className="space-y-4">
                {scheduleList.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg transition-colors ${
                      item.current
                        ? "bg-orange-500/20 border border-orange-500/30"
                        : "hover:bg-primary-800/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-sm font-medium ${
                          item.current ? "text-orange-400" : "text-white/60"
                        }`}
                      >
                        {item.time}
                      </span>
                      {item.current && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-red-400 text-xs font-bold">LIVE</span>
                        </div>
                      )}
                    </div>
                    <h4
                      className={`font-semibold mb-1 ${
                        item.current ? "text-white" : "text-white/80"
                      }`}
                    >
                      {item.show}
                    </h4>
                    <p
                      className={`text-sm ${
                        item.current ? "text-orange-300" : "text-white/60"
                      }`}
                    >
                      {item.host}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-white/50 flex items-center gap-2 px-1">
              Semua waktu dalam WIB (Asia/Jakarta), realtime.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
