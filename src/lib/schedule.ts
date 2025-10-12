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
      show: "Night Flow", 
      desc: "Playlist santai buat temani malam hingga subuh.", 
      image: "/shows/nightflow.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "Good Morning Jakarta", 
      host: "Indy & Irwan", 
      desc: "Semangat pagi Jakarta! Dengerin musik hits, info traffic, dan berita terkini.", 
      image: "/shows/goodmorningjakarta.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "Office Hour", 
      host: "Rio", 
      desc: "Teman kerja paling pas. Lagu-lagu terbaru hits Indo & manca, plus request via WA/TikTok.", 
      image: "/shows/officehour-rio.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "Coffee Break", 
      host: "OT Syech & Nayla", 
      desc: "Waktunya rehat sejenak. Obrolan santai seputar komunitas, budaya, dan info giat Pemprov.", 
      image: "/shows/coffee-break2.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "Drive Time", 
      host: "Reno & MC Dany", 
      desc: "Teman perjalanan pulang. Musik hits sore, update traffic, dan info seputar TransJakarta.", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "23:00", 
      show: "Shift Malam", 
      host: "Denny CH & Eko Kuntadhi", 
      desc: "Obrolan malam yang ringan dan menghibur. Ada info penting, podcast mingguan, dan komedi.", 
      image: "/shows/Shiftmalam.jpg",
      live: true 
    },
    {
      start: "23:00",
      end: "24:00",
      show: "Yesterday Hits",
      desc: "Memutar kembali kenangan lewat lagu nostalgia 80-90an, Indo & barat.",
      image: "/shows/yesterday-hits.jpg",
      live: false
    }
  ];
}

// Selasa
function buildTuesday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Night Flow", 
      desc: "Playlist santai buat temani malam hingga subuh.", 
      image: "/shows/nightflow.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "Good Morning Jakarta", 
      host: "Indy & Irwan", 
      desc: "Semangat pagi Jakarta! Dengerin musik hits, info traffic, dan berita terkini.", 
      image: "/shows/goodmorningjakarta.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "Office Hour", 
      host: "Rio", 
      desc: "Teman kerja paling pas. Lagu-lagu terbaru hits Indo & manca, plus request via WA/TikTok.", 
      image: "/shows/officehour-rio.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "Coffee Break", 
      host: "Abi & Hatma", 
      desc: "Waktunya rehat sejenak. Obrolan santai seputar komunitas, budaya, dan info giat Pemprov.", 
      image: "/shows/coffee-break2.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "Drive Time", 
      host: "Reno & MC Dany", 
      desc: "Teman perjalanan pulang. Musik hits sore, update traffic, dan info seputar TransJakarta.", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "23:00", 
      show: "Shift Malam", 
      host: "Mazdjo Pray & Eko Kuntadhi", 
      desc: "Obrolan malam yang ringan dan menghibur. Ada info penting, podcast mingguan, dan komedi.", 
      image: "/shows/Shiftmalam.jpg",
      live: true 
    },
    {
      start: "23:00",
      end: "24:00",
      show: "Yesterday Hits",
      desc: "Memutar kembali kenangan lewat lagu nostalgia 80-90an, Indo & barat.",
      image: "/shows/yesterday-hits.jpg",
      live: false
    }
  ];
}

// Rabu
function buildWednesday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Night Flow", 
      desc: "Playlist santai buat temani malam hingga subuh.", 
      image: "/shows/nightflow.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "Good Morning Jakarta", 
      host: "Indy & Irwan", 
      desc: "Semangat pagi Jakarta! Dengerin musik hits, info traffic, dan berita terkini.", 
      image: "/shows/goodmorningjakarta.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "Office Hour", 
      host: "Luvi", 
      desc: "Teman kerja paling pas. Lagu-lagu terbaru hits Indo & manca, plus request via WA/TikTok.", 
      image: "/shows/officehour-luvi.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "Coffee Break", 
      host: "Abi & Hatma", 
      desc: "Waktunya rehat sejenak. Obrolan santai seputar komunitas, budaya, dan info giat Pemprov.", 
      image: "/shows/coffee-break2.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "Drive Time", 
      host: "Reno & Dany", 
      desc: "Teman perjalanan pulang. Musik hits sore, update traffic, dan info seputar TransJakarta.", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "23:00", 
      show: "Shift Malam", 
      host: "Mo Sidik & Denny Chandra", 
      desc: "Obrolan malam yang ringan dan menghibur. Ada info penting, podcast mingguan, dan komedi.", 
      image: "/shows/Shiftmalam.jpg",
      live: true 
    },
    {
      start: "23:00",
      end: "24:00",
      show: "Yesterday Hits",
      desc: "Memutar kembali kenangan lewat lagu nostalgia 80-90an, Indo & barat.",
      image: "/shows/yesterday-hits.jpg",
      live: false
    }
  ];
}

// Kamis
function buildThursday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Night Flow", 
      desc: "Playlist santai buat temani malam hingga subuh.", 
      image: "/shows/nightflow.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "Good Morning Jakarta", 
      host: "Indy & Irwan", 
      desc: "Semangat pagi Jakarta! Dengerin musik hits, info traffic, dan berita terkini.", 
      image: "/shows/goodmorningjakarta.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "Office Hour", 
      host: "Luvi", 
      desc: "Teman kerja paling pas. Lagu-lagu terbaru hits Indo & manca, plus request via WA/TikTok.", 
      image: "/shows/officehour-luvi.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "Coffee Break", 
      host: "Abi & Hatma", 
      desc: "Waktunya rehat sejenak. Obrolan santai seputar komunitas, budaya, dan info giat Pemprov.", 
      image: "/shows/coffee-break2.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "Drive Time", 
      host: "Reno & Dany", 
      desc: "Teman perjalanan pulang. Musik hits sore, update traffic, dan info seputar TransJakarta.", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "23:00", 
      show: "Shift Malam", 
      host: "Eko Kuntadhi & Mazdjo Pray", 
      desc: "Obrolan malam yang ringan dan menghibur. Ada info penting, podcast mingguan, dan komedi.", 
      image: "/shows/Shiftmalam.jpg",
      live: true 
    },
    {
      start: "23:00",
      end: "24:00",
      show: "Yesterday Hits",
      desc: "Memutar kembali kenangan lewat lagu nostalgia 80-90an, Indo & barat.",
      image: "/shows/yesterday-hits.jpg",
      live: false
    }
  ];
}

// Jumat
function buildFriday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Night Flow", 
      desc: "Playlist santai buat temani malam hingga subuh.", 
      image: "/shows/nightflow.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "Good Morning Jakarta", 
      host: "Indy & Irwan", 
      desc: "Semangat pagi Jakarta! Dengerin musik hits, info traffic, dan berita terkini.", 
      image: "/shows/goodmorningjakarta.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "Office Hour", 
      host: "Luvi", 
      desc: "Teman kerja paling pas. Lagu-lagu terbaru hits Indo & manca, plus request via WA/TikTok.", 
      image: "/shows/officehour-luvi.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "Coffee Break", 
      host: "OT Syech & Risan", 
      desc: "Waktunya rehat sejenak. Obrolan santai seputar komunitas, budaya, dan info giat Pemprov.", 
      image: "/shows/coffee-break2.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "Drive Time", 
      host: "Reno & Dany", 
      desc: "Teman perjalanan pulang. Musik hits sore, update traffic, dan info seputar TransJakarta.", 
      image: "/shows/drivetime.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "23:00", 
      show: "Shift Malam", 
      host: "Mo Sidik", 
      desc: "Obrolan malam yang ringan dan menghibur. Ada info penting, podcast mingguan, dan komedi.", 
      image: "/shows/Shiftmalam.jpg",
      live: true 
    },
    {
      start: "23:00",
      end: "24:00",
      show: "Yesterday Hits",
      desc: "Memutar kembali kenangan lewat lagu nostalgia 80-90an, Indo & barat.",
      image: "/shows/yesterday-hits.jpg",
      live: false
    }
  ];
}

// Sabtu
function buildSaturday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Night Flow", 
      desc: "Playlist santai buat temani malam hingga subuh.", 
      image: "/shows/nightflow.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "Good Morning Jakarta Weekend", 
      host: "OT & Odah", 
      desc: "Menemani akhir pekanmu dengan musik hits, info lalu lintas, dan berita ringan Jakarta.", 
      image: "/shows/goodmorningjakarta-weekend.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "Office Hour", 
      host: "Rio", 
      desc: "Teman kerja paling pas. Lagu-lagu terbaru hits Indo & manca, plus request via WA/TikTok.", 
      image: "/shows/officehour-rio.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "Coffee Break", 
      host: "Abi & Hatma", 
      desc: "Waktunya rehat sejenak. Obrolan santai seputar komunitas, budaya, dan info giat Pemprov.", 
      image: "/shows/coffee-break2.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "Drive Time Weekend", 
      host: "Risan & Nayla", 
      desc: "Menemani sore akhir pekanmu di jalan. Dengerin musik hits sambil dapet update info lalu lintas.", 
      image: "/shows/drivetime-weekend-2.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "23:00", 
      show: "Shift Malam", 
      desc: "Acara rekaman (tapping) program Shift Malam.", 
      image: "/shows/Shiftmalam.jpg",
      live: true 
    },
    {
      start: "23:00",
      end: "24:00",
      show: "Yesterday Hits",
      desc: "Memutar kembali kenangan lewat lagu nostalgia 80-90an, Indo & barat.",
      image: "/shows/yesterday-hits.jpg",
      live: false
    }
  ];
}

// Minggu
function buildSunday(): Seg[] {
  return [
    { 
      start: "00:00", 
      end: "06:00", 
      show: "Night Flow", 
      desc: "Playlist santai buat temani malam hingga subuh.", 
      image: "/shows/nightflow.jpg",
      live: false 
    },
    { 
      start: "06:00", 
      end: "10:00", 
      show: "Good Morning Jakarta Weekend", 
      host: "OT & Odah", 
      desc: "Menemani akhir pekanmu dengan musik hits, info lalu lintas, dan berita ringan Jakarta.", 
      image: "/shows/goodmorningjakarta-weekend.jpg",
      live: true 
    },
    { 
      start: "10:00", 
      end: "13:00", 
      show: "Office Hour", 
      host: "Rio", 
      desc: "Teman kerja paling pas. Lagu-lagu terbaru hits Indo & manca, plus request via WA/TikTok.", 
      image: "/shows/officehour-rio.jpg",
      live: true 
    },
    { 
      start: "13:00", 
      end: "16:00", 
      show: "Coffee Break", 
      host: "Risan & Audrey", 
      desc: "Waktunya rehat sejenak. Obrolan santai seputar komunitas, budaya, dan info giat Pemprov.", 
      image: "/shows/coffee-break2.jpg",
      live: true 
    },
    { 
      start: "16:00", 
      end: "20:00", 
      show: "Drive Time Weekend", 
      host: "Nayla", 
      desc: "Menemani sore akhir pekanmu di jalan. Dengerin musik hits sambil dapet update info lalu lintas.", 
      image: "/shows/drivetime-weekend-2.jpg",
      live: true 
    },
    { 
      start: "20:00", 
      end: "23:00", 
      show: "Shift Malam", 
      desc: "Acara rekaman (tapping) program Shift Malam.", 
      image: "/shows/Shiftmalam.jpg",
      live: true 
    },
    {
      start: "23:00",
      end: "24:00",
      show: "Yesterday Hits",
      desc: "Memutar kembali kenangan lewat lagu nostalgia 80-90an, Indo & barat.",
      image: "/shows/yesterday-hits.jpg",
      live: false
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