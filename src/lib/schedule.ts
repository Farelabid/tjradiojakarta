// lib/schedule.ts
export const TZ = "Asia/Jakarta";

// ========== Utils Waktu ==========
export const PAD = (n: number) => n.toString().padStart(2, "0");
export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h % 24) * 60 + (m % 60);
};
export const fmtRange = (a: string, b: string) => `${a}–${b} WIB`;

function fmtDateLabel(d: Date) {
  const hari = new Intl.DateTimeFormat("id-ID", { timeZone: TZ, weekday: "long" }).format(d);
  const tgl = new Intl.DateTimeFormat("id-ID", { timeZone: TZ, day: "2-digit", month: "long", year: "numeric" }).format(d);
  return `${hari}, ${tgl}`;
}

export function nowJakarta() {
  const d = new Date();
  const isoDate = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d); // YYYY-MM-DD
  const hhmmLocal = new Intl.DateTimeFormat("id-ID", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(d); // "HH.MM" or "HH. MM" on some locales
  const hhmm = hhmmLocal.replace(".", ":").replace(" ", "");
  const minutes = toMin(hhmm);
  const fullDateLabel = fmtDateLabel(d);
  return { isoDate, hhmm, minutes, fullDateLabel };
}

// ========== Tipe & Foto Host ==========
export type Seg = {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  show: string;
  host?: string;
  live?: boolean;
  desc?: string;
  image?: string; // path ke /public
};

// Foto yang tersedia. Simpan file di /public/hosts/ (case sensitive).
const HOST_IMG: Record<string, string> = {
  indy: "/hosts/indy.jpg",
  irwan: "/hosts/irwan.jpg",
  eko: "/hosts/eko.jpg",
  reno: "/hosts/reno.jpg",
  mcdanny: "/hosts/mcdanny.jpg",
  "mc dany": "/hosts/mcdanny.jpg",
  caklontong: "/hosts/caklontong.jpg",
  "cak lontong": "/hosts/caklontong.jpg",
  mazdjopray: "/hosts/mazdjopray.jpg",
  akbar: "/hosts/akbar.jpg",
  denny: "/hosts/denny.jpg",
  mosidik: "/hosts/mosidik.jpg",
};

function imageForHost(host?: string) {
  if (!host) return undefined;
  const slug = host.toLowerCase();
  for (const key of Object.keys(HOST_IMG)) {
    if (slug.includes(key)) return HOST_IMG[key];
  }
  return undefined;
}

// ========== Soft Launch Day ==========
const OFFICIAL_SOFT_DATE = (process.env.SOFT_OPENING_START ?? "2025-09-11T00:00:00+07:00").slice(0, 10);
const TEST_MODE = process.env.SOFT_OPENING_TEST_MODE === "1";
const TEST_START = process.env.SOFT_OPENING_TEST_START ?? "";

export const isSoftLaunchDay = (isoDate: string) => {
  if (isoDate === OFFICIAL_SOFT_DATE) return true;
  if (TEST_MODE && TEST_START) return isoDate === TEST_START.slice(0, 10);
  return false;
};

// ========== Jadwal Soft Launch (ringkas, 24 jam utuh) ==========
function buildSoftLaunch(): Seg[] {
  const segs: Seg[] = [
    { start: "00:00", end: "06:00", show: "Musik Malam TJ" },

    { start: "06:00", end: "06:03", show: "Jam Pertama (Pre-Event)", host: "Pemandu Studio", live: true, desc: "Pembukaan" },
    { start: "06:03", end: "06:15", show: "Musik & Informasi" },
    { start: "06:15", end: "06:18", show: "Talk: Reporter & On-Bus", host: "Patricia & OT", live: true },
    { start: "06:18", end: "06:30", show: "Musik & Informasi" },

    { start: "06:30", end: "07:18", show: "TJ Morning Vibes", host: "Indy & Irwan (+Eko via telp)", live: true },
    { start: "07:18", end: "08:30", show: "Musik Pagi" },
    { start: "08:30", end: "08:48", show: "Lunch Talk TJ", host: "Hatma & Patricia", live: true },
    { start: "08:48", end: "10:00", show: "Musik Menjelang Siang" },

    { start: "10:00", end: "12:18", show: "Sapa Pendengar", host: "Risan & Hatma", live: true },
    { start: "12:18", end: "14:00", show: "Musik Siang" },

    { start: "14:00", end: "14:03", show: "Jakarte, Ape Kabar?", host: "Eko Kuntadhi", live: true },
    { start: "14:03", end: "17:00", show: "Musik & Info Sore" },

    { start: "17:00", end: "17:03", show: "Sore di Bis Bareng", host: "Reno & MC Danny", live: true },
    { start: "17:03", end: "20:00", show: "Drive Time Playlist" },

    { start: "20:00", end: "20:03", show: "Talk 1 – Kenangan Radio", host: "Cing Abdel & Akbar", live: true },
    { start: "20:03", end: "20:30", show: "Musik" },
    { start: "20:30", end: "20:33", show: "Talk 2 – Radio & Komedi", host: "Cak Lontong & Mazdjopray", live: true },
    { start: "20:33", end: "20:45", show: "Musik" },
    { start: "20:45", end: "20:48", show: "Talk 3 – Radio & Publik", host: "Denny & Cing Abdel", live: true },
    { start: "20:48", end: "21:00", show: "Musik" },
    { start: "21:00", end: "21:03", show: "Talk 4 – Transformasi", host: "All Crew (host Mazdjopray)", live: true },
    { start: "21:03", end: "24:00", show: "Musik Malam TJ" },
  ];

  return segs.map((s) => (s.image ? s : { ...s, image: imageForHost(s.host) }));
}

// ========== Jadwal Rutin ==========
function buildRoutine(isoDate: string): Seg[] {
  const jsDate = new Date(isoDate + "T00:00:00+07:00");
  const dayStr = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(jsDate);
  const isWeekend = dayStr === "Sat" || dayStr === "Sun";

  const head: Seg[] = [{ start: "00:00", end: "06:00", show: "Musik Malam TJ" }];
  const tail: Seg[] = [{ start: "21:00", end: "24:00", show: "Musik Malam TJ" }];

  if (!isWeekend) {
    const isThuOrFri = dayStr === "Thu" || dayStr === "Fri";
    const lunchHost = isThuOrFri ? "Hatma & Patricia" : "Risan & Hatma";

    const core: Seg[] = [
      { start: "06:00", end: "10:00", show: "TJ Morning Vibes", host: "Indy & Irwan", live: true },
      { start: "10:00", end: "14:00", show: "Lunch Talk TJ", host: lunchHost, live: true },
      { start: "14:00", end: "17:00", show: "Jakarte, Ape Kabar?", host: "Eko Kuntadhi", live: true },
      { start: "17:00", end: "21:00", show: "Sore di Bis Bareng", host: "Reno & MC Danny", live: true },
    ];
    return [...head, ...core.map((s) => ({ ...s, image: imageForHost(s.host) })), ...tail];
  }

  const weekendCore: Seg[] = [
    { start: "06:00", end: "10:00", show: "TJ Morning Vibes Weekend", host: "OT & Nayla", live: true },
    { start: "10:00", end: "14:00", show: "Lunch Talk TJ Weekend", host: "Abi & Saodah", live: true },
    { start: "14:00", end: "17:00", show: "Lagu Akhir Pekan" },
    { start: "17:00", end: "21:00", show: "Weekend Drive", host: "OT & Nayla", live: true },
  ];
  return [...head, ...weekendCore.map((s) => ({ ...s, image: imageForHost(s.host) })), ...tail];
}

// ========== Penentu Acara Aktif ==========
function normalizeRanges(segs: Seg[]) {
  return segs.map((s) => {
    const sMin = toMin(s.start);
    let eMin = toMin(s.end);
    if (eMin <= sMin) eMin += 1440; // lintas tengah malam
    return { ...s, sMin, eMin };
  });
}

export function findCurrent(isoDate: string, nowMin: number, segments: Seg[]) {
  if (!segments.length) return { idx: -1, current: undefined as Seg | undefined };
  const ranges = normalizeRanges(segments);
  const candidates = [nowMin, nowMin + 1440];
  let idx = -1;
  for (let i = 0; i < ranges.length; i++) {
    for (const t of candidates) {
      if (t >= ranges[i].sMin && t < ranges[i].eMin) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) break;
  }
  return { idx, current: idx >= 0 ? segments[idx] : undefined };
}

// ========== Public API ==========
export function getSchedule(isoDate: string): Seg[] {
  return isSoftLaunchDay(isoDate) ? buildSoftLaunch() : buildRoutine(isoDate);
}
