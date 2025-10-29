"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";

type WaveformProps = {
  /** Tinggi canvas (px) */
  height?: number;
  /** Jumlah bar */
  barCount?: number;
  /** Gap antar bar (px) */
  barGap?: number;
  /** Warna bar (bisa gradient atau solid) */
  barColor?: string;
  /** Shadow/glow effect */
  glowColor?: string;
  /** Styling tambahan untuk container */
  className?: string;
};

export default function AudioWaveform({
  height = 64,
  barCount = 48,
  barGap = 2,
  barColor = "url(#waveGradient)",
  glowColor = "rgba(249, 115, 22, 0.4)",
  className = "",
}: WaveformProps) {
  const { isPlaying } = usePlayer();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Setup Web Audio API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audioElement = document.querySelector("audio");
    if (!audioElement) {
      console.warn("[Waveform] Audio element not found");
      return;
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioElement);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256; // 128 frequency bins
      analyser.smoothingTimeConstant = 0.75;

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const bufferLength = analyser.frequencyBinCount;
      // Ensure we have an ArrayBuffer-backed Uint8Array to match getByteFrequencyData signature
      const dataArray = new Uint8Array(bufferLength) as Uint8Array;

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      setIsReady(true);

      return () => {
        try {
          source.disconnect();
          analyser.disconnect();
          audioContext.close();
        } catch (e) {
          console.warn("[Waveform] Cleanup error:", e);
        }
      };
    } catch (error) {
      console.error("[Waveform] Web Audio API error:", error);
    }
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isReady || !isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      // Clear canvas saat pause
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    if (!canvas || !analyser || !dataArray) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!isPlaying) return;
      animFrameRef.current = requestAnimationFrame(draw);

      // Ensure we pass an ArrayBuffer-backed Uint8Array to satisfy lib.dom typings.
      // If the underlying buffer is not a plain ArrayBuffer (e.g. SharedArrayBuffer),
      // create a new Uint8Array copy which will have an ArrayBuffer backing.
      let freqArray: Uint8Array;
      if (dataArray.buffer instanceof ArrayBuffer) {
        // Reuse a view backed by the ArrayBuffer
        freqArray = new Uint8Array(dataArray.buffer as ArrayBuffer, dataArray.byteOffset, dataArray.byteLength);
      } else {
        // Fallback: create a copy that is backed by a plain ArrayBuffer
        freqArray = new Uint8Array(dataArray);
      }
      // Cast to satisfy the lib.dom typing which expects an ArrayBuffer-backed Uint8Array
      analyser.getByteFrequencyData(freqArray as unknown as Uint8Array<ArrayBuffer>);

      const { width, height: canvasHeight } = canvas;
      ctx.clearRect(0, 0, width, canvasHeight);
      ctx.clearRect(0, 0, width, canvasHeight);

      const barWidth = (width - barGap * (barCount - 1)) / barCount;
      const step = Math.floor(dataArray.length / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] || 0;
        const percent = value / 255;
        const barHeight = percent * canvasHeight * 0.9; // max 90% tinggi

        const x = i * (barWidth + barGap);
        const y = canvasHeight - barHeight;

        // Glow effect
        if (glowColor && percent > 0.1) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = glowColor;
        } else {
          ctx.shadowBlur = 0;
        }

        // Draw bar
        if (barColor.startsWith("url(")) {
          // Gunakan gradient dari SVG (harus didefinisikan di parent)
          const grad = ctx.createLinearGradient(0, canvasHeight, 0, 0);
          grad.addColorStop(0, "rgba(249, 115, 22, 0.8)"); // orange-500
          grad.addColorStop(0.5, "rgba(251, 146, 60, 0.9)"); // orange-400
          grad.addColorStop(1, "rgba(252, 211, 77, 1)"); // yellow-300
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = barColor;
        }

        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isReady, isPlaying, barCount, barGap, barColor, glowColor]);

  // Responsive canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [height]);

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ height: `${height}px` }}
      />
      
      {/* Fallback ketika tidak ada audio atau pause */}
      {(!isReady || !isPlaying) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/20 rounded-full"
                style={{
                  height: `${12 + Math.random() * 20}px`,
                  animation: isPlaying ? "none" : "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Preset: Compact untuk mini player
export function AudioWaveformCompact({ className = "" }: { className?: string }) {
  return (
    <AudioWaveform
      height={32}
      barCount={24}
      barGap={1.5}
      className={className}
    />
  );
}

// Preset: Full untuk expanded player
export function AudioWaveformFull({ className = "" }: { className?: string }) {
  return (
    <AudioWaveform
      height={80}
      barCount={64}
      barGap={2}
      className={className}
    />
  );
}