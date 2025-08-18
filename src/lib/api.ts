// src/lib/api.ts
// ------------------------------------------------------------------
// Sumber: API Berita Indonesia (RSS -> JSON).
// Demo/Docs & daftar route (CNN, CNBC, Tempo, Merdeka, SINDOnews, dll) ada di README. 
// Kita ambil khusus kanal yang relevan Jakarta: 
//   - /merdeka/jakarta
//   - /tempo/metro
//   - /sindonews/metro
// Lalu filter lagi judul/desc/link yang mengandung "Jakarta" (case-insensitive).
// ------------------------------------------------------------------

import 'server-only';
import type { NewsArticle } from '@/types';

const BASE =
  process.env.BERITA_ID_BASE_URL?.replace(/\/$/, '') ||
  'https://api-berita-indonesia.vercel.app';

// Endpoint yang relevan untuk Jakarta
const JAKARTA_ENDPOINTS: Array<{ path: string; sourceName: string; sourceId: string }> = [
  { path: '/merdeka/jakarta',   sourceName: 'Merdeka',   sourceId: 'merdeka' },   // README: merdeka punya kategori `jakarta`
  { path: '/tempo/metro',       sourceName: 'Tempo',     sourceId: 'tempo' },     // README: tempo punya kategori `metro`
  { path: '/sindonews/metro',   sourceName: 'SINDOnews', sourceId: 'sindonews' }, // README: sindonews punya kategori `metro`
];

// Fetch helper (dengan ISR revalidate)
async function http<T>(path: string, revalidateSeconds = 300): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { accept: 'application/json' },
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) throw new Error(`BeritaID API error ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

// Ambil array item dari berbagai bentuk respons (defensif karena tiap provider bisa beda)
function extractItems(payload: any): any[] {
  if (!payload) return [];
  // Beberapa API RSS->JSON lazim mengembalikan bentuk { data: [...] } atau { data: { posts: [...] } }
  const d = payload.data ?? payload.result ?? payload.items ?? payload.articles ?? payload.posts;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.posts)) return d.posts;
  if (Array.isArray(payload?.posts)) return payload.posts;
  return [];
}

function toIso(input: any): string {
  const d = input ? new Date(input) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function pickStr(...args: any[]): string | null {
  for (const a of args) {
    if (typeof a === 'string' && a.trim()) return a.trim();
  }
  return null;
}

function pickImg(obj: any): string | null {
  // Berbagai kemungkinan field gambar dari hasil parse RSS:
  return (
    obj?.thumbnail || obj?.thumb || obj?.image || obj?.enclosure?.url || obj?.enclosureUrl || null
  );
}

function normalize(item: any, sourceId: string, sourceName: string): NewsArticle {
  const title = pickStr(item?.title, item?.judul, item?.title_tag) || '(tanpa judul)';
  const url = pickStr(item?.link, item?.url) || '#';
  const desc = pickStr(item?.description, item?.contentSnippet, item?.summary, item?.body);
  const date = pickStr(item?.pubDate, item?.isoDate, item?.waktu, item?.date, item?.published) || undefined;
  const img = pickImg(item);

  return {
    source: { id: sourceId, name: sourceName },
    author: null,
    title,
    description: desc ?? null,
    url: url!,
    urlToImage: img,
    publishedAt: toIso(date),
    content: null,
  };
}

// ---------------- API yang dipakai UI ----------------

// Ambil berita gabungan "Jakarta" dari beberapa sumber
export async function fetchNews(): Promise<{ articles: NewsArticle[] }> {
  // Ambil paralel dari 3 endpoint
  const payloads = await Promise.allSettled(
    JAKARTA_ENDPOINTS.map((e) => http<any>(e.path))
  );

  const candidates: Array<{ item: any; src: typeof JAKARTA_ENDPOINTS[number] }> = [];

  payloads.forEach((res, idx) => {
    if (res.status !== 'fulfilled') return;
    const src = JAKARTA_ENDPOINTS[idx];
    const arr = extractItems(res.value);
    arr.forEach((it: any) => candidates.push({ item: it, src }));
  });

  // Filter keras: harus mengandung "Jakarta" di judul/desc/link
  const reJakarta = /jakarta/i;
  const filtered = candidates.filter(({ item }) => {
    const hay = `${item?.title ?? item?.judul ?? ''} ${item?.description ?? item?.contentSnippet ?? item?.summary ?? item?.body ?? ''} ${item?.link ?? item?.url ?? ''}`;
    return reJakarta.test(hay);
  });

  // Normalize
  const articles = filtered.map(({ item, src }) => normalize(item, src.sourceId, src.sourceName));

  // Sort terbaru -> lama
  articles.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return { articles };
}

// Pencarian bebas (masih disaring "Jakarta" juga, biar konsisten)
export async function searchNews(q: string): Promise<{ articles: NewsArticle[] }> {
  // Di API ini tiap provider/kategori fixed; tidak ada endpoint search global.
  // Jadi strategi: pakai fetchNews() (yang sudah Jakarta-only) lalu filter judul berisi q.
  const base = await fetchNews();
  const re = new RegExp(q, 'i');
  return { articles: base.articles.filter(a => re.test(a.title) || re.test(a.description ?? '')) };
}
