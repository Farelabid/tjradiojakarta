"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live" },
  { href: "/news", label: "News" },
  { href: "/video", label: "Video" },
  { href: "/event", label: "Event" },
  { href: "/opini", label: "Opini" },
];

interface NavPillProps extends NavItem {
  onClick?: () => void;
}

/** Pill nav bergaya TJ (aksen oranye, glass navy), aktif = ada underline gradien oranye */
function NavPill({ href, label, onClick }: NavPillProps) {
  const pathname = usePathname();
  const active = useMemo(
    () => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [href, pathname]
  );

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[
        "relative inline-flex items-center justify-center",
        "px-4 py-2.5 text-sm font-medium tracking-wide rounded-2xl",
        "transition-all duration-200 select-none outline-none",
        // A11y focus ring (tetap di semua breakpoint)
        "focus-visible:ring-2 focus-visible:ring-white/40",

        active
          ? [
              // Aktif: glass sedikit lebih terang + underline oranye
              "text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
              // Outline putih HANYA di mobile/tablet
              "ring-1 ring-white/20 lg:ring-0",
              "after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2",
              "after:h-0.5 after:w-8 after:rounded-full after:bg-gradient-to-r after:from-orange-400 after:to-orange-500",
            ].join(" ")
          : [
              // Inaktif: HANYA mobile/tablet ada outline halus; desktop tanpa outline
              "text-white/85 hover:text-white hover:bg-white/10",
              "ring-1 ring-white/10 hover:ring-white/15 lg:ring-0 lg:hover:ring-0",
            ].join(" "),
      ].join(" ")}
    >
      {label}
    </Link>
  );
}



function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full",
        "bg-red-600/90 text-white shadow-sm",
        className,
      ].join(" ")}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>
      <span className="font-medium">LIVE</span>
    </span>
  );
}

export default function Header() {
  const playerContext = usePlayer();
  const isPlaying = playerContext?.isPlaying ?? false;

  const [isOpen, setIsOpen] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => menuBtnRef.current?.focus(), 100);
  }, []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  // Auto-close saat pilih link (bisa diganti ke stay-open kalau mau)
  const handleNavClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  // Focus mgmt
  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && isOpen && closeMenu();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeMenu]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      {/* Header: gradient navy khas TJ + blur */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-[#0b1b3a]/90 via-[#0d264a]/70 to-[#0b1b3a]/90 backdrop-blur-md supports-[backdrop-filter]:bg-primary-950/60">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between pt-[env(safe-area-inset-top)]">
          {/* LEFT: logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 select-none hover:opacity-90 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-lg px-1 py-1"
          >
            {!isImageError ? (
              <Image
                src="/newlogo.png"
                alt="TJRadio Jakarta"
                width={320}
                height={160}
                className="h-8 w-auto md:h-9"
                priority
                onError={() => setIsImageError(true)}
              />
            ) : (
              <div className="h-8 w-16 md:h-9 md:w-[4.5rem] bg-white/10 rounded flex items-center justify-center text-xs font-bold text-white/70">
                TJ
              </div>
            )}
            <span className="hidden md:inline font-semibold tracking-wide text-white/95">
              TJRadio Jakarta
            </span>
          </Link>

          {/* DESKTOP NAV (lg+) */}
          <nav
            className="hidden lg:flex items-center gap-2"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV.map((item) => (
              <NavPill key={item.href} {...item} />
            ))}
          </nav>

          {/* RIGHT: live badge + hamburger */}
          <div className="flex items-center gap-3">
            {isPlaying && <LiveBadge className="hidden md:inline-flex" />}

            <button
              ref={menuBtnRef}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 ring-1 ring-white/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={toggleMenu}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-white/90" />
              ) : (
                <Menu className="w-5 h-5 text-white/90" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ==== MOBILE/TABLET SHEET ==== */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } bg-black/55 backdrop-blur-[2px]`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        id="mobile-menu"
        className={[
          "fixed z-[70] lg:hidden left-3 right-3",
          "top-[calc(env(safe-area-inset-top)+60px)]",
          "transition-all duration-300 ease-out",
          isOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-8 opacity-0 scale-95 pointer-events-none",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div
          className={[
            "relative rounded-3xl overflow-hidden",
            // glass gradient navy khas TJ + ring
            "supports-[backdrop-filter]:backdrop-blur-xl",
            "bg-[linear-gradient(180deg,rgba(13,38,74,0.86),rgba(9,25,52,0.78))]",
            "ring-1 ring-white/12 shadow-2xl shadow-black/30",
            // top accent strip oranye (signature TJ)
            "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-orange-400 before:via-orange-300 before:to-orange-500",
          ].join(" ")}
        >
          {/* Header drawer */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              {isPlaying ? (
                <LiveBadge className="text-[11px] px-2 py-1" />
              ) : (
              <h2
                id="mobile-menu-title"
                className="text-white/95 text-lg md:text-xl font-semibold tracking-wide"
              >
                TJRadio Jakarta
              </h2>

              )}
            </div>
            <button
              ref={closeBtnRef}
              onClick={closeMenu}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 hover:bg-white/12 active:bg-white/16 ring-1 ring-white/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white/90" />
            </button>
          </div>

          {/* Handle */}
          <div className="px-4 -mt-2">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-white/18" />
          </div>

          {/* Nav pills */}
          <div className="p-4 pt-3">
            <div className="rounded-3xl bg-white/4 p-2">
              <div className="flex flex-wrap gap-2">
                {NAV.map((item) => (
                  <NavPill key={item.href} {...item} onClick={handleNavClick} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Safe-area bottom */}
        <div className="h-[max(env(safe-area-inset-bottom),1rem)]" />
      </div>
    </>
  );
}
