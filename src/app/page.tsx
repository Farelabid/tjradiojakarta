import Link from 'next/link';
import Image from "next/image";
import { Play, Calendar, Mic, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { fetchNews } from '@/lib/api';
import ProgramToday from '@/components/ProgramToday';
import { Suspense } from 'react';
import SoftOpeningMarquee from "@/components/SoftOpeningMarquee";
import Countdown from "@/components/Countdown";
import SoftOpeningLaunchButton from "@/components/SoftOpeningLaunchButton";
import { Analytics } from "@vercel/analytics/next"

const WA_LINK =
  "https://wa.me/6288973077301?text=" +
  encodeURIComponent("Halo TJ Radio! Saya ingin berbagi info / request lagu / curhat😄");

const IG_LINK = "https://www.instagram.com/tjradio.jakarta/";


function NewsLoadingSkeleton() {
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
  const newsData = await fetchNews();
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

export default function HomePage() {
  const menuItems = [
    { icon: TrendingUp, title: 'Traffic Report', description: 'Laporan lalu lintas terkini', href: '/traffic' },
    {
    icon: Mic,
    title: "Music Requests",
    description: "Request lagu favorit",
    href: WA_LINK, 
  },
  {
    icon: Users,
    title: "Listener Club",
    description: "Komunitas pendengar",
    href: IG_LINK, 
  },
  {
    icon: ShoppingBag,
    title: "Official Merch",
    description: "Merchandise resmi",
    href: IG_LINK,
  },
  ];

  return (
    <div className="pb-20 md:pb-8">
      <SoftOpeningMarquee
  dateText="TJ RADIO JAKARTA - SUDAH MENGUDARA!"
  hosts={[
    "Cak Lontong",
    "Reno Fenady",
    "Eko Kuntadi",
    "Indy Rahmawati",
    "Akbar Kobar",
    "McDanny",
    "Denny Chandra",
    "Irwan Ardian",
    "Mo Sidik",
    "MazdjoPray",
  ]}
/>

  <section className="relative py-6 md:py-10 overflow=hidden">
{/* === BACKGROUND OVERLAY (SKYLINE) — versi fix === */}
  <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
    {/* lighting halus */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(249,115,22,0.10),transparent_55%),radial-gradient(ellipse_at_85%_15%,rgba(56,189,248,0.10),transparent_40%)]" />
{/* skyline: selalu nempel bawah & center */}
<div className="absolute bottom-0 left-1/2 -translate-x-1/2">
  <Image
    src="/jakarta.png"
    alt=""
    width={1600}
    height={500}
    priority
    sizes="100vw"
    className="
      max-w-none
      w-[96vw]        /* 🔼 mobile dibesarkan */
      sm:w-[92vw]
      md:w-[78vw]
      lg:w-[68vw]
      xl:w-[60vw]
      opacity-40 sm:opacity-35 md:opacity-30
      object-contain
    "
  />
</div>

    {/* gelapkan bawah agar kartu tetap kontras */}
    <div className="absolute inset-x-0 bottom-0 h-28 md:h-40 bg-gradient-to-b from-transparent to-[#020617]/90" />
  </div>


  <div className="container mx-auto px-4">
    <div className="flex justify-center">
      <Image
        src="/newlogo.png"
        alt="TJRadio Jakarta"
        width={1280}
        height={640}
        className="mx-auto my-2 sm:my-3 md:my-4 w-64 sm:w-72 md:w-80 lg:w-[24rem] xl:w-[28rem] max-w-[88vw] h-auto"
      />
    </div>
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        TJRadio <span className="text-orange-500">Jakarta</span>
      </h1>
      <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
        Teman Perjalanan Jakarta
      </p>
      <div className="mb-6">
</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
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

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Program Hari Ini</h2>
            <Link href="/live" className="text-orange-400 hover:text-orange-300 text-sm">
              Lihat Semua
            </Link>
          </div>

          {/* Kartu Program Hari Ini (realtime, ambil dari schedule.ts) */}
          <ProgramToday />
        </div>
      </section>


      <Suspense fallback={<NewsLoadingSkeleton />}>
        <NewsSection />
      </Suspense>
      
      {/* NowPlayingPlayer tidak lagi dipanggil di sini, karena sudah ada di layout */}
    </div>
  );
}