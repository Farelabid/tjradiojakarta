"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Stream URL: gunakan milik Samcloud yang sudah ada pada versi sebelumnya.
const STREAM_URL =
  "https://samcloud.spacial.com/api/listen?rid=302822&sid=142968&f=aac";

// Kunci penyimpanan lokal
const LS_VOLUME = "tj_v2_volume";
const LS_MUTED = "tj_v2_muted";

const EV_RADIO_PLAY = "tj:radio-play";
const EV_RADIO_PAUSE = "tj:radio-pause";

// Tipe konteks
interface PlayerContextType {
  isPlaying: boolean;
  isExpanded: boolean;
  muted: boolean;
  volume: number; // 0..1
  // control
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  setExpanded: (v: boolean) => void;
  toggleExpand: () => void;
  setMuted: (v: boolean) => void;
  setVolume: (v: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};

// Util sederhana untuk retry dengan backoff
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(false);
  const [isPlaying, setPlaying] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [muted, _setMuted] = useState(false);
  const [volume, _setVolume] = useState(1);

  // Load preferensi dari localStorage setelah mount
  useEffect(() => {
    mountedRef.current = true;
    try {
      const v = localStorage.getItem(LS_VOLUME);
      if (v !== null) _setVolume(Math.min(1, Math.max(0, Number(v))));
      const m = localStorage.getItem(LS_MUTED);
      if (m !== null) _setMuted(m === "1");
    } catch {}
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Sinkronkan properti audio saat ref siap
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
  }, [muted]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
  }, [volume]);

  // Simpan preferensi
  useEffect(() => {
    try {
      localStorage.setItem(LS_VOLUME, String(volume));
      localStorage.setItem(LS_MUTED, muted ? "1" : "0");
    } catch {}
  }, [volume, muted]);

  // Handler stabil untuk play (dengan retry ringan saat recovering jaringan)
  const play = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    if (!el.src) el.src = STREAM_URL;
    try {
      await el.play(); // returns Promise — wajib ditangani (autoplay policy) 
      setPlaying(true);
      // Beritahu komponen lain bahwa radio sedang diputar
      window.dispatchEvent(new CustomEvent(EV_RADIO_PLAY));
    } catch (err) {
      // NotAllowedError bila tanpa gesture, dsb.
      console.warn("Audio play blocked:", err);
      setPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    setPlaying(false);
    // Beritahu komponen lain bahwa radio berhenti
    window.dispatchEvent(new CustomEvent(EV_RADIO_PAUSE));
  }, []);

  // Debounce sederhana untuk menghindari double invoke di StrictMode
  const busyRef = useRef(false);
  const togglePlay = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      if (isPlaying) {
        pause();
      } else {
        await play();
      }
    } finally {
      setTimeout(() => (busyRef.current = false), 120);
    }
  }, [isPlaying, play, pause]);

  const setMuted = useCallback((v: boolean) => {
    _setMuted(v);
    const el = audioRef.current;
    if (el) el.muted = v;
  }, []);

  const setVolume = useCallback((v: number) => {
    const nv = Math.min(1, Math.max(0, v));
    _setVolume(nv);
    const el = audioRef.current;
    if (el) el.volume = nv;
  }, []);

  // Daftarkan event untuk state sinkron & recovery
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    let aborted = false;
    let retryCount = 0;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = async () => {
      if (aborted) return;
      console.warn("Audio error, retrying...");
      setPlaying(false);
      // backoff max ~5x
      while (retryCount < 5 && !aborted) {
        retryCount++;
        await wait(500 * retryCount);
        try {
          el.load();
          await el.play();
          setPlaying(true);
          retryCount = 0;
          break;
        } catch {
          // continue retry
        }
      }
    };

    const onWaiting = () => {
      // bisa tampilkan spinner di UI jika diperlukan
    };

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("error", onError);
    el.addEventListener("waiting", onWaiting);

    return () => {
      aborted = true;
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("error", onError);
      el.removeEventListener("waiting", onWaiting);
    };
  }, []);

  const value = useMemo(
    () => ({
      isPlaying,
      isExpanded,
      muted,
      volume,
      play,
      pause,
      togglePlay,
      setExpanded,
      toggleExpand: () => setExpanded((v) => !v),
      setMuted,
      setVolume,
    }),
    [isPlaying, isExpanded, muted, volume, play, pause, togglePlay]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* Audio global — tidak pernah di-unmount antar halaman */}
      <audio
        ref={audioRef}
        preload="none"
        src={STREAM_URL}
        // penting untuk iOS agar tetap hidup saat layar mati
        playsInline
        // agar tidak auto-play tanpa gesture
        // autoPlay tidak dipakai: biarkan user tap
      />
    </PlayerContext.Provider>
  );
};