// src/lib/schedule.ts
// =====================================================
// Jadwal & util real-time WIB untuk TJRadio Jakarta
// UPDATED: Sesuai jadwal baru (Desember 2025 Special Logic)
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
// HELPER LOGIC SPESIAL (DRIVE TIME DESEMBER 2025)
// =====================================================

function getDriveTimeInfo(isoDate: string, defaultHost: string): { host: string, image: string } {
  // Hanya berlaku untuk Desember 2025
  if (isoDate.startsWith("2025-12")) {
    const day = isoDate.split("-")[2]; // Ambil tanggal "01", "02", dst.

    switch (day) {
      // 1. RENO & YASSER
      case "01":
        return { host: "Reno & Yaser", image: "/shows/drivetime-weekend-3.jpg" }; // Fallback image jika belum ada foto berdua

      // 2. RENO & ODAH
      case "02":
      case "03":
      case "04":
      case "18":
        return { host: "Reno & Odah", image: "/shows/drivetime-weekend-3.jpg" };

      // 3. DANY & YASSER
      case "08":
      case "22":
      case "26":
      case "29":
        return { host: "McDanny & Yaser", image: "/shows/drivetime-weekend-3.jpg" };

      // 4. ODAH & YASSER (atau YASSER & ODAH)
      case "05":
      case "17":
      case "19":
        return { host: "Yaser & Odah", image: "/shows/drivetime-weekend-3.jpg" }; // Ada foto khusus

      // 5. DANY & ODAH
      case "23":
      case "24":
      case "25":
      case "30":
      case "31":
        return { host: "McDanny & Odah", image: "/shows/drivetime-weekend-3.jpg" };
      
      // Default dates (9-12, 15-16) pakai pasangan asli (Dany & Reno)
      default:
        break;
    }
  }

  // Default Schedule (Reno & McDanny)
  return { 
    host: defaultHost, 
    image: "/shows/drivetime.jpg" 
  };
}

// =====================================================
// JADWAL PER HARI (Mon..Sun)
// =====================================================

// Senin
function buildMonday(isoDate: string): Seg[] {
  const dt = getDriveTimeInfo(isoDate, "McDanny & Reno");
  
  return [
    { 
      start: "00:00", end: "06:00", 
      show: "Night Flow", 
      desc: "Playlist santai buat temani malam hingga subuh.", 
      image: "/shows/nightflow.jpg", live: false 
    },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      desc: "Semangat pagi Jakarta! Dengerin musik hits, info traffic, dan berita terkini.", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Rio", 
      desc: "Teman kerja paling pas. Lagu-lagu terbaru hits Indo & manca.", 
      image: "/shows/officehour-rio.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "OT Syech & Risan", 
      desc: "Waktunya rehat sejenak. Obrolan santai seputar komunitas dan budaya.", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time", host: dt.host, 
      desc: "Teman perjalanan pulang. Musik hits sore, update traffic.", 
      image: dt.image, live: true 
    },
    { 
      start: "20:00", end: "24:00", 
      show: "Shift Malam", host: "Denny Chandra & Eko", 
      desc: "Obrolan malam yang ringan dan menghibur.", 
      image: "/shows/Shiftmalam.jpg", live: true 
    }
  ];
}

// Selasa
function buildTuesday(isoDate: string): Seg[] {
  const dt = getDriveTimeInfo(isoDate, "Reno & McDanny");

  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Yaser", 
      desc: "Teman kerja paling pas dengan Yaser.", 
      image: "/shows/officehour-yaser.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "Abi & Salsa",  // Ganti Hatma dengan Salsa
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time", host: dt.host, 
      image: dt.image, live: true 
    },
    { 
      start: "20:00", end: "24:00", 
      show: "Shift Malam", host: "Mazdjo Pray & Eko", 
      image: "/shows/Shiftmalam.jpg", live: true 
    }
  ];
}

// Rabu
function buildWednesday(isoDate: string): Seg[] {
  const dt = getDriveTimeInfo(isoDate, "Reno & McDanny");

  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Yaser", 
      image: "/shows/officehour-yaser.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "Abi & Hatma", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time", host: dt.host, 
      image: dt.image, live: true 
    },
    { 
      start: "20:00", end: "24:00", 
      show: "Shift Malam", host: "Mo Sidik & Denny Chandra", 
      image: "/shows/Shiftmalam.jpg", live: true 
    }
  ];
}

// Kamis
function buildThursday(isoDate: string): Seg[] {
  const dt = getDriveTimeInfo(isoDate, "Reno & McDanny");

  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Luvi", 
      image: "/shows/officehour-luvi.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "Abi & Hatma", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time", host: dt.host, 
      image: dt.image, live: true 
    },
    { 
      start: "20:00", end: "24:00", 
      show: "Shift Malam", host: "Mazdjo Pray & Eko", 
      image: "/shows/Shiftmalam.jpg", live: true 
    }
  ];
}

// Jumat
function buildFriday(isoDate: string): Seg[] {
  const dt = getDriveTimeInfo(isoDate, "Reno & McDanny");

  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta", host: "Indy & Irwan", 
      image: "/shows/goodmorningjakarta.jpg", live: true 
    },
    { 
      start: "10:00", end: "13:00", 
      show: "Office Hour", host: "Luvi", 
      image: "/shows/officehour-luvi.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break", host: "OT Syech & Risan", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time", host: dt.host, 
      image: dt.image, live: true 
    },
    { 
      start: "20:00", end: "24:00", 
      show: "Shift Malam", host: "Mo Sidik", 
      image: "/shows/Shiftmalam.jpg", live: true 
    }
  ];
}

// Sabtu
function buildSaturday(): Seg[] {
  return [
    { start: "00:00", end: "06:00", show: "Night Flow", image: "/shows/nightflow.jpg", live: false },
    { 
      start: "06:00", end: "10:00", 
      show: "Good Morning Jakarta Weekend", host: "OT Syech & Odah", 
      desc: "Menemani akhir pekanmu dengan musik hits dan berita ringan.", 
      image: "/shows/goodmorningjakarta-weekend.jpg", live: true 
    },
    { 
      start: "10:00", end: "12:00", 
      show: "Rute Akhir Pekan", host: "Rio", 
      desc: "Program spesial weekend.", 
      image: "/shows/rute-akhirpekan.jpg", live: true 
    },
    { 
      start: "12:00", end: "13:00", 
      show: "Song on the Week", host: "TJ Radio", 
      desc: "Lagu-lagu hits pilihan minggu ini.", 
      image: "/shows/song-on-theweek.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break Weekend", host: "Putri & Hatma",
      desc: "Waktunya rehat sejenak.", 
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time Weekend", host: "Risan & Hegar", 
      desc: "Menemani sore akhir pekanmu.", 
      image: "/shows/drivetime-weekend-3.jpg", live: true 
    },
    { 
      start: "20:00", end: "22:00", 
      show: "Malming", host: "Chaca & Salsa",
      desc: "Program spesial malam Minggu.", 
      image: "/shows/malming.jpg", live: true 
    },
    { 
      start: "22:00", end: "24:00", 
      show: "Shift Malam", host: "Mo Sidik",
      desc: "Obrolan malam penutup pekan.", 
      image: "/shows/Shiftmalam.jpg", live: true 
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
      show: "Rute Akhir Pekan", host: "Rio", 
      image: "/shows/rute-akhirpekan.jpg", live: true 
    },
    { 
      start: "12:00", end: "13:00", 
      show: "Song on the Week", host: "TJ Radio", 
      image: "/shows/song-on-theweek.jpg", live: true 
    },
    { 
      start: "13:00", end: "16:00", 
      show: "Coffee Break Weekend", host: "Putri & Abi",
      image: "/shows/coffee-break2.jpg", live: true 
    },
    { 
      start: "16:00", end: "20:00", 
      show: "Drive Time Weekend", host: "Nayla & Hegar", 
      image: "/shows/drivetime-weekend-3.jpg", live: true 
    },
    { 
      start: "20:00", end: "22:00", 
      show: "Weekend Seru", host: "Chaca & Salsa",
      desc: "Keseruan minggu malam sebelum kembali beraktivitas.", 
      image: "/shows/weekend-seru.jpg", live: true 
    },
    { 
      start: "22:00", end: "24:00", 
      show: "Shift Malam", host: "Mazdjo Pray & Eko Kuntadhi", 
      image: "/shows/Shiftmalam.jpg", live: true 
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