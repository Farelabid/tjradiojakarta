"use client";
import React from "react";

type Props = {
  dateText: string;
  hosts: string[];        // cukup nama host saja
  speedSeconds?: number;  // kecepatan scroll
};

export default function SoftOpeningMarquee({
  dateText,
  hosts,
  speedSeconds = 32,
}: Props) {
  // urutan: 1) tanggal highlight 2) daftar nama host
  const items = [dateText, ...hosts];
  // duplikasi untuk loop mulus (total 200% lebar track)
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-gradient-to-r from-[#0b1b2d]/60 via-[#0b1b2d]/40 to-[#0b1b2d]/60 backdrop-blur-sm">
      {/* fade-in/out di sisi kiri–kanan biar halus */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee" style={{ ["--duration" as any]: `${speedSeconds}s` }}>
          <ul className="track flex items-center gap-8 py-1.5 md:py-2 text-sm md:text-base">
            {doubled.map((text, i) => {
              const isDate = i % items.length === 0; // item pertama pada setiap siklus = tanggal
              return (
                <li key={i} className="whitespace-nowrap flex items-center gap-3">
                  {isDate ? (
                    // chip highlight tanggal
                    <span className="px-3 py-1 rounded-full ring-1 ring-white/15 bg-white/10 text-white font-semibold">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-300 to-sky-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.35)]">
                        {text}
                      </span>
                    </span>
                  ) : (
                    // nama host (tanpa kata "Host:")
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_2px_rgba(249,115,22,0.45)]" />
                      <span className="text-white/85">{text}</span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .marquee { position: relative; }
        .track { width: max-content; display: inline-flex; animation: marquee var(--duration) linear infinite; }
        .marquee:hover .track { animation-play-state: paused; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .track { animation: none; }
        }
      `}</style>
    </div>
  );
}
