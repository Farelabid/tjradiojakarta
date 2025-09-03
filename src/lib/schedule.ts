export const TZ = "Asia/Jakarta";

export type Seg = {
  start: string;  // "HH:MM"
  end: string;    // "HH:MM"
  show: string;
  host?: string;
  live?: boolean;
  desc?: string;
  image?: string;
};

export function nowJakarta() {
  const d = new Date();
  const isoDate = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const hhmmLocal = new Intl.DateTimeFormat("id-ID", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  const hhmm = hhmmLocal.replace(".", ":");
  const [H, M] = hhmm.split(":").map(Number);
  const minutes = (H % 24) * 60 + (M % 60);
  const fullDateLabel = new Intl.DateTimeFormat("id-ID", {
    timeZone: TZ, weekday: "long", day: "2-digit", month: "long", year: "numeric",
  }).format(d);
  return { isoDate, hhmm, minutes, fullDateLabel };
}

export function regular(): Seg[] {
  return [
    { start: "06:00", end: "10:00", show: "Morning Drive",   host: "AKBAR KOBAR",   live: true, desc: "Temani awal aktivitas Anda", image: "/images/announcer/akbar.jpg" },
    { start: "10:00", end: "14:00", show: "Siang Santai",    host: "CAK LONTONG",   live: true, desc: "Obrolan segar & lagu pilihan", image: "/images/announcer/cak.jpg" },
    { start: "14:00", end: "18:00", show: "Sore Ceria",      host: "DENNY CHANDRA", live: true, desc: "Info sore & hiburan", image: "/images/announcer/denny.jpg" },
    { start: "18:00", end: "20:00", show: "Senja Jakarta",   host: "INDY RAHMAWATI",live: true, desc: "Golden hour, request & interaksi", image: "/images/announcer/indy.jpg" },
    { start: "20:00", end: "22:00", show: "Malam Asik",      host: "MAZDJOPRAY",    live: true, desc: "Shoutout & cerita malam", image: "/images/announcer/mazdjo.jpg" },
    { start: "22:00", end: "06:00", show: "Midnight Mix",    host: "Playlist TJRadio", desc: "Temani perjalanan malam Anda" },
  ];
}

export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h % 24) * 60 + (m % 60);
};

export function isNowInSlot(nowMin: number, start: string, end: string) {
  const s = toMin(start);
  const e = toMin(end);
  if (s <= e) return nowMin >= s && nowMin < e;
  return nowMin >= s || nowMin < e; // lintas tengah malam
}

export function getSchedule(isoDate: string) {
  return regular();
}

export function findCurrent(isoDate: string, nowMin: number, segments: Seg[]) {
  const idx = segments.findIndex((s) => isNowInSlot(nowMin, s.start, s.end));
  return { idx, current: idx >= 0 ? segments[idx] : null };
}