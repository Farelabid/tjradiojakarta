"use client";

import { useCallback } from "react";

export default function ShareRow({ title }: { title: string }) {
  const share = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user canceled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link disalin ke clipboard");
      } catch {
        /* ignore */
      }
    }
  }, [title]);

  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <div className="text-sm text-white/70">Bagikan event ini</div>
      <button
        onClick={share}
        className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
      >
        Share
      </button>
    </div>
  );
}
