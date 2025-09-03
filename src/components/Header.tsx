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
        <Link href="/" className="flex items-center gap-2 select-none">
          {/* Tinggi fix, lebar auto → rasio asli terjaga */}
          <Image
            src="/newlogo.png"
            alt="TJRadio Jakarta"
            width={320}            // nilai apa saja; akan ditimpa oleh class h-8 w-auto
            height={160}           // isi mendekati rasio file aslimu kalau tahu
            className="h-8 w-auto md:h-9"
            sizes="(max-width: 640px) 32px, 36px"
            priority
          />
          <span className="hidden sm:inline font-semibold tracking-wide">
            TJRadio Jakarta
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink href="/" label="Home" />
          <NavLink href="/live" label="Live" />
          <NavLink href="/news" label="News" />
          <NavLink href="/video" label="Video" />
        </nav>
        <div className="flex items-center gap-2">
          {isPlaying && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-600/90">
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