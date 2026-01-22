// src/lib/schedule.ts
// =====================================================
// Jadwal & util real-time WIB untuk TJRadio Jakarta
// UPDATED: Jan 2026 (Weekdays & Weekend Schedule)
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
  const startEnv = process.env.SOFT_OPENING_START;
  if (!startEnv) return false;
  const startDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date(startEnv));
  return isoDate === startDateStr;
}

// =====================================================
// JADWAL PER HARI (Mon..Sun)
// =====================================================

// Senin
function buildMonday(_isoDate: string): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Odah", //Rio
      image: "/shows/officehour-odah.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "OT Syech & Risan", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "DriveTime", host: "Reno & McDanny", 
      image: "/shows/drivetime.jpg", live: true 
    },
    { 
      start: "20:00", end: "23:00", 
      show: "Shift Malam", host: "Denny Chandra & Eko", 
      image: "/shows/Shiftmalam.jpg", live: true 
    },
    { start: "23:00", end: "24:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
  ];
}

// Selasa
function buildTuesday(_isoDate: string): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Luvi", //Odah
      image: "/shows/officehour-luvi.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "Abi & Hatma",
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "DriveTime", host: "Reno & McDanny", 
      image: "/shows/drivetime.jpg", live: true 
    },
    { 
      start: "20:00", end: "23:00", 
      show: "Shift Malam", host: "Mazdjopray & Eko", 
      image: "/shows/Shiftmalam.jpg", live: true 
    },
    { start: "23:00", end: "24:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
  ];
}

// Rabu
function buildWednesday(_isoDate: string): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Odah", 
      image: "/shows/officehour-odah.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "Abi & Nayla", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "DriveTime", host: "Reno & McDanny", 
      image: "/shows/drivetime.jpg", live: true 
    },
    { 
      start: "20:00", end: "23:00", 
      show: "Shift Malam", host: "Mo Sidik & Denny Chandra", 
      image: "/shows/Shiftmalam.jpg", live: true 
    },
    { start: "23:00", end: "24:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
  ];
}

// Kamis
function buildThursday(_isoDate: string): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Rio", 
      image: "/shows/officehour-rio.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "Abi & Risan", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "DriveTime", host: "Reno & McDanny", 
      image: "/shows/drivetime.jpg", live: true 
    },
    { 
      start: "20:00", end: "23:00", 
      show: "Shift Malam", host: "Mazdjo & Eko", 
      image: "/shows/Shiftmalam.jpg", live: true 
    },
    { start: "23:00", end: "24:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
  ];
}

// Jumat
function buildFriday(_isoDate: string): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Rio", 
      image: "/shows/officehour-rio.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "Abi & Hatma", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "DriveTime", host: "Reno & McDanny", 
      image: "/shows/drivetime.jpg", live: true 
    },
    { 
      start: "20:00", end: "23:00", 
      show: "Shift Malam", host: "Mo Sidik", 
      image: "/shows/Shiftmalam.jpg", live: true 
    },
    { start: "23:00", end: "24:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
  ];
}

// Sabtu
function buildSaturday(): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta Weekend", host: "OT Syech & Odah", 
      image: "/shows/goodmorningjakarta-weekend.jpg", live: true 
    },
    { 
      start: "10:00", end: "12:00", 
      show: "Ragam Budaya", host: "Rio", 
      image: "/shows/ragam-budaya.jpg", live: true 
    },
    { 
      start: "12:00", end: "13:00", 
      show: "Majuin UMKM", host: "Cindee", 
      image: "/shows/majuin-umkm.jpg", live: true 
    },
    { 
      start: "13:00", end: "14:00", 
      show: "Kupas Tuntas",
      image: "/shows/kupas-tuntas.jpg", live: true 
    },
    { 
      start: "14:00", end: "16:00", 
      show: "Keliling Jakarta", host: "Putri Nata & Risan", 
      image: "/shows/keliling-jakarta.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time on The Weekend", host: "Nayla & Hegar", 
      image: "/shows/drivetime-weekend-3.jpg", live: true 
    },
    { 
      start: "20:00", end: "22:00", 
      show: "Komunet (Komunitas Network)", host: "Tio",
      image: "/shows/komunet.jpg", live: true 
    },
    { 
      start: "22:00", end: "24:00", 
      show: "Night Flow", image: "/shows/nightflow.jpg", live: false 
    }
  ];
}

// Minggu
function buildSunday(): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta Weekend", host: "OT Syech & Odah", 
      image: "/shows/goodmorningjakarta-weekend.jpg", live: true 
    },
    { 
      start: "10:00", end: "12:00", 
      show: "Ragam Budaya", host: "Rio",
      image: "/shows/ragam-budaya.jpg", live: true 
    },
    { 
      start: "12:00", end: "13:00", 
      show: "Gema Anak Muda", host: "Ali", 
      image: "/shows/gema-anak-muda.jpg", live: true 
    },
    { 
      start: "13:00", end: "14:00", 
      show: "Song on The Weekend",
      image: "/shows/song-on-theweek.jpg", live: true 
    },
    { 
      start: "14:00", end: "16:00", 
      show: "Keliling Jakarta", host: "Putri Nata & Risan",
      image: "/shows/keliling-jakarta.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time on The Weekend", host: "Risan & Hegar", 
      image: "/shows/drivetime-weekend-3.jpg", live: true 
    },
    { 
      start: "20:00", end: "22:00", 
      show: "Komunet (Komunitas Network)", host: "Tio",
      image: "/shows/komunet.jpg", live: true 
    },
    { 
      start: "22:00", end: "24:00", 
      show: "Night Flow", image: "/shows/nightflow.jpg", live: false 
    }
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
    case "Mon": return buildMonday(isoDate);
    case "Tue": return buildTuesday(isoDate);
    case "Wed": return buildWednesday(isoDate);
    case "Thu": return buildThursday(isoDate);
    case "Fri": return buildFriday(isoDate);
    case "Sat": return buildSaturday();
    case "Sun": return buildSunday();
    default:    return buildMonday(isoDate);
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