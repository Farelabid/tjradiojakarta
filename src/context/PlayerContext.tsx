"use client";

/**
 * TJRadio PlayerContext — Active-Passive Failover (Production Hardened)
 * - UI TETAP: API hook sama persis (isPlaying, togglePlay, dll.)
 * - Conservative switching untuk mencegah "putus-putus":
 *   • Grace period setelah start/switch (abaikan stall sementara)
 *   • Multi-strike stall (harus X kali berturut-turut)
 *   • Recovery bertahap: nudge → softReload (rate-limited) → failover
 *   • Connect-timeout lebih longgar (default 15s)
 *   • Anti false-failover saat tab hidden
 *   • Sticky di backup + verifikasi balik ke primary
 *   • Persist volume/mute, event bridge dengan video
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ==============================
   ENV & Util
   ============================== */

const env = {
  primary: process.env.NEXT_PUBLIC_STREAM_PRIMARY || "",
  backup: process.env.NEXT_PUBLIC_STREAM_BACKUP || "",
  debug: (process.env.NEXT_PUBLIC_PLAYER_DEBUG || "0") === "1",

  // Deteksi & timing (lebih longgar default-nya)
  stallMs: clampInt(process.env.NEXT_PUBLIC_PLAYER_STALL_MS, 15000, 5000, 60000), // default 15s
  connectTimeoutMs: clampInt(process.env.NEXT_PUBLIC_PLAYER_CONNECT_TIMEOUT_MS, 15000, 5000, 60000), // default 15s
  stickyMs: clampInt(process.env.NEXT_PUBLIC_PLAYER_STICKY_MS, 5 * 60_000, 10_000, 30 * 60_000), // default 5m
  retryPrimaryMs: clampInt(process.env.NEXT_PUBLIC_PLAYER_RETRY_PRIMARY_MS, 120_000, 20_000, 10 * 60_000), // default 120s
  verifyPrimaryMs: clampInt(process.env.NEXT_PUBLIC_PLAYER_VERIFY_MS, 6000, 1000, 30000), // default 6s

  // Anti thrash
  stallStrikes: clampInt(process.env.NEXT_PUBLIC_PLAYER_STALL_STRIKES, 2, 1, 5), // perlu 2 kali deteksi stall beruntun
  graceAfterSwitchMs: clampInt(process.env.NEXT_PUBLIC_PLAYER_GRACE_MS, 12000, 2000, 30000), // abaikan stall 12s setelah switch
  softReloadCooldownMs: clampInt(process.env.NEXT_PUBLIC_PLAYER_RELOAD_COOLDOWN_MS, 10000, 2000, 60000), // min 10s antar softReload
};

function clampInt(src: string | undefined, def: number, min: number, max: number) {
  const n = parseInt(String(src || ""), 10);
  if (Number.isFinite(n)) return Math.max(min, Math.min(max, n));
  return def;
}
function clamp01(n: number) {
  if (!Number.isFinite(n)) return 1;
  return Math.max(0, Math.min(1, n));
}
const log = {
  info: (...a: any[]) => env.debug && console.info("[Player]", ...a),
  warn: (...a: any[]) => env.debug && console.warn("[Player]", ...a),
  error: (...a: any[]) => env.debug && console.error("[Player]", ...a),
};

function cacheBust(url: string) {
  try {
    const u = new URL(url, typeof window !== "undefined" ? window.location.href : "http://localhost/");
    u.searchParams.set("_ts", Date.now().toString());
    return u.toString();
  } catch {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}_ts=${Date.now()}`;
  }
}
function lsGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v == null) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}
function lsSet<T>(key: string, v: T) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

/* ==============================
   Types & Context
   ============================== */

type ServerRole = "primary" | "backup";

type PlayerContextValue = {
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  muted: boolean;
  setMuted: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  isExpanded: boolean;
  setExpanded: (v: boolean) => void;

  activeServer: ServerRole;
  primaryUrl: string;
  backupUrl: string;
  lastFailoverAt: number | null;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

/* ==============================
   Provider
   ============================== */

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  if (!env.primary || !env.backup) {
    log.warn("NEXT_PUBLIC_STREAM_PRIMARY & NEXT_PUBLIC_STREAM_BACKUP harus diisi.");
  }

  // State dasar
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [muted, _setMuted] = useState<boolean>(() => (typeof window !== "undefined" ? lsGet("tj:muted", false) : false));
  const [volume, _setVolume] = useState<number>(() => (typeof window !== "undefined" ? lsGet("tj:vol", 0.9) : 0.9));
  const [isExpanded, setExpanded] = useState(false);

  // Failover state
  const [activeServer, setActiveServer] = useState<ServerRole>("primary");
  const [lastFailoverAt, setLastFailoverAt] = useState<number | null>(null);

  // Watchdog refs
  const lastProgressTsRef = useRef<number>(0);
  const lastSwitchAtRef = useRef<number>(0);
  const stallStrikesRef = useRef<number>(0);
  const recoverAttemptsRef = useRef<number>(0);

  const stallIntervalRef = useRef<number | null>(null);
  const retryIntervalRef = useRef<number | null>(null);
  const verifyTimeoutRef = useRef<number | null>(null);
  const connectTimeoutRef = useRef<number | null>(null);
  const lastReloadAtRef = useRef<number>(0);
  const switchingRef = useRef(false);

  const clearInt = (ref: React.MutableRefObject<number | null>) => {
    if (ref.current != null) {
      window.clearInterval(ref.current);
      ref.current = null;
    }
  };
  const clearTO = (ref: React.MutableRefObject<number | null>) => {
    if (ref.current != null) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const activeUrl = useMemo(() => (activeServer === "primary" ? env.primary : env.backup), [activeServer]);

  // Connect-timeout helpers
  const clearConnectTO = () => clearTO(connectTimeoutRef);
  const armConnectTO = () => {
    clearConnectTO();
    connectTimeoutRef.current = window.setTimeout(() => {
      const a = audioRef.current;
      if (!a) return;
      if (!a.paused && document.visibilityState === "visible") {
        log.warn("Connect-timeout. Failover ke BACKUP.");
        failoverToBackup("connect-timeout");
      }
    }, env.connectTimeoutMs);
  };

  // Reset counters on progress
  const markProgress = () => {
    lastProgressTsRef.current = Date.now();
    stallStrikesRef.current = 0;
    recoverAttemptsRef.current = 0;
  };

  /* ===== Create <audio> once ===== */
  useEffect(() => {
    if (audioRef.current) return;

    const a = document.createElement("audio");
    a.preload = "none";
    a.crossOrigin = "anonymous";
    a.controls = false;
    a.style.display = "none";
    a.volume = clamp01(volume);
    a.muted = muted;
    document.body.appendChild(a);
    audioRef.current = a;

    const onPlay = () => {
      setPlaying(true); // optimistic UI
    };
    const onPlaying = () => {
      setPlaying(true);
      markProgress();
      clearConnectTO();
      window.dispatchEvent(new Event("tj:radio-play"));
    };
    const onPause = () => {
      setPlaying(false);
      clearConnectTO();
    };
    const onTimeUpdate = () => markProgress();
    const onWaiting = () => {
      // Jangan langsung switch; biarkan recovery bekerja.
      log.info("waiting… (buffering)");
      nudgePlayback();
    };
    const onStalled = () => {
      log.info("stalled event");
      nudgePlayback();
    };
    const onError = () => {
      setPlaying(false);
      clearConnectTO();
      if (!a.paused) failoverToBackup("error");
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("pause", onPause);
    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("stalled", onStalled);
    a.addEventListener("error", onError);

    const onVideoPlay = () => {
      try {
        a.pause();
      } catch {}
    };
    window.addEventListener("tj:video-play", onVideoPlay);

    const onOnline = () => {
      log.info("Back online → softReload()");
      softReload();
    };
    window.addEventListener("online", onOnline);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("stalled", onStalled);
      a.removeEventListener("error", onError);
      window.removeEventListener("tj:video-play", onVideoPlay);
      window.removeEventListener("online", onOnline);
      try {
        a.src = "";
        a.load();
        a.remove();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===== Persist mute/volume ===== */
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    if (typeof window !== "undefined") lsSet("tj:muted", muted);
  }, [muted]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = clamp01(volume);
    if (typeof window !== "undefined") lsSet("tj:vol", clamp01(volume));
  }, [volume]);

  /* ===== Apply src on server change ===== */
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !activeUrl) return;

    const wasPlaying = !a.paused;
    try {
      a.pause();
      a.src = cacheBust(activeUrl);
      a.load();

      // Grace setelah switch: abaikan stall sementara
      lastSwitchAtRef.current = Date.now();
      stallStrikesRef.current = 0;
      recoverAttemptsRef.current = 0;

      if (wasPlaying) {
        armConnectTO();
        void a.play().catch(() => {
          // butuh gesture; diamkan
        });
      }
      window.dispatchEvent(new CustomEvent("tj:server-changed", { detail: { server: activeServer } }));
      log.info("Switch server →", activeServer);
    } catch (e) {
      log.error("Gagal set src:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUrl]);

  /* ===== Watchdog (stall multi-strike, grace aware) ===== */
  useEffect(() => {
    clearInt(stallIntervalRef);
    stallIntervalRef.current = window.setInterval(() => {
      const a = audioRef.current;
      if (!a) return;
      if (!isPlaying || a.paused) return;
      if (document.visibilityState !== "visible") return;

      const now = Date.now();

      // Grace setelah switch/start
      if (now - lastSwitchAtRef.current < env.graceAfterSwitchMs) {
        return;
      }

      const delta = now - lastProgressTsRef.current;
      const stalled = delta > env.stallMs;

      if (!stalled) {
        stallStrikesRef.current = 0;
        return;
      }

      stallStrikesRef.current += 1;
      log.warn(`Stall strike ${stallStrikesRef.current}/${env.stallStrikes} (Δ=${delta}ms)`);

      if (stallStrikesRef.current < env.stallStrikes) {
        // beri kesempatan sampai strikes terpenuhi
        nudgePlayback();
        return;
      }

      // Strikes terpenuhi → recovery bertahap
      if (recoverAttemptsRef.current === 0) {
        recoverAttemptsRef.current++;
        log.warn("Recovery #1: nudgePlayback()");
        nudgePlayback();
        return;
      }

      if (recoverAttemptsRef.current === 1) {
        recoverAttemptsRef.current++;
        log.warn("Recovery #2: softReload() (rate-limited)");
        softReload();
        return;
      }

      // Recovery gagal → failover
      log.warn("Recovery gagal → failover ke BACKUP");
      failoverToBackup("stall");
    }, 2000); // interval 2s

    return () => clearInt(stallIntervalRef);
  }, [isPlaying, activeServer]);

  /* ===== On BACKUP: periodically try to return to PRIMARY (sticky) ===== */
  useEffect(() => {
    clearInt(retryIntervalRef);
    if (activeServer !== "backup") return;

    retryIntervalRef.current = window.setInterval(() => {
      const a = audioRef.current;
      if (!a) return;
      if (!isPlaying || a.paused) return;
      if (!lastFailoverAt) return;

      const now = Date.now();
      const stickyOk = now - lastFailoverAt >= env.stickyMs;
      if (!stickyOk) return;

      tryReturnToPrimary();
    }, env.retryPrimaryMs);

    return () => clearInt(retryIntervalRef);
  }, [activeServer, isPlaying, lastFailoverAt]);

  /* =========================
     Public Controls (UI API)
     ========================= */

  const play = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (!a.src) {
      a.src = cacheBust(activeUrl);
      a.load();
      lastSwitchAtRef.current = Date.now(); // grace di start pertama
    }
    armConnectTO();
    try {
      await a.play();
      setPlaying(true); // optimistic
    } catch (e) {
      log.warn("Play gagal/autoplay blocked:", e);
      setPlaying(false);
      clearConnectTO();
    }
  };

  const pause = () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.pause();
      setPlaying(false); // immediate UI
      clearConnectTO();
      window.dispatchEvent(new Event("tj:radio-pause"));
    } catch {}
  };

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) await play();
    else pause();
  };

  const setMuted = (v: boolean) => _setMuted(Boolean(v));
  const setVolume = (v: number) => _setVolume(clamp01(v));

  /* =========================
     Recovery & Failover Logic
     ========================= */

  function nudgePlayback() {
    const a = audioRef.current;
    if (!a) return;
    // Coba "kick" ringan: panggil play() ulang; di Safari kadang membantu
    void a.play().catch(() => {});
  }

  function softReload() {
    const a = audioRef.current;
    if (!a) return;
    const now = Date.now();
    if (now - lastReloadAtRef.current < env.softReloadCooldownMs) {
      log.info("softReload dibatalkan (cooldown).");
      return;
    }
    lastReloadAtRef.current = now;

    try {
      const wasPlaying = !a.paused;
      a.pause();
      a.src = cacheBust(activeUrl);
      a.load();

      // reset counters + grace singkat setelah reload
      lastSwitchAtRef.current = Date.now();
      stallStrikesRef.current = 0;

      if (wasPlaying) {
        armConnectTO();
        setTimeout(() => {
          void a.play().catch(() => {});
        }, 200);
      }
    } catch {}
  }

  function failoverToBackup(reason: "stall" | "error" | "connect-timeout") {
    if (switchingRef.current) return;

    const a = audioRef.current;
    if (!a) return;

    if (activeServer === "backup") {
      // sudah di backup: hanya softReload (rate-limited)
      log.warn(`Backup ${reason} → softReload()`);
      softReload();
      return;
    }

    log.warn(`Failover → BACKUP (${reason})`);
    switchingRef.current = true;
    try {
      clearConnectTO();
      setActiveServer("backup");
      setLastFailoverAt(Date.now());
      // src diganti via effect activeUrl
    } finally {
      setTimeout(() => (switchingRef.current = false), 300);
    }
  }

  function tryReturnToPrimary() {
    if (switchingRef.current) return;
    if (!env.primary) return;

    const a = audioRef.current;
    if (!a) return;

    log.info("Coba balik ke PRIMARY…");
    switchingRef.current = true;

    const wasPlaying = !a.paused;
    const prev = activeServer;

    let verified = false;
    const onTU = () => {
      verified = true;
    };

    try {
      a.removeEventListener("timeupdate", onTU);
      a.addEventListener("timeupdate", onTU);

      setActiveServer("primary"); // trigger switch
      setTimeout(() => {
        if (wasPlaying) {
          armConnectTO();
          void a.play().catch(() => {});
        }
      }, 80);

      clearTO(verifyTimeoutRef);
      verifyTimeoutRef.current = window.setTimeout(() => {
        a.removeEventListener("timeupdate", onTU);

        if (verified) {
          log.info("PRIMARY OK. Tetap di PRIMARY.");
          clearConnectTO();
          setPlaying(true);
          // Grace setelah balik primary
          lastSwitchAtRef.current = Date.now();
        } else {
          log.warn("PRIMARY belum OK. Balik ke BACKUP (reset sticky).");
          setActiveServer("backup");
          setLastFailoverAt(Date.now());
          if (wasPlaying) {
            armConnectTO();
            setTimeout(() => {
              void a.play().catch(() => {});
            }, 80);
          }
        }
        setTimeout(() => (switchingRef.current = false), 120);
      }, env.verifyPrimaryMs);
    } catch (e) {
      log.error("Verifikasi PRIMARY gagal:", e);
      a.removeEventListener("timeupdate", onTU);
      setActiveServer(prev);
      if (wasPlaying) {
        armConnectTO();
        setTimeout(() => {
          void a.play().catch(() => {});
        }, 80);
      }
      setTimeout(() => (switchingRef.current = false), 120);
    }
  }

  /* =========================
     Value untuk UI
     ========================= */

  const value: PlayerContextValue = {
    isPlaying,
    play,
    pause,
    togglePlay,
    muted,
    setMuted,
    volume,
    setVolume,
    isExpanded,
    setExpanded,

    activeServer,
    primaryUrl: env.primary,
    backupUrl: env.backup,
    lastFailoverAt,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

/* ==============================
   Hook
   ============================== */
export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within <PlayerProvider>");
  return ctx;
};
