"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
        active
          ? "bg-primary-400/20 text-white"
          : "hover:bg-primary-400/10 text-white/80"
      }`}
    >
      {label}
    </Link>
  );
};

export default function Header() {
  const { isPlaying } = usePlayer();

  return (
    <header className="sticky top-0 z-50 bg-primary-950/60 backdrop-blur-lg border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* ===== KIRI: Mobile → logo ATAU LIVE; Desktop → logo selalu ===== */}
        <div className="flex items-center gap-2 select-none">
          {/* MOBILE: jika LIVE, ganti logo jadi pill LIVE */}
          {isPlaying ? (
            <Link
              href="/live"
              className="md:hidden inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-600/90 text-white"
              aria-label="Buka siaran langsung"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              LIVE
            </Link>
          ) : (
            <Link href="/" className="md:hidden flex items-center gap-2">
              {/* Tinggi fix, lebar auto → rasio asli terjaga (anti gepeng) */}
              <Image
                src="/newlogo.png"
                alt="TJRadio Jakarta"
                width={320}
                height={160}
                className="h-8 w-auto"
                sizes="(max-width: 640px) 32px, 36px"
                priority
              />
              <span className="hidden sm:inline font-semibold tracking-wide">
                TJRadio Jakarta
              </span>
            </Link>
          )}

          {/* DESKTOP: selalu tampil logo */}
          <Link href="/" className="hidden md:flex items-center gap-2">
            <Image
              src="/newlogo.png"
              alt="TJRadio Jakarta"
              width={320}
              height={160}
              className="h-9 w-auto"
              sizes="36px"
              priority
            />
            <span className="font-semibold tracking-wide">TJRadio Jakarta</span>
          </Link>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink href="/" label="Home" />
          <NavLink href="/live" label="Live" />
          <NavLink href="/news" label="News" />
          <NavLink href="/video" label="Video" />
          <NavLink href="/opini" label="Opini" />
        </nav>

        {/* KANAN: badge LIVE hanya desktop agar tidak dobel di mobile */}
        <div className="flex items-center gap-2">
          {isPlaying && (
            <span className="hidden md:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-600/90 text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              LIVE
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
