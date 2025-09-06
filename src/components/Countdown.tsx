"use client";
import React from "react";

function diff(target: Date) {
  const now = new Date().getTime();
  const t = target.getTime();
  const d = Math.max(0, t - now);
  const days = Math.floor(d / (1000 * 60 * 60 * 24));
  const hours = Math.floor((d / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((d / (1000 * 60)) % 60);
  const secs = Math.floor((d / 1000) % 60);
  return { days, hours, mins, secs, done: d === 0 };
}

export default function Countdown({
  target = "2025-09-11T09:00:00+07:00",
}: {
  target?: string;
}) {
  const [t, setT] = React.useState(() => diff(new Date(target)));

  React.useEffect(() => {
    const id = setInterval(() => setT(diff(new Date(target))), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t.done) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-300 ring-1 ring-green-400/30">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Mengudara sekarang!
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 text-white ring-1 ring-white/10">
      <span className="text-white/70 text-sm">Menuju Soft Opening:</span>
      <span className="font-semibold tabular-nums">
        {t.days} hari : {pad(t.hours)}:{pad(t.mins)}:{pad(t.secs)}
      </span>
    </div>
  );
}
