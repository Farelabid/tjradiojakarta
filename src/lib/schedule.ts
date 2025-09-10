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

const SHOW_IMAGE: Record<string, string> = {
  "Musik Malam TJ": "/shows/musik-malam.jpg",
  "Opening Pre-Event & Pengantar Soft Launching": "/shows/opening.jpg",
  "Info TJ (#JagaJakarta)": "/shows/info-tj.jpg",
  "Sambungan Balai Kota": "/shows/balai-kota.jpg",
  "PERESMIAN TJ Radio oleh Gubernur Jakarta": "/shows/peresmian.jpg",
  "Narasumber TransJakarta & Update Lapangan": "/shows/narasumber-tj.jpg",

  "Jakarta Kota Global & Traffic Update Monas": "/shows/kota-global.jpg",
  "Sesi WAGUB — Q&A 500 Tahun Jakarta & Peresmian TJ Radio": "/shows/wagub.jpg",

  "Kuliner Jakarta & IG Foods": "/shows/kuliner.jpg",
  "Ayo Naik Transport Umum": "/shows/fasum-angkutan.jpg",

  "Traffic & Cerita Penumpang": "/shows/drive-opening.jpg",
  "Ngobrol Bareng Sopir • Satu Halte, Satu Cerita": "/shows/drive-sopir-halte.jpg",
  "Jakarta Malam": "/shows/jakarta-malam.jpg",

  "Spesial The Limpa": "/shows/the-limpa.jpg",
  "Transformasi Radio": "/shows/transformasi.jpg",
};

function imageForShowTitle(title?: string): string | undefined {
  return title ? SHOW_IMAGE[title] : undefined;
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

function buildSoftLaunch(): Seg[] {
  // SOFT LAUNCHING — Kamis, 11 Sep 2025 (WIB)
  // Ringkas: satu topik = satu show. Tanpa "lagu/promo".
  const segs: Seg[] = [
    { start: "00:00", end: "06:00", show: "Musik Malam TJ" },
    // ===== 06:00–10:00 — PAGI =====
    {
      start: "06:00",
      end: "06:15",
      show: "Opening Pre-Event & Pengantar Soft Launching",
      host: "Irwan",
      live: true,
      desc: "Pembuka penuh semangat, pantun hangat, dan teaser agenda besar pagi ini."
    },
    {
      start: "06:15",
      end: "08:00",
      show: "Info TJ (#JagaJakarta)",
      host: "Irwan, Denny Chandra, Risan, Abi, Nayla",
      live: true,
      desc: "Sambungan langsung dari jalanan Jakarta: update lapangan, cerita penumpang, dan fakta layanan TransJakarta."
    },
    {
      start: "08:00",
      end: "08:30",
      show: "Sambungan Balai Kota",
      host: "Irwan",
      live: true,
      desc: "Countdown menuju momen bersejarah—sapaan dari Balai Kota bersama trio komedian & Dirut TJ."
    },
    {
      start: "08:30",
      end: "08:55",
      show: "PERESMIAN TJ Radio oleh Gubernur Jakarta",
      host: "Gubernur Jakarta, Teh Indy, Mo Sidik, Cak Lontong, Dirut TJ",
      live: true,
      desc: "Gubernur menekan tombol, TJ Radio resmi mengudara menjadi Teman Perjalanan Jakarta!"
    },
    {
      start: "08:55",
      end: "10:00",
      show: "Narasumber TransJakarta & Update Lapangan",
      host: "Irwan & Denny Chandra",
      live: true,
      desc: "Kupas tuntas inovasi TJ"
    },

    // ===== 10:00–12:00 — TEH INDY & MO SIDIK =====
    {
      start: "10:00",
      end: "11:00",
      show: "Jakarta Kota Global & Traffic Update Monas",
      host: "Teh Indy & Mo Sidik",
      live: true,
      desc: "Jakarta sebagai kota global, traffic update Monas bersama Patricia"
    },
    {
      start: "11:00",
      end: "12:00",
      show: "Sesi WAGUB — Q&A 500 Tahun Jakarta & Peresmian TJ Radio",
      host: "Teh Indy, Mo Sidik, Wakil Gubernur Jakarta",
      live: true,
      desc: "Dialog santai namun bermakna: visi 500 Tahun Jakarta, peran radio, dan harapan untuk warganya."
    },

    // ===== 12:00–14:00 — LUNCH TALK T =====
    {
      start: "12:00",
      end: "13:00",
      show: "Kuliner Jakarta & IG Foods",
      host: "Akbar, Pak Yaser & Hatma",
      live: true,
      desc: "Tur kuliner sore-sore: Blok M, Petak Sembilan, Pasar Baru—plus tren makanan viral versi warganet."
    },
    {
      start: "13:00",
      end: "14:00",
      show: "Ayo Naik Transport Umum",
      host: "Akbar, Pak Yaser & Hatma",
      live: true,
      desc: "Kenapa fasum harus dijaga, manfaat naik kendaraan umum, ditutup pantun penyemangat siang."
    },

    // ===== 17:00–20:00 — DRIVE TIME =====
    {
      start: "17:00",
      end: "18:00",
      show: "Traffic & Cerita Penumpang",
      host: "Mc Danny & Reno",
      live: true,
      desc: "Jam pulang kerja ditemani update lalu lintas dan kisah lucu-hangat dari penumpang TJ."
    },
    {
      start: "18:00",
      end: "19:00",
      show: "Ngobrol Bareng Sopir • Satu Halte, Satu Cerita",
      host: "Mc Danny & Reno",
      live: true,
      desc: "Obrolan inspiratif bersama sopir dan cerita halte ikonik."
    },
    {
      start: "19:00",
      end: "20:00",
      show: "Jakarta Malam",
      host: "Mc Danny & Reno",
      live: true,
      desc: "Suasana kota jelang malam, salam dari pendengar, dan rangkuman highlight perjalanan hari ini."
    },

    // ===== 20:00–22:00 — SPESIAL MALAM =====
    {
      start: "20:00",
      end: "21:00",
      show: "Spesial The Limpa",
      host: "Kang Denny, Cing Abdel, Akbar Kobar, Cak Lontong, Mazdjopray",
      live: true,
      desc: "Reuni hangat para idola: kisah awal siaran, tawa khas radio, dan momen paling menyentuh bareng pendengar."
    },
    {
      start: "21:00",
      end: "22:00",
      show: "Transformasi Radio",
      host: "TJ Radio Jakarta All Stars",
      live: true,
      desc: "Obrolan reflektif tentang masa depan radio Jakarta, cerita pribadi, dan pesan untuk generasi berikutnya."
    },
  ];

  // Otomatis isi image jika ada pemetaan host -> foto (opsional).
  return segs.map((s) => ({ ...s, image: imageForShowTitle(s.show) }));
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
