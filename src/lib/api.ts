// src/lib/api.ts
// ------------------------------------------------------------------
// Aggregator Berita (server-only) berbasis "API Berita Indonesia".
// Kanal yang diambil (Jakarta/Metro):
//   - /merdeka/jakarta
//   - /tempo/metro
//   - /sindonews/metro
//
// Lalu DISARING lagi berdasarkan keyword yang kamu minta:
//   ["jakarta","pramono anung","rano karno","transjakarta","gubernur jakarta"]
// Pencocokan case-insensitive terhadap judul, deskripsi, dan link.
// ------------------------------------------------------------------

import 'server-only';
import type { NewsArticle } from '@/types';

// Basis API (boleh override via ENV BERITA_ID_BASE_URL)
const BASE =
  (process.env.BERITA_ID_BASE_URL?.replace(/\/$/, '') ||
    'https://api-berita-indonesia.vercel.app') as string;

// Sumber-sumber yang relevan untuk Jakarta/Metro
const FEEDS = [
  '/cnn/terbaru',
  '/cnbc/terbaru',
  '/antara/terbaru',
  '/tempo/hiburan',
  '/sindonews/metro',
];

// Keyword penyaring sesuai permintaan (huruf kecil semua utk match i)
const KEYWORDS = [
  'jakarta',
  'persija',
  'pramono anung',
  'rano karno',
  'transjakarta',
  'jaklingko',
  'gubernur jakarta',
];

// Util: aman-kan parsing tanggal
function toIsoDate(input: any): string {
  try {
    const d = new Date(input);
    if (isNaN(+d)) return new Date().toISOString();
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// Util: buang HTML tag sederhana di deskripsi
function stripHtml(html?: string | null): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, '').trim() || null;
}

// Cek apakah teks mengandung salah satu KEYWORDS
function matchesKeywords(...texts: (string | null | undefined)[]): boolean {
  const bag = (texts.filter(Boolean).join(' ') || '').toLowerCase();
  return KEYWORDS.some((kw) => bag.includes(kw));
}

// Map satu post API ke NewsArticle
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

  // Gambar: thumbnail/enclosure jika ada
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

// Ambil satu feed
async function fetchFeed(path: string): Promise<NewsArticle[]> {
  const res = await fetch(`${BASE}${path}`, {
    // opsi ketat biar caching server Next.js wajar
    next: { revalidate: 300 }, // 5 menit
  });

  if (!res.ok) {
    // fallback: tidak mematikan seluruh agregasi
    return [];
  }

  const json = await res.json().catch(() => ({} as any));
  // Struktur API Berita Indonesia umumnya: { success, message, data:{ posts:[...] , title, ... } }
  const data = json?.data ?? {};
  const posts: any[] = Array.isArray(data?.posts) ? data.posts : [];

  const sourceName =
    (typeof data?.title === 'string' && data.title) ||
    // contoh judul sumber fallback dari path
    path.replace(/^\//, '').toUpperCase();

  return posts.map((p) => mapToArticle(p, sourceName));
}

// Public: ambil gabungan semua feed + filter keyword
export async function fetchNews(): Promise<{ articles: NewsArticle[] }> {
  const results = await Promise.all(FEEDS.map((p) => fetchFeed(p)));
  // gabung
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

// Search lokal (memakai hasil fetchNews yg sudah terfilter keywords)
export async function searchNews(q: string): Promise<{ articles: NewsArticle[] }> {
  const base = await fetchNews();
  const re = new RegExp(q, 'i');
  return {
    articles: base.articles.filter(
      (a) => re.test(a.title) || re.test(a.description ?? '')
    ),
  };
}
