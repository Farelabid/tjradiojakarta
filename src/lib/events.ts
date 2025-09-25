// src/lib/events.ts
// ======================================================================
// TJRadio Jakarta — EVENT LIB (lean, server-first)
// ----------------------------------------------------------------------
// Apa isi file ini:
// 1) Tipe data Event (versi ringkas sesuai UI simple)
// 2) Data event (EDIT di array EVENTS_RAW)
// 3) Helper: status (upcoming/ongoing/past), format tanggal, getAll, bySlug, JSON-LD
//
// ⚙️ Cara tambah event (singkat):
// 1) Taruh aset ke: /public/events/  → contoh: poster.jpg, teaser.mp4
// 2) Tambahkan objek ke EVENTS_RAW di bawah. Cukup tulis *nama file* (bukan path):
//      coverImage: "poster.jpg", images: ["foto-1.jpg"], videoUrls: ["teaser.mp4"]
//    Library ini otomatis mengubah ke path publik: /events/<nama-file>.
//    Kalau kamu tulis path absolut (/… atau https://…), nilainya dipakai apa adanya.
// 3) Portrait video? tambahkan:
//      mediaAspect: "9/16", mediaFit: "contain"
//    (Grid kartu tetap rapi dengan coverImage landscape.)
// ======================================================================

import type { Metadata } from "next";

// ===== TIPE DATA (sesuai yang dipakai di UI) ===========================
export type EventStatus = "upcoming" | "ongoing" | "past";
export type EventCategory =
  | "music" | "competition" | "workshop" | "festival" | "community"
  | "sports" | "tech" | "art" | "food" | "other";

export type EventItem = {
  // Dasar
  slug: string;               // unik, lowercase-dash (contoh: "jakarta-food-festival-2025")
  title: string;
  subtitle?: string;
  category: EventCategory;

  // Waktu → pilih salah satu: startDate (ISO, disarankan) atau date (YYYY-MM-DD)
  date?: string;              // single-day (YYYY-MM-DD)
  startDate?: string;         // "2025-12-19T08:00:00+07:00"
  endDate?: string;           // ISO (opsional)

  // Lokasi
  location?: string;

  // Media (opsional) — boleh kosong
  coverImage?: string;        // "poster.jpg" → otomatis /events/poster.jpg
  images?: string[];          // ["foto-1.jpg", ...]
  youtubeIds?: string[];      // ["YOUTUBE_ID"] (opsional, tidak wajib)
  videoUrls?: string[];       // ["teaser.mp4"] (opsional)

  // Kontrol media untuk halaman detail (opsional)
  mediaAspect?: "16/9" | "9/16" | "1/1" | "4/5"; // default "16/9"
  mediaFit?: "cover" | "contain";                // default "cover"

  // Konten
  shortDescription?: string;  // ringkas untuk kartu
  description?: string;       // panjang untuk detail

  // Info tambahan (opsional)
  statusNote?: string;        // catatan singkat (kalau perlu)

  // CTA (opsional)
  registrationUrl?: string;
  ticketUrl?: string;
  ctaLabel?: string;          // default "Info & Daftar"
};

// Label kategori (untuk badge/teks jika dibutuhkan)
export const CATEGORY_LABEL: Record<EventCategory, string> = {
  music: "Musik",
  competition: "Kompetisi",
  workshop: "Workshop",
  festival: "Festival",
  community: "Komunitas",
  sports: "Olahraga",
  tech: "Teknologi",
  art: "Seni",
  food: "Kuliner",
  other: "Lainnya",
};

// Placeholder global (jika ingin dipakai di kartu/detail saat tidak ada media)
export const EVENT_PLACEHOLDER = "/images/placeholder-event.jpg";

// ===== DATA EVENT (EDIT DI SINI) =======================================
// Template cepat (copy → paste → ubah):
/*
{
  slug: "nama-event-dengan-dash",
  title: "Judul Event",
  subtitle: "Subjudul (opsional)",
  category: "music",
  // pilih salah satu:
  startDate: "2025-12-19T08:00:00+07:00",  // atau
  // date: "2025-12-19",
  endDate: "2025-12-21T22:00:00+07:00",
  location: "Nama Venue / Area",
  // Media (opsional) — tulis *nama file* saja
  coverImage: "poster.jpg",
  images: ["foto-1.jpg", "foto-2.jpg"],
  youtubeIds: ["YOUTUBE_ID"],        // opsional
  videoUrls: ["teaser.mp4"],         // opsional (bisa tanpa YouTube)
  // Video portrait?:
  mediaAspect: "9/16",
  mediaFit: "contain",
  // Konten
  shortDescription: "Deskripsi singkat untuk kartu.",
  description: "Deskripsi panjang untuk detail...",
  statusNote: "Catatan opsional",
  // CTA (opsional)
  registrationUrl: "https://link-daftar.com",
  ticketUrl: "https://link-tiket.com",
  ctaLabel: "Info & Daftar"
}
*/

const EVENTS_RAW: EventItem[] = [
  {
    slug: "jakarta-drum-corps-international-2025",
    title: "2025 Jakarta Drum Corps International",
    subtitle: "Menampilkan Drum Corps, Soundsport, Drumline Battle, Street Parade, dan Flag Ensemble",
    category: "music",
    startDate: "2025-12-19T09:00:00+07:00",
    endDate: "2025-12-21T22:00:00+07:00",
    location: "Jakarta International Velodrome",
    coverImage: "jakartadrum.jpg",
    images: ["jakartadrum.jpg"],
    videoUrls: ["jakartadrum.mp4"],
    mediaAspect: "9/16",
    shortDescription: "Kompetisi drum corps internasional dengan berbagai divisi dan kategori pendukung.",
    description:
      "Jangan lewatkan! Jakarta Drum Corps International akan diselenggarakan pada 19-21 Desember 2025 di Jakarta International Velodrome. Kompetisi ini terbagi dalam beberapa divisi utama: Drum Corps (World Class, Open Class, Student Class). Selain itu, akan ada juga kompetisi Soundsport, Drumline Battle, Street Parade, dan Flag Ensemble untuk Challenge Class, Senior Class, dan Elementary Class. Untuk informasi lebih lanjut, hubungi +62-8111-770-771 atau +62-8777-173-0005.",
  },
  {
    slug: "grand-opening-tjradio-2025",
    title: "Soft Launching TJ Radio Jakarta",
    subtitle: "Teman Perjalanan Jakarta Resmi Hadir",
    category: "community",
    startDate: "2025-09-11T10:00:00+07:00",
    endDate: "2025-09-11T15:00:00+07:00",
    location: "Tavia Plaza Cempaka Putih, Jakarta",
    coverImage: "peresmian.JPG",
    images: ["peresmian2.JPEG", "peresmian3.JPG"],
    shortDescription: "Peluncuran resmi TJ Radio Jakarta.",
    description:
      "TJ Radio Jakarta, Teman Perjalanan Jakarta, telah resmi diluncurkan pada 11 September 2025. Acara ini menandai awal dari perjalanan kami untuk memberikan informasi, hiburan, dan layanan terbaik bagi para pendengar di Jakarta. TJ Radio Jakarta diresmikan secara langsung oleh Gubernur Jakarta di Balaikota, dan diramaikan oleh Wakil Gubernur Jakarta yang ikut serta melakukan siaran langsung dari studio.",
  },
];

// ===== NORMALISASI ASSET (nama file → /events/<nama-file>) ==============
const toPublicEventsPath = (name: string) => `/events/${name.replace(/^\/+/, "")}`;
const isAbsoluteOrUrl = (p: string) => p.startsWith("/") || /^https?:\/\//i.test(p);
const resolveAssetPath = (p?: string): string | undefined =>
  !p ? undefined : isAbsoluteOrUrl(p) ? p : toPublicEventsPath(p);

function normalizeEvent(ev: EventItem): EventItem {
  return {
    ...ev,
    coverImage: resolveAssetPath(ev.coverImage) ?? undefined,
    images: ev.images?.map(x => resolveAssetPath(x)!).filter(Boolean),
    videoUrls: ev.videoUrls?.map(x => resolveAssetPath(x)!).filter(Boolean),
  };
}

// ===== HELPER DASAR ====================================================
const parseDate = (s?: string): Date | null => {
  if (!s) return null;
  const simple = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD → fallback WIB 00:00
  return new Date(simple.test(s) ? `${s}T00:00:00+07:00` : s);
};

const getStart = (ev: EventItem) => parseDate(ev.startDate) ?? parseDate(ev.date) ?? new Date();
const getEnd = (ev: EventItem) => parseDate(ev.endDate);

/** Status event relatif waktu sekarang. */
export function getStatus(ev: EventItem, now: Date = new Date()): EventStatus {
  const s = getStart(ev);
  const e = getEnd(ev);
  const t = now.getTime();

  if (e) {
    const eod = new Date(e); eod.setHours(23, 59, 59, 999);
    if (t < s.getTime()) return "upcoming";
    if (t > eod.getTime()) return "past";
    return "ongoing";
  }
  const eod = new Date(s); eod.setHours(23, 59, 59, 999);
  if (t < s.getTime()) return "upcoming";
  if (t > eod.getTime()) return "past";
  return "ongoing";
}

/** "19 Desember 2025 – 21 Desember 2025" atau "19 Desember 2025". */
export function formatDateRange(ev: EventItem): string {
  const s = getStart(ev); const e = getEnd(ev);
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
  const fmt = (d: Date) => new Intl.DateTimeFormat("id-ID", opts).format(d);
  if (!e) return fmt(s);
  const same = s.toDateString() === e.toDateString();
  return same ? fmt(s) : `${fmt(s)} – ${fmt(e)}`;
}

/** Sort ringan: upcoming → ongoing → past, lalu urut naik berdasarkan startDate. */
export function getAll(): EventItem[] {
  const arr = EVENTS_RAW.map(normalizeEvent);
  arr.sort((a, b) => {
    const rank = (ev: EventItem) =>
      getStatus(ev) === "upcoming" ? 0 : getStatus(ev) === "ongoing" ? 50 : 100;
    const ra = rank(a), rb = rank(b);
    if (ra !== rb) return ra - rb;
    return getStart(a).getTime() - getStart(b).getTime();
  });
  return arr;
}

/** Cari event by slug (atau null bila tidak ada). */
export const bySlug = (slug: string) => getAll().find(e => e.slug === slug) || null;

/** JSON-LD schema.org/Event untuk SEO. */
export function jsonLd(ev: EventItem) {
  const images = [ev.coverImage, ...(ev.images || [])].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    startDate: ev.startDate ?? ev.date,
    endDate: ev.endDate,
    location: ev.location ? { "@type": "Place", name: ev.location } : undefined,
    image: images.length ? images : undefined,
    description: ev.shortDescription || ev.description?.slice(0, 150),
    url: ev.registrationUrl || ev.ticketUrl,
  };
}

// Metadata list page (opsional)
export const EventList_metadata: Metadata = {
  title: "Event - TJ Radio Jakarta",
  description: "Papan pengumuman acara mendatang di Jakarta.",
};
