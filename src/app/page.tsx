import Link from 'next/link';
import Image from "next/image";
import { Instagram, TrendingUp } from 'lucide-react';
import { FaWhatsapp, FaTiktok } from 'react-icons/fa';
import NewsCard from '@/components/NewsCard';
import { fetchNews } from '@/lib/api'; // fetchNews berjalan di server
import ProgramToday from '@/components/ProgramToday';
import { Suspense } from 'react';
import SoftOpeningMarquee from "@/components/SoftOpeningMarquee";
import { Analytics } from "@vercel/analytics/next";
import { SmoothWaveform } from '@/components/ReactiveWaveform'; // <-- Import langsung dari file yang ada

export const dynamic = 'force-dynamic';

// Konstanta link
const WA_LINK =
  "https://wa.me/6288973077301?text=" +
  encodeURIComponent("Halo TJ Radio! Saya ingin berbagi info / request lagu / curhat😄");
const IG_LINK = "https://www.instagram.com/tjradio.jakarta/";
const TIKTOK_LINK = "https://www.tiktok.com/@tjradio.jakarta";

// --- Komponen Berita (tetap sama, berjalan di server) ---
function NewsLoadingSkeleton() {
  // ... (kode skeleton tetap sama) ...
  return (
    <div className="space-y-6">
      <div className="card-gradient rounded-2xl p-6 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 lg:h-80 bg-primary-700/30 rounded-xl"></div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="h-4 bg-primary-700/30 rounded w-1/3"></div>
            <div className="h-8 bg-primary-700/30 rounded w-full"></div>
            <div className="h-4 bg-primary-700/30 rounded w-2/3"></div>
            <div className="h-10 bg-primary-700/30 rounded w-40"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-gradient rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-primary-700/30"></div>
            <div className="p-4 space-y-3">
              <div className="h-3 bg-primary-700/30 rounded w-1/3"></div>
              <div className="h-4 bg-primary-700/30 rounded w-full"></div>
              <div className="h-3 bg-primary-700/30 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function NewsSection() {
  // Error akan otomatis ditangkap oleh error.tsx terdekat jika ada
  let newsData;
  let error: string | null = null;
  try {
     newsData = await fetchNews();
  } catch (err: any) {
    console.error("Gagal memuat berita (server):", err);
    error = err.message || "Gagal memuat berita.";
    newsData = { articles: [] };
  }

  if (error) {
     return <div className="text-center text-red-400 py-10">{error}</div>;
  }
   if (!newsData || newsData.articles.length === 0) {
       return <div className="text-center text-white/60 py-10">Tidak ada berita ditemukan.</div>;
   }

  const featuredNews = newsData.articles.slice(0, 1);
  const latestNews = newsData.articles.slice(1, 7);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Berita Jakarta</h2>
          <Link
            href="/news?category=indonesia/jakarta"
            className="text-orange-400 hover:text-orange-300"
          >
            Lihat semua
          </Link>
        </div>

        {featuredNews.length > 0 && (
          <div className="mb-6">
            <NewsCard article={featuredNews[0]} featured />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((article) => (
            <NewsCard key={article.url} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
// --- Akhir Komponen Berita ---


// Komponen Halaman Utama (Server Component)
export default function HomePage() {
  const menuItems = [
    { icon: TrendingUp, title: 'Traffic Report', description: 'Laporan lalu lintas terkini', href: '/traffic' },
    { icon: FaWhatsapp, title: "Music Requests", description: "Request lagu favorit", href: WA_LINK },
    { icon: FaTiktok, title: "Live Tiktok", description: "Tonton siaran live kami", href: TIKTOK_LINK },
    { icon: Instagram, title: "Instagram", description: "Follow kami di Instagram", href: IG_LINK },
  ];

  return (
    <div className="pb-20 md:pb-8">
      {/* Marquee (Server Component OK) */}
      <SoftOpeningMarquee
          dateText="TJ RADIO JAKARTA - SUDAH MENGUDARA!"
          hosts={[
            "Indy Rahmawati", "Irwan Ardian", "Rio Octavianus", "Luviana Dewi",
            "OT Syech", "Saodah", "Nayla Lestari", "Almira Risanti", "Abi Saat",
            "Hatma Prakoso", "McDanny", "Reno Fenady", "Cak Lontong", "Eko Kuntadi",
            "Akbar Kobar", "Denny Chandra", "Mo Sidik", "MazdjoPray",
          ]}
      />

      {/* Hero Section */}
      <section className="relative py-6 md:py-10 overflow-hidden">
        {/* Background (Server Component OK) */}
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
          {/* ... (kode background tetap sama) ... */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(249,115,22,0.10),transparent_55%),radial-gradient(ellipse_at_85%_15%,rgba(56,189,248,0.10),transparent_40%)]" />
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
             <Image
               src="/jakarta.png" alt="" width={1600} height={500} priority sizes="100vw"
               className="max-w-none w-[96vw] sm:w-[92vw] md:w-[78vw] lg:w-[68vw] xl:w-[60vw] opacity-40 sm:opacity-35 md:opacity-30 object-contain"
             />
           </div>
           <div className="absolute inset-x-0 bottom-0 h-28 md:h-40 bg-gradient-to-b from-transparent to-[#020617]/90" />
        </div>

        {/* Konten Hero */}
        <div className="container mx-auto px-4">
          {/* Logo (Server Component OK) */}
          <div className="flex justify-center">
            <Image
              src="/newlogo.png" alt="TJRadio Jakarta" width={1280} height={640}
              className="mx-auto my-2 sm:my-3 md:my-4 w-64 sm:w-72 md:w-80 lg:w-[24rem] xl:w-[28rem] max-w-[88vw] h-auto"
            />
          </div>
          <div className="text-center mb-12">
            {/* === Gunakan Komponen Client Waveform === */}
            {/* Memanggil Client Component dari Server Component */}
            <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mb-8 mt-4">
                 <SmoothWaveform height={40} barCount={40} />
            </div>
            {/* === Akhir Waveform === */}

            {/* Menu Items (Server Component OK) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {menuItems.map((item, index) => (
                <Link
                  key={index} href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : "_self"}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : ""}
                  className="rounded-xl p-4 hover:scale-105 transition-transform bg-white/5 hover:bg-white/10 ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <item.icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-white/60 text-xs">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Analytics/>

      {/* Program Hari Ini (Client Component, dipanggil dari Server Component OK) */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Program Hari Ini</h2>
            <Link href="/live" className="text-orange-400 hover:text-orange-300 text-sm">
              Lihat Semua
            </Link>
          </div>
          <ProgramToday />
        </div>
      </section>

      {/* Bagian berita (SSR) dengan Suspense */}
      <Suspense fallback={<NewsLoadingSkeleton />}>
        <NewsSection />
      </Suspense>

    </div>
  );
}

