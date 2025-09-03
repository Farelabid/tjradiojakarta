// src/lib/api.ts
import 'server-only';
import { headers } from 'next/headers';
import type { NewsArticle } from '@/types';

/**
 * =========================
 *  KONFIG & UTILITAS
 * =========================
 */

// RSS resmi (tanpa agregator pihak ketiga)
const RSS_FEEDS: { url: string; sourceHint?: string }[] = [
  // CNN Indonesia - Nasional
  { url: 'https://www.cnnindonesia.com/nasional/rss', sourceHint: 'CNN Indonesia' },
  // CNBC Indonesia - News
  { url: 'https://www.cnbcindonesia.com/news/rss', sourceHint: 'CNBC Indonesia' },
  // ANTARA - Megapolitan (Jabodetabek)
  { url: 'https://megapolitan.antaranews.com/rss/', sourceHint: 'ANTARA Megapolitan' },
  // SINDOnews - Metro
  { url: 'https://metro.sindonews.com/rss', sourceHint: 'SINDOnews Metro' },
];

// Keyword penyaring sesuai permintaan (lowercase semua)
const KEYWORDS = [
  'jakarta',
  'persija',
  'pramono anung',
  'rano karno',
  'transjakarta',
  'jaklingko',
  'gubernur jakarta',
];

// Helpers
const decodeHtml = (s?: string | null): string | null => {
  if (!s) return null;
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gis, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim() || null;
};

const stripHtml = (html?: string | null): string | null => {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, '').trim() || null;
};

const toIsoDate = (input: any): string => {
  try {
    const d = new Date(input);
    if (isNaN(+d)) return new Date().toISOString();
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

const getTag = (xml: string, tag: string): string | null => {
  const m = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml);
  return decodeHtml(m?.[1] ?? null);
};

const getAttr = (xml: string, tag: string, attr: string): string | null => {
  const m = new RegExp(`<${tag}[^>]*\\b${attr}\\s*=\\s*"(.*?)"[^>]*\\/?>`, 'i').exec(xml);
  return decodeHtml(m?.[1] ?? null);
};

const matchesKeywords = (...texts: (string | null | undefined)[]): boolean => {
  const bag = (texts.filter(Boolean).join(' ') || '').toLowerCase();
  return KEYWORDS.some((kw) => bag.includes(kw));
};

function parseRss(xml: string, sourceHint?: string): NewsArticle[] {
  // Ambil judul channel (nama sumber fallback)
  const channelTitle =
    getTag(xml, 'title') ||
    sourceHint ||
    'Sumber RSS';

  // Pecah berdasarkan item
  const items = xml.split(/<item\b/i).slice(1).map((chunk) => {
    const itemXml = '<item' + chunk.split(/<\/item>/i)[0] + '</item>';

    const title =
      getTag(itemXml, 'title') ||
      getTag(itemXml, 'judul') ||
      '(Tanpa judul)';

    const url =
      getTag(itemXml, 'link') ||
      getTag(itemXml, 'guid') ||
      getTag(itemXml, 'url') ||
      '#';

    // Gambar: enclosure/media:content/thumbnail
    const urlToImage =
      getAttr(itemXml, 'enclosure', 'url') ||
      getAttr(itemXml, 'media:content', 'url') ||
      getAttr(itemXml, 'media:thumbnail', 'url') ||
      null;

    const description =
      stripHtml(decodeHtml(getTag(itemXml, 'description') || getTag(itemXml, 'content:encoded'))) ||
      null;

    const publishedAt = toIsoDate(
      getTag(itemXml, 'pubDate') ||
        getTag(itemXml, 'dc:date') ||
        getTag(itemXml, 'updated') ||
        getTag(itemXml, 'isoDate') ||
        getTag(itemXml, 'date')
    );

    const a: NewsArticle = {
      source: { id: null, name: channelTitle },
      author: null,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
      content: null,
    };
    return a;
  });

  return items;
}

async function fetchRssFeed(url: string, sourceHint?: string): Promise<NewsArticle[]> {
  try {
    const res = await fetch(url, {
      // Hindari konflik opsi caching: cukup no-store.
      cache: 'no-store',
      headers: {
        // Beberapa origin menolak UA default fetch; set UA sederhana.
        'User-Agent': 'TJRadioJakarta/1.0 (+https://tjradiojakarta.id)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*;q=0.1',
      },
    });

    if (!res.ok) {
      // Jangan putus seluruh agregasi bila salah satu feed error
      console.warn('[news] upstream not ok:', res.status, url);
      return [];
    }

    const xml = await res.text();
    return parseRss(xml, sourceHint);
  } catch (err) {
    console.warn('[news] fetch error:', url, err);
    return [];
  }
}

/**
 * =========================
 *  PUBLIC API
 * =========================
 */

// Ambil gabungan semua feed + filter keyword
export async function fetchNews(): Promise<{ articles: NewsArticle[] }> {
  // Membaca header sekali memaksa route jadi dinamis (opt-out full route cache).
  // Ini penting di Vercel supaya data selalu ditarik fresh.
  headers();

  const lists = await Promise.all(
    RSS_FEEDS.map((f) => fetchRssFeed(f.url, f.sourceHint))
  );
  let articles = lists.flat();

  // Filter dengan KEYWORDS (judul/desc/url)
  articles = articles.filter((a) => matchesKeywords(a.title, a.description ?? '', a.url));

  // Dedupe (URL lalu judul)
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
  articles.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return { articles };
}

// Search lokal (memakai hasil fetchNews yang sudah terfilter keywords)
export async function searchNews(q: string): Promise<{ articles: NewsArticle[] }> {
  const base = await fetchNews();
  const re = new RegExp(q, 'i');
  return {
    articles: base.articles.filter(
      (a) => re.test(a.title) || re.test(a.description ?? '')
    ),
  };
}
