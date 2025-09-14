// src/lib/schedule.ts
// =====================================================
// Jadwal & util real-time WIB untuk TJRadio Jakarta
// =====================================================

export type Seg = {
  start: string;        // "HH:MM" 24 jam
  end: string;          // "HH:MM"
  show: string;
  host?: string;
  desc?: string;
  image?: string;       // cover gambar (opsional – akan diisi otomatis)
  live?: boolean;       // true = siaran berpenyiar, false = blok lagu
};

export const TZ = "Asia/Jakarta";

/** Pad 2 digit */
export const PAD = (n: number) => n.toString().padStart(2, "0");

/** "HH:MM" -> menit sejak 00:00 (0..1439). Tahan "HH.MM" juga. */
export const toMin = (hhmm: string) => {
  const clean = hhmm.replace(".", ":");
  const [hhRaw, mmRaw] = clean.split(":");
  const hh = Number.parseInt(hhRaw || "0", 10);
  const mm = Number.parseInt(mmRaw || "0", 10);
  const H = ((Number.isFinite(hh) ? hh : 0) % 24 + 24) % 24;
  const M = ((Number.isFinite(mm) ? mm : 0) % 60 + 60) % 60;
  return H * 60 + M;
};

export const fmtRange = (a: string, b: string) => `${a}–${b} WIB`;

/** Waktu WIB saat ini (stabil lintas browser) */
export function nowJakarta() {
  const d = new Date();

  const isoDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d); // YYYY-MM-DD

  const timeStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).format(d); // "HH:MM" atau kadang "HH.MM"

  const minutes = toMin(timeStr);

  const fullDateLabel = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);

  return { isoDate, minutes, fullDateLabel };
}

/** Soft-launch day check (dipakai header /live) */
export function isSoftLaunchDay(isoDate: string) {
  const startEnv = process.env.SOFT_OPENING_START; // "2025-09-11T09:45:00+07:00"
  if (!startEnv) return false;
  const startDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(startEnv));
  return isoDate === startDateStr;
}

/* =========================================================
   COVER OTOMATIS BERDASARKAN NAMA ACARA
   - Satu sumber mapping supaya tidak ada duplikasi function.
   - Aturan slug: huruf kecil, non-alfanumerik → '-', trim '-'.
   ========================================================= */
function slugifyTitle(t: string) {
  return (t || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export function imageForShowTitle(title?: string) {
  if (!title) return "";
  const slug = slugifyTitle(title);
  return `/shows/${slug}.jpg`;
}

function withCovers(list: Seg[]): Seg[] {
  return list.map((s) => ({ ...s, image: s.image ?? imageForShowTitle(s.show) }));
}

/* =========================================================
   JADWAL PER HARI (Mon..Sun)
   - Nama acara konsisten agar gambar by-title tetap bekerja.
   - Selalu menutup penuh 00:00–24:00.
   ========================================================= */

/** SENIN — sesuai instruksi terbaru */
function buildMonday(): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Musik Malam TJ", desc: "Nonstop hits malam", live: false },

    { start: "06:00", end: "10:00", show: "TJ Radio Pagi", host: "Indy & Irwan", live: true },
    { start: "10:00", end: "13:00", show: "TJ Radio Lagu", desc: "Lagu", live: false },
    { start: "13:00", end: "16:00", show: "TJ Radio Siang", host: "Yaser & Nayla", live: true },
    { start: "16:00", end: "20:00", show: "TJ Radio Sore", host: "Reno & MC Dany", live: true },
    { start: "20:00", end: "22:00", show: "THE LIMPA", host: "THE LIMPA", live: true },

    { start: "22:00", end: "24:00", show: "Musik Malam TJ", desc: "Nonstop hits malam", live: false },
  ];
}

/** Default weekday pattern (Selasa–Jumat) — mengikuti yang sekarang */
function buildWeekdayDefault(): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Musik Malam TJ", desc: "Nonstop hits malam", live: false },

    { start: "06:00", end: "10:00", show: "TJ Radio Pagi", host: "Indy & Irwan", live: true },
    { start: "10:00", end: "12:00", show: "TJ Radio Siang", host: "Hatma, Abi & Pak Yaser", live: true },
    { start: "12:00", end: "15:00", show: "TJ Radio Siang", host: "OT Syech & Nayla", live: true },
    { start: "15:00", end: "17:00", show: "TJ Radio Sore", host: "Risan & Patricia", live: true },
    { start: "17:00", end: "20:00", show: "TJ Radio Sore", host: "MC Danny & Reno", live: true },
    { start: "20:00", end: "22:00", show: "THE LIMPA", host: "THE LIMPA", live: true },

    { start: "22:00", end: "24:00", show: "Musik Malam TJ", desc: "Nonstop hits malam", live: false },
  ];
}

/** Sabtu */
function buildSaturday(): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Musik Malam TJ", desc: "Nonstop hits malam", live: false },

    { start: "06:00", end: "10:00", show: "TJ Radio Pagi", host: "Mpok Odah & Abi Saan", live: true },
    { start: "10:00", end: "12:00", show: "TJ Radio Lagu", desc: "Lagu pilihan akhir pekan", live: false },
    { start: "12:00", end: "15:00", show: "TJ Radio Siang", host: "Risan & Opet", live: true },
    { start: "15:00", end: "17:00", show: "TJ Radio Sore", desc: "Blok Lagu", live: false },
    { start: "17:00", end: "20:00", show: "TJ Radio Sore", host: "Hatma & OT Syech", live: true },

    { start: "20:00", end: "24:00", show: "TJ Radio Malam", desc: "Blok Lagu", live: false },
  ];
}

/** Minggu */
function buildSunday(): Seg[] {
  return buildSaturday(); // sama sementara
}

/** Map hari -> jadwal */
function getDayKey(isoDate: string): "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" {
  const jsDate = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(jsDate) as any;
}

/** Ambil jadwal untuk tanggal (WIB) tertentu */
export function getSchedule(isoDate: string): Seg[] {
  const day = getDayKey(isoDate);
  let base: Seg[];
  switch (day) {
    case "Mon": base = buildMonday(); break;
    case "Tue": base = buildWeekdayDefault(); break;
    case "Wed": base = buildWeekdayDefault(); break;
    case "Thu": base = buildWeekdayDefault(); break;
    case "Fri": base = buildWeekdayDefault(); break;
    case "Sat": base = buildSaturday(); break;
    case "Sun": base = buildSunday(); break;
    default:     base = buildWeekdayDefault(); break;
  }
  return withCovers(base);
}

/**
 * Cari segmen yang sedang berjalan pada menit ke-`minutes` (0..1439)
 * Aman untuk segmen lintas tengah malam (mis. 21:00–02:00).
 */
export function findCurrent(
  _isoDate: string,
  minutes: number,
  schedule: Seg[]
): { idx: number; current: Seg | null } {
  let found = -1;

  for (let i = 0; i < schedule.length; i++) {
    const s = toMin(schedule[i].start);
    const e = toMin(schedule[i].end);

    const spansMidnight = e <= s;
    const inRange = spansMidnight
      ? minutes >= s || minutes < e
      : minutes >= s && minutes < e;

    if (inRange) {
      found = i;
      break;
    }
  }

  return { idx: found, current: found >= 0 ? schedule[found] : null };
}
