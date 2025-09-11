"use client";
import React from "react";

type Status = {
  launched: boolean;
  withinWindow: boolean;
  mode: "test" | "prod";
  start: number;
  end: number;
  now: number;
};

export default function SoftOpeningLaunchButton() {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<"test" | "prod">("prod");
  const [celebrate, setCelebrate] = React.useState(false);

  const refresh = React.useCallback(async () => {
    const res = await fetch("/api/soft-opening", { cache: "no-store" });
    const j: Status = await res.json();
    setMode(j.mode);
    setVisible(j.withinWindow && !j.launched);
  }, []);

  React.useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000); // polling ringan
    return () => clearInterval(id);
  }, [refresh]);

  async function playJingle() {
    try {
      const audio = new Audio("/sfx/jingle.wav"); // taruh file di /public/sfx/
      audio.volume = 0.9;
      await audio.play();
    } catch {
      // fallback beep kecil
      try {
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = 660;
        gain.gain.value = 0.0001;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        osc.stop(ctx.currentTime + 0.65);
      } catch {}
    }
  }

  const handleClick = async () => {
    const needPin = process.env.NEXT_PUBLIC_REQUIRE_PIN !== "0";
    const code = needPin ? window.prompt("Masukkan PIN peluncuran:") ?? "" : "";
    setLoading(true);

    const res = await fetch("/api/soft-opening", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (res.ok && data.ok) {
      const confetti = (await import("canvas-confetti")).default;
      setCelebrate(true);
      playJingle();
      confetti({ particleCount: 240, spread: 120, startVelocity: 45, scalar: 1.1 });
      setTimeout(() => setCelebrate(false), 5000);
      setVisible(false); // langsung hilang di perangkat ini
    } else {
      alert(
        data.error === "invalid-code" ? "PIN salah."
        : data.error === "outside-window" ? "Di luar jadwal."
        : data.error === "already-launched" ? "Sudah diluncurkan."
        : "Gagal meluncurkan."
      );
      refresh(); // sinkron status global
    }
  };

  if (!visible && !celebrate) return null;

  return (
    <>
      {visible && (
        <div className="flex flex-col items-center gap-2 my-4">
          <button
            onClick={handleClick}
            disabled={loading}
            className="group relative px-9 py-4 rounded-full text-white font-extrabold text-lg md:text-xl
                       bg-orange-500 ring-2 ring-orange-300 shadow-[0_0_40px_rgba(249,115,22,0.65)]
                       hover:scale-105 active:scale-95 transition
                       before:absolute before:inset-[-4px] before:rounded-full
                       before:bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.35),transparent_60%)]
                       before:blur-sm before:-z-10 overflow-hidden"
          >
            <span className="relative z-10">
              {loading ? "Launching…" : "TEKAN UNTUK MENGUDARA"}
            </span>
            <span className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition
                             bg-[radial-gradient(150px_60px_at_10%_50%,rgba(255,255,255,0.18),transparent),
                                 radial-gradient(150px_60px_at_90%_50%,rgba(255,255,255,0.18),transparent)]" />
          </button>
        </div>
      )}

      {/* Overlay selebrasi */}
      {celebrate && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.25),rgba(2,6,23,0.8))]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-6 py-3 rounded-2xl ring-1 ring-white/15 bg-white/10 backdrop-blur-md">
              <div className="text-2xl md:text-4xl font-black text-white tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                WE ARE LIVE!
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
