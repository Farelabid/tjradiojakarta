// src/lib/schedule.ts
// ======================================================
// TJRadio Jakarta – Jadwal Rutin (pasca Soft Launch)
// Catatan: Tidak ada lagi jadwal khusus Soft Launching.
// Fungsi helper `isSoftLaunchDay` tetap dipertahankan karena
// masih mungkin dipakai UI (mis. untuk banner/pin),
// namun tidak lagi mengubah jadwal siaran.
// ======================================================

export const TZ = "Asia/Jakarta";

export type Seg = {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  show: string;  // nama acara/slot
  host?: string; // nama penyiar (opsional)
  live?: boolean; // true jika mic-on/siaran langsung
  image?: string; // URL gambar (opsional)
  desc?: string;  // deskripsi singkat (opsional)
};

// ---------- Util dasar ----------
export const PAD = (n: number) => n.toString().padStart(2, "0");

export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h % 24) * 60 + (m % 60);
};

export const fmtRange = (a: string, b: string) => `${a}–${b} WIB`;

export function nowJakarta() {
  const d = new Date();
  const isoDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d); // YYYY-MM-DD

  const hhmmLocal = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);

  const minutes = toMin(hhmmLocal);

  const fullDateLabel = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);

  return { isoDate, minutes, fullDateLabel };
}

// ---------- Soft Launch helper (dipertahankan untuk kompatibilitas UI) ----------
/**
 * Mengembalikan true jika hari ini berada dalam window Soft Opening.
 * Fungsi ini TIDAK dipakai untuk mengubah jadwal lagi, hanya untuk UI.
 * Variabel env (opsional):
 * - SOFT_OPENING_START: ISO string, mis. "2025-09-11T09:45:00+07:00"
 * - SOFT_OPENING_WINDOW_MS: durasi window dalam ms (default 2 jam)
 * - SOFT_OPENING_TEST_MODE: "1" untuk mengaktifkan mode test
 * - SOFT_OPENING_TEST_START: ISO string start test
 * - SOFT_OPENING_TEST_WINDOW_MS: durasi window test ms
 */
export function isSoftLaunchDay(isoDate?: string): boolean {
  try {
    const envStart = process.env.SOFT_OPENING_START;
    const envWindow = Number(process.env.SOFT_OPENING_WINDOW_MS || 7_200_000); // 2 jam default

    const testOn = process.env.SOFT_OPENING_TEST_MODE === "1";
    const testStart = process.env.SOFT_OPENING_TEST_START;
    const testWindow = Number(process.env.SOFT_OPENING_TEST_WINDOW_MS || 3_600_000); // 1 jam default

    if (!envStart && !(testOn && testStart)) return false;

    const baseDate = isoDate
      ? new Date(`${isoDate}T12:00:00+07:00`)
      : new Date();

    if (envStart) {
      const start = new Date(envStart);
      const end = new Date(start.getTime() + envWindow);
      if (baseDate >= start && baseDate <= end) return true;
    }
    if (testOn && testStart) {
      const s = new Date(testStart);
      const e = new Date(s.getTime() + testWindow);
      if (baseDate >= s && baseDate <= e) return true;
    }
  } catch {
    // abaikan error parsing
  }
  return false;
}

// ---------- Jadwal Harian Rutin ----------
/**
 * Penamaan program:
 * - Slot umum pagi/siang/sore menggunakan nama: "TJ Radio Pagi/Siang/Sore".
 * - Blok musik umum: "Musik Malam TJ" (00:00–06:00 & 22:00–24:00).
 * - Slot khusus tabel: "THE LIMPA" dan "TJ Radio Lagu" (untuk blok LAGU 10–12 akhir pekan).
 * - `live` diset true untuk slot mic-on; blok musik/lagu dibiarkan undefined/false.
 *
 * Tabel (SENIN–JUMAT) sesuai gambar terbaru:
 * 06:00–10:00  Indy & Irwan
 * 10:00–13:00  (Mon–Wed) Yaser, Abi & Hatma | (Thu) Mo sidik & ... | (Fri) eko kuntadhi
 * 13:00–16:00  (Mon–Wed) Patricia & Risan    | (Thu–Fri) OT & NAYLA
 * 16:00–20:00  Reno & Mc Dany
 * 20:00–22:00  THE LIMPA
 *
 * SABTU:
 * 06:00–10:00  Abi & Mpok odah
 * 10:00–12:00  LAGU (TJ Radio Lagu)
 * 12:00–15:00  Risan & Patricia
 * 15:00–20:00  Hatma & OT Syech
 * 20:00–22:00  THE LIMPA
 *
 * MINGGU:
 * 06:00–10:00  Rio & Mpok odah
 * 10:00–12:00  LAGU (TJ Radio Lagu)
 * 12:00–15:00  OT & NAYLA
 * 15:00–20:00  (tidak disebut di tabel) → gunakan "TJ Radio Sore" tanpa host
 * 20:00–22:00  THE LIMPA
 */
export function getSchedule(isoDate: string): Seg[] {
  const jsDate = new Date(`${isoDate}T00:00:00+07:00`);
  const dayStr = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
  }).format(jsDate); // Mon..Sun

  // Kepala & ekor agar 24 jam penuh
  const head: Seg[] = [{ start: "00:00", end: "06:00", show: "Musik Malam TJ" }];
  const tail: Seg[] = [{ start: "22:00", end: "24:00", show: "Musik Malam TJ" }];

  const buildWeekday = (opts: { mid10_13: string; mid13_16: string }): Seg[] => [
    { start: "06:00", end: "10:00", show: "TJ Radio Pagi", host: "Indy & Irwan", live: true },
    { start: "10:00", end: "13:00", show: "TJ Radio Siang", host: opts.mid10_13, live: true },
    { start: "13:00", end: "16:00", show: "TJ Radio Siang", host: opts.mid13_16, live: true },
    { start: "16:00", end: "20:00", show: "TJ Radio Sore", host: "Reno & Mc Dany", live: true },
    { start: "20:00", end: "22:00", show: "THE LIMPA", host: "THE LIMPA", live: true },
  ];

  let core: Seg[] = [];

  switch (dayStr) {
    case "Mon":
    case "Tue":
    case "Wed":
      core = buildWeekday({
        mid10_13: "Yaser, Abi & Hatma",
        mid13_16: "Patricia & Risan",
      });
      break;
    case "Thu":
      core = buildWeekday({
        mid10_13: "Mo sidik & ...",
        mid13_16: "OT & NAYLA",
      });
      break;
    case "Fri":
      core = buildWeekday({
        mid10_13: "eko kuntadhi",
        mid13_16: "OT & NAYLA",
      });
      break;
    case "Sat":
      core = [
        { start: "06:00", end: "10:00", show: "TJ Radio Pagi", host: "Abi & Mpok Odah", live: true },
        { start: "10:00", end: "12:00", show: "TJ Radio Lagu" },
        { start: "12:00", end: "15:00", show: "TJ Radio Siang", host: "Risan & Patricia", live: true },
        { start: "15:00", end: "20:00", show: "TJ Radio Sore", host: "Hatma & OT Syech", live: true },
        { start: "20:00", end: "22:00", show: "THE LIMPA", host: "THE LIMPA", live: true },
      ];
      break;
    case "Sun":
      core = [
        { start: "06:00", end: "10:00", show: "TJ Radio Pagi", host: "Rio & Mpok odah", live: true },
        { start: "10:00", end: "12:00", show: "TJ Radio Lagu" },
        { start: "12:00", end: "15:00", show: "TJ Radio Siang", host: "OT & NAYLA", live: true },
        { start: "15:00", end: "20:00", show: "TJ Radio Sore" }, // generic tanpa host
        { start: "20:00", end: "22:00", show: "THE LIMPA", host: "THE LIMPA", live: true },
      ];
      break;
  }

  return [...head, ...core, ...tail];
}

// ---------- Cari segmen berjalan ----------
export function findCurrent(
  isoDate: string,
  minutesNow: number,
  schedule: Seg[]
) {
  if (!schedule || schedule.length === 0)
    return { idx: -1 as const, current: undefined as Seg | undefined };

  const mins = schedule.map((s) => ({ s: toMin(s.start), e: toMin(s.end) }));

  // dukung rentang yang melewati tengah malam (jika ada)
  const idx = schedule.findIndex((_seg, i) => {
    const { s, e } = mins[i];
    if (e >= s) {
      return minutesNow >= s && minutesNow < e;
    } else {
      // contoh 22:00–02:00
      return minutesNow >= s || minutesNow < e;
    }
  });

  return { idx, current: idx >= 0 ? schedule[idx] : undefined };
}
