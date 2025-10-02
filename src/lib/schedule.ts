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
  image?: string;       // path manual per segment
  live?: boolean;       // true = berpenyiar, false = blok lagu
};

export const TZ = "Asia/Jakarta";

// Util format & waktu
export const PAD = (n: number) => n.toString().padStart(2, "0");

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

export function nowJakarta() {
  const d = new Date();
  const isoDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
  }).format(d); // YYYY-MM-DD
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ, hour12: false, hour: "2-digit", minute: "2-digit"
  }).format(d); // "HH:MM" kadang "HH.MM"
  const minutes = toMin(timeStr);
  const fullDateLabel = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ, weekday: "long", day: "2-digit", month: "long", year: "numeric"
  }).format(d);
  return { isoDate, minutes, fullDateLabel };
}

export function isSoftLaunchDay(isoDate: string) {
  const startEnv = process.env.SOFT_OPENING_START; // contoh: "2025-09-11T09:45:00+07:00"
  if (!startEnv) return false;
  const startDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date(startEnv));
  return isoDate === startDateStr;
}

// =====================================================
// JADWAL PER HARI (Mon..Sun) – sesuai jadwal terbaru
// Image manual per segment (bisa disesuaikan per hari)
// =====================================================

// Senin
function buildMonday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Musik Malam TJ", 
      desc: "Nonstop hits malam", 
      image: "/shows/musik-malamusik-malam-tjg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "ONEDEE MORNING", 
      host: "Indy & Irwan", 
      desc: "Irwan & Indy Di Pagi TJ RADIO", 
      image: "/shows/onedee-morning.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "TJ HORE", 
      host: "Luvi & Rio", 
      desc: "Happy Hour", 
      image: "/shows/tj-hore-luvi-rio.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "JAKARTA MOVE", 
      host: "OT Syech & Nayla", 
      image: "/shows/jakarta-move.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "DRiveTime", 
      host: "Reno & McDanny", 
      desc: "Dani - Reno Time", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "24:00", 
      show: "SHIFT MALAM", 
      host: "Mazdjo Pray & Eko Kuntadhi", 
      image: "/shows/shift-malam.jpg",
      live: true 
    },
  ];
}

// Selasa
function buildTuesday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Musik Malam TJ", 
      desc: "Nonstop hits malam", 
      image: "/shows/musik-malam-tj.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "ONEDEE MORNING", 
      host: "Indy & Irwan", 
      desc: "Irwan & Indy Di Pagi TJ RADIO", 
      image: "/shows/onedee-morning.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "TJ HORE", 
      host: "Odah & Rio", 
      desc: "Happy Hour", 
      image: "/shows/tj-hore.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "JAKARTA MOVE", 
      host: "Abi & Risan", 
      image: "/shows/jakarta-move.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "DRiveTime", 
      host: "Reno & McDanny", 
      desc: "Dani - Reno Time", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "24:00", 
      show: "SHIFT MALAM", 
      host: "Akbar & Cak Lontong", 
      image: "/shows/shift-malam.jpg",
      live: true 
    },
  ];
}

// Rabu
function buildWednesday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Musik Malam TJ", 
      desc: "Nonstop hits malam", 
      image: "/shows/musik-malam-tj.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "ONEDEE MORNING", 
      host: "Indy & Irwan", 
      desc: "Irwan & Indy Di Pagi TJ RADIO", 
      image: "/shows/onedee-morning.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "TJ HORE", 
      host: "Odah & Yaser", 
      desc: "Happy Hour", 
      image: "/shows/tj-hore-odah-yaser.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "JAKARTA MOVE", 
      host: "Abi & Risan", 
      image: "/shows/jakarta-move.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "DRiveTime", 
      host: "Reno & McDanny", 
      desc: "Dani - Reno Time", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "24:00", 
      show: "SHIFT MALAM", 
      host: "Mo Sidik & Denny Chandra", 
      image: "/shows/shift-malam.jpg",
      live: true 
    },
  ];
}

// Kamis
function buildThursday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Musik Malam TJ", 
      desc: "Nonstop hits malam", 
      image: "/shows/musik-malam-tj.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "ONEDEE MORNING", 
      host: "Indy & Irwan", 
      desc: "Irwan & Indy Di Pagi TJ RADIO", 
      image: "/shows/onedee-morning.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "TJ HORE", 
      host: "Hatma & Luvi", 
      desc: "Happy Hour", 
      image: "/shows/tj-hore-hatma-luvi.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "JAKARTA MOVE", 
      host: "Opet & Risan", 
      image: "/shows/jakarta-move.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "DRiveTime", 
      host: "Reno & McDanny", 
      desc: "Dani - Reno Time", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "24:00", 
      show: "SHIFT MALAM", 
      host: "Mo Sidik & Denny Chandra", 
      image: "/shows/shift-malam.jpg",
      live: true 
    },
  ];
}

// Jumat
function buildFriday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Musik Malam TJ", 
      desc: "Nonstop hits malam", 
      image: "/shows/musik-malam-tj.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "ONEDEE MORNING", 
      host: "Indy & Irwan", 
      desc: "Irwan & Indy Di Pagi TJ RADIO", 
      image: "/shows/onedee-morning.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "TJ HORE", 
      host: "Hatma & Luvi", 
      desc: "Happy Hour", 
      image: "/shows/tj-hore-hatma-luvi.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "JAKARTA MOVE", 
      host: "OT Syech & Opet", 
      image: "/shows/jakarta-move.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "DRiveTime", 
      host: "Reno & McDanny", 
      desc: "Dani - Reno Time", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "24:00", 
      show: "SHIFT MALAM", 
      host: "Mo Sidik & Denny Chandra", 
      image: "/shows/shift-malam.jpg",
      live: true 
    },
  ];
}

// Sabtu
function buildSaturday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Musik Malam TJ", 
      desc: "Nonstop hits malam", 
      image: "/shows/musik-malam-tj.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "ONEDEE MORNING Weekend", 
      host: "Rio & Odah", 
      desc: "Rio & Odah Di Pagi TJ RADIO", 
      image: "/shows/onedee-morning-weekend.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "TJ HORE", 
      host: "Opet & Hatma", 
      desc: "Happy Hour", 
      image: "/shows/tj-hore-opet-hatma.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "JAKARTA MOVE", 
      host: "Abi & Risan", 
      image: "/shows/jakarta-move.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "DRiveTime Weekend", 
      host: "OT Syech & Nayla", 
      image: "/shows/drivetime-weekend.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "24:00", 
      show: "SHIFT MALAM", 
      host: "THE LIMPA", 
      desc: "Shift Malam bersama THE LIMPA", 
      image: "/shows/the-limpa.jpg",
      live: true 
    },
  ];
}

// Minggu
function buildSunday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Musik Malam TJ", 
      desc: "Nonstop hits malam", 
      image: "/shows/musik-malam-tj.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "ONEDEE MORNING Weekend", 
      host: "Rio & Odah", 
      desc: "Rio & Odah Di Pagi TJ RADIO", 
      image: "/shows/onedee-morning-weekend.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "TJ HORE", 
      host: "Opet & Hatma", 
      desc: "Happy Hour", 
      image: "/shows/tj-hore-opet-hatma.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "JAKARTA MOVE", 
      host: "Abi & Risan", 
      image: "/shows/jakarta-move.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "DRiveTime Weekend", 
      host: "OT Syech & Nayla", 
      image: "/shows/drivetime-weekend.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "24:00", 
      show: "SHIFT MALAM", 
      host: "THE LIMPA", 
      desc: "Shift Malam bersama THE LIMPA", 
      image: "/shows/the-limpa.jpg",
      live: true 
    },
  ];
}

// Helper hari
function getDayKey(isoDate: string): "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" {
  const jsDate = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(jsDate) as any;
}

// API utama jadwal
export function getSchedule(isoDate: string): Seg[] {
  const day = getDayKey(isoDate);
  switch (day) {
    case "Mon": return buildMonday();
    case "Tue": return buildTuesday();
    case "Wed": return buildWednesday();
    case "Thu": return buildThursday();
    case "Fri": return buildFriday();
    case "Sat": return buildSaturday();
    case "Sun": return buildSunday();
    default:    return buildMonday();
  }
}

// Cari segmen aktif (mendukung lintas tengah malam)
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
    if (inRange) { found = i; break; }
  }
  return { idx: found, current: found >= 0 ? schedule[found] : null };
}