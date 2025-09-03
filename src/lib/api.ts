// src/lib/api.ts
import 'server-only';
import type { NewsArticle } from '@/types';
// Paksa halaman/komponen pemanggil jadi dinamis (hindari static optimization Vercel)
import { unstable_noStore as noStore } from 'next/cache';

/**
 * BASIS API
 * - Bisa dioverride via ENV: BERITA_ID_BASE_URL
 * - Dibereskan trailing slash, dan kalau user keliru isi http → dipaksa https.
 */
const RAW_BASE =
  process.env.BERITA_ID_BASE_URL ??
  'https://api-berita-indonesia.vercel.app';

const BASE = (() => {
  const trimmed = RAW_BASE.replace(/\/$/, '');
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }
  return `https://${trimmed}`;
})();

/**
 * FEEDS — path relatif ke BASE
 */
const FEEDS = [
  '/cnn/terbaru',
  '/cnbc/terbaru',
  '/antara/terbaru',
  '/tempo/hiburan',
  '/sindonews/metro',
];

/** KEYWORDS untuk filter */
const KEYWORDS = [
  'jakarta',
  'persija',
  'pramono anung',
  'rano karno',
  'transjakarta',
  'jaklingko',
  'gubernur jakarta',
];

/** Util: aman-kan parsing tanggal */
function toIsoDate(input: any): string {
  try {
    const d = new Date(input);
    if (isNaN(+d)) return new Date().toISOString();
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/** Util: buang HTML tag sederhana */
function stripHtml(html?: string | null): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, '').trim() || null;
}

/** Cek apakah teks mengandung salah satu KEYWORDS */
function matchesKeywords(...texts: (string | null | undefined)[]): boolean {
  const bag = (texts.filter(Boolean).join(' ') || '').toLowerCase();
  return KEYWORDS.some((kw) => bag.includes(kw));
}

/** Map satu post API ke NewsArticle */
function mapToArticle(post: any, sourceName: string): NewsArticle {
  const title =
    post?.title ??
    post?.judul ??
    '(Tanpa judul)';

  const url =
    post?.link ??
    post?.guid ??
    post?.url ??
    '#';

  const urlToImage =
    post?.thumbnail ??
    post?.image ??
    post?.enclosure?.url ??
    null;

  const description =
    stripHtml(post?.description) ??
    stripHtml(post?.content) ??
    null;

  const publishedAt =
    toIsoDate(post?.pubDate ?? post?.isoDate ?? post?.date);

  return {
    source: { id: null, name: sourceName },
    author: null,
    title,
    description,
    url,
    urlToImage,
    publishedAt,
    content: null,
  };
}

/**
 * Ambil satu feed
 * - noStore() → paksa dinamis
 * - fetch cache: 'no-store' → hindari cache kosong di Vercel
 * - fallback [] bila gagal
 */
async function fetchFeed(path: string): Promise<NewsArticle[]> {
  // Pastikan fungsi ini selalu diperlakukan dinamis
  noStore();

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      cache: 'no-store',
    });
  } catch (e) {
    console.debug('[news] fetch error:', (e as any)?.message || e);
    return [];
  }

  if (!res.ok) {
    console.debug('[news] upstream not ok:', res.status, path);
    return [];
  }

  let json: any = {};
  try {
    json = await res.json();
  } catch {
    console.debug('[news] invalid json at', path);
    return [];
  }

  // Struktur umum: { success, message, data: { posts:[...], title, ... } }
  const data = json?.data ?? {};
  const posts: any[] = Array.isArray(data?.posts) ? data.posts : [];

  const sourceName =
    (typeof data?.title === 'string' && data.title) ||
    path.replace(/^\//, '').toUpperCase();

  return posts.map((p) => mapToArticle(p, sourceName));
}

/**
 * Public: ambil gabungan semua feed + filter keyword + dedupe + sort terbaru
 * - noStore() di sini juga untuk menjamin pemanggilnya tidak di-static-kan
 */
export async function fetchNews(): Promise<{ articles: NewsArticle[] }> {
  noStore();

  // Jalankan paralel, tahan error per feed
  const results = await Promise.all(
    FEEDS.map(async (p) => {
      try {
        return await fetchFeed(p);
      } catch (e) {
        console.debug('[news] feed failed:', p, (e as any)?.message || e);
        return [];
      }
    })
  );

  let articles = results.flat();

  // FILTER dengan KEYWORDS (judul/desc/url)
  articles = articles.filter((a) =>
    matchesKeywords(a.title, a.description ?? '', a.url)
  );

  // DEDUPE (berdasarkan URL, lalu judul)
  const seenUrl = new Set<string>();
  const seenTitle = new Set<string>();
  articles = articles.filter((a) => {
    const keyU = (a.url || '').trim();
    const keyT = (a.title || '').trim().toLowerCase();
    if (keyU && seenUrl.has(keyU)) return false;
    if (keyT && seenTitle.has(keyT)) return false;
    if (keyU) seenUrl.add(keyU);
    if (keyT) seenTitle.add(keyT);
    return true;
  });

  // Sort terbaru → lama
  articles.sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );

  return { articles };
}

/**
 * Search lokal (memakai hasil fetchNews yang sudah terfilter keywords)
 */
export async function searchNews(q: string): Promise<{ articles: NewsArticle[] }> {
  noStore();

  const base = await fetchNews();
  const re = new RegExp(q, 'i');
  return {
    articles: base.articles.filter(
      (a) => re.test(a.title) || re.test(a.description ?? '')
    ),
  };
}
