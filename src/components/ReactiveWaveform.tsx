"use client";

/**
 * REACTIVE WAVEFORM - Procedural Animation
 * Untuk streaming radio tanpa akses direct audio data
 * Menggunakan Framer Motion untuk animasi smooth
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";

/* ===========================
 * VARIAN 1: Smooth Bars (Framer Motion)
 * Animasi yang smooth dan natural
 * =========================== */
export function SmoothWaveform({
  barCount = 32,
  height = 64,
  className = "",
}: {
  barCount?: number;
  height?: number;
  className?: string;
}) {
  const { isPlaying } = usePlayer();
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial random heights
    setBars(Array.from({ length: barCount }, () => Math.random()));
  }, [barCount]);

  useEffect(() => {
    if (!isPlaying) return;

    // Update bars with wave-like pattern
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((_, i) => {
          const wave = Math.sin(Date.now() / 200 + i / 3) * 0.5 + 0.5;
          const noise = Math.random() * 0.3;
          return Math.min(0.95, Math.max(0.2, wave + noise));
        })
      );
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isPlaying && bars.every((b) => b === 0)) {
    return (
      <div
        className={`flex items-end justify-center gap-1 ${className}`}
        style={{ height: `${height}px` }}
      >
        {Array.from({ length: Math.min(12, barCount) }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-white/20 rounded-full"
            style={{ height: `${20 + Math.random() * 30}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-end justify-center gap-1 ${className}`}
      style={{ height: `${height}px` }}
    >
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-orange-500 via-orange-400 to-yellow-300"
          initial={{ scaleY: 0.3 }}
          animate={{
            scaleY: isPlaying ? height : 0.3,
            opacity: isPlaying ? 0.8 + height * 0.2 : 0.4,
          }}
          transition={{
            duration: 0.15,
            ease: "easeOut",
          }}
          style={{
            height: "100%",
            transformOrigin: "bottom",
            boxShadow: isPlaying
              ? `0 0 ${8 * height}px rgba(249, 115, 22, ${0.4 * height})`
              : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ===========================
 * VARIAN 2: Bouncing Dots
 * Titik-titik yang bounce dengan physics
 * =========================== */
export function BouncingDots({
  dotCount = 24,
  height = 60,
  className = "",
}: {
  dotCount?: number;
  height?: number;
  className?: string;
}) {
  const { isPlaying } = usePlayer();

  return (
    <div
      className={`flex items-center justify-center gap-1.5 ${className}`}
      style={{ height: `${height}px` }}
    >
      {Array.from({ length: dotCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: `linear-gradient(135deg, 
              rgba(249, 115, 22, 0.9), 
              rgba(251, 146, 60, 0.8))`,
          }}
          animate={
            isPlaying
              ? {
                  y: [0, -20, 0],
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }
              : {
                  y: 0,
                  scale: 0.8,
                  opacity: 0.3,
                }
          }
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.03,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ===========================
 * VARIAN 3: Ripple Effect
 * Efek ripple yang expand dari center
 * =========================== */
export function RippleWaveform({
  ringCount = 4,
  height = 80,
  className = "",
}: {
  ringCount?: number;
  height?: number;
  className?: string;
}) {
  const { isPlaying } = usePlayer();

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ height: `${height}px` }}
    >
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            borderColor: `rgba(249, 115, 22, ${0.6 - i * 0.15})`,
          }}
          animate={
            isPlaying
              ? {
                  width: [20, height * 1.2],
                  height: [20, height * 1.2],
                  opacity: [0.8, 0],
                }
              : {
                  width: 20,
                  height: 20,
                  opacity: 0.2,
                }
          }
          transition={{
            duration: 2,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Center icon */}
      <motion.div
        className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold"
        animate={{
          scale: isPlaying ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: isPlaying ? Infinity : 0,
        }}
      >
        🎵
      </motion.div>
    </div>
  );
}

/* ===========================
 * VARIAN 4: Pulsing Circle (Breathing Effect)
 * Lingkaran yang "bernafas" smooth
 * =========================== */
export function PulsingCircle({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const { isPlaying } = usePlayer();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-600/10"
          animate={
            isPlaying
              ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }
              : { scale: 1, opacity: 0.2 }
          }
          transition={{
            duration: 1.5,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-500/50 to-orange-600/30"
          animate={
            isPlaying
              ? {
                  scale: [1, 1.15, 1],
                  opacity: [0.6, 0.9, 0.6],
                }
              : { scale: 1, opacity: 0.3 }
          }
          transition={{
            duration: 1.5,
            repeat: isPlaying ? Infinity : 0,
            delay: 0.2,
            ease: "easeInOut",
          }}
        />

        {/* Core */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg"
          animate={
            isPlaying
              ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 4px 20px rgba(249, 115, 22, 0.4)",
                    "0 8px 40px rgba(249, 115, 22, 0.6)",
                    "0 4px 20px rgba(249, 115, 22, 0.4)",
                  ],
                }
              : { scale: 1, boxShadow: "0 2px 10px rgba(249, 115, 22, 0.2)" }
          }
          transition={{
            duration: 1.5,
            repeat: isPlaying ? Infinity : 0,
            delay: 0.4,
            ease: "easeInOut",
          }}
        >
          <span className="text-lg">📻</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ===========================
 * VARIAN 5: Wave Lines (Flowing)
 * Garis-garis yang mengalir seperti air
 * =========================== */
export function FlowingWaves({
  lineCount = 3,
  height = 60,
  className = "",
}: {
  lineCount?: number;
  height?: number;
  className?: string;
}) {
  const { isPlaying } = usePlayer();

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(249, 115, 22, 0.8)" />
            <stop offset="50%" stopColor="rgba(251, 146, 60, 0.9)" />
            <stop offset="100%" stopColor="rgba(252, 211, 77, 1)" />
          </linearGradient>
        </defs>

        {Array.from({ length: lineCount }).map((_, i) => (
          <motion.path
            key={i}
            d={`M 0,${height / 2} Q 100,${height / 4} 200,${height / 2} T 400,${height / 2}`}
            stroke="url(#waveGradient)"
            strokeWidth={3 - i * 0.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.7 - i * 0.2}
            animate={
              isPlaying
                ? {
                    d: [
                      `M 0,${height / 2} Q 100,${height / 4} 200,${height / 2} T 400,${height / 2}`,
                      `M 0,${height / 2} Q 100,${(height * 3) / 4} 200,${height / 2} T 400,${height / 2}`,
                      `M 0,${height / 2} Q 100,${height / 4} 200,${height / 2} T 400,${height / 2}`,
                    ],
                    x: [0, -50, 0],
                  }
                : {}
            }
            transition={{
              duration: 2 + i * 0.5,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ===========================
 * VARIAN 6: Spectrum Analyzer (Reactive)
 * Mirip equalizer tapi lebih modern
 * =========================== */
export function SpectrumAnalyzer({
  barCount = 20,
  height = 70,
  className = "",
}: {
  barCount?: number;
  height?: number;
  className?: string;
}) {
  const { isPlaying } = usePlayer();
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    setBars(
      Array.from({ length: barCount }, (_, i) => {
        // Create frequency curve (more activity in middle)
        const position = i / (barCount - 1);
        const curve = Math.sin(position * Math.PI);
        return curve * 0.5 + 0.3;
      })
    );
  }, [barCount]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((base, i) => {
          const time = Date.now() / 100;
          const wave = Math.sin(time + i * 0.3) * 0.3;
          const random = Math.random() * 0.2;
          return Math.min(0.95, Math.max(0.15, base + wave + random));
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      className={`flex items-end justify-center gap-1 ${className}`}
      style={{ height: `${height}px` }}
    >
      {bars.map((value, i) => {
        const hue = 20 + i * 5; // Orange to yellow gradient
        return (
          <motion.div
            key={i}
            className="rounded-t-sm"
            style={{
              width: `${100 / barCount}%`,
              background: `linear-gradient(to top, 
                hsl(${hue}, 95%, 50%), 
                hsl(${hue + 20}, 95%, 60%))`,
              boxShadow: isPlaying
                ? `0 0 ${10 * value}px hsla(${hue}, 95%, 50%, ${0.6 * value})`
                : "none",
            }}
            animate={{
              height: isPlaying ? `${value * 100}%` : "20%",
              opacity: isPlaying ? 0.85 + value * 0.15 : 0.3,
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}