"use client";
import React from "react";

/** BackgroundFX — hanya gradasi + noise, TANPA grid */
export default function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Lapisan utama gradasi (didefinisikan di globals.css via .bg-app jika kamu memakainya) */}
      <div className="absolute inset-0 bg-app" />

      {/* HAPUS/COMMENT baris grid ini:
      <div className="absolute inset-0 bg-grid opacity-60" />
      */}

      {/* Noise lembut (boleh diperkecil opasitas jika mau) */}
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30" />

      {/* Orbs blur warna brand (opsional) */}
      <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full
                      bg-gradient-to-br from-orange-500/30 to-transparent blur-3xl" />
      <div className="absolute top-[42%] -left-24 h-96 w-96 rounded-full
                      bg-gradient-to-tr from-primary-500/20 to-transparent blur-3xl" />

      {/* Ring conic anim (opsional) */}
      <div
        className="absolute left-1/2 top-[18%] -translate-x-1/2 -translate-y-1/2
                   size-[720px] opacity-25 [mask-image:radial-gradient(closest-side,black,transparent)]
                   animate-spin-slow"
        style={{
          backgroundImage:
            "conic-gradient(from 90deg at 50% 50%, rgb(var(--tj-orange)/.18), transparent 40% 60%, rgb(var(--tj-blue)/.12))",
        }}
      />
    </div>
  );
}
