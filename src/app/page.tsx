import Link from 'next/link';
import Image from "next/image";
import { Play, Calendar, Mic, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { fetchNews } from '@/lib/api';
import ProgramToday from '@/components/ProgramToday';
import { Suspense } from 'react';

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
    { icon: Mic, title: 'Music Requests', description: 'Request lagu favorit', href: '/request' },
    { icon: Users, title: 'Listener Club', description: 'Komunitas pendengar', href: '/community' },
    { icon: ShoppingBag, title: 'Official Merch', description: 'Merchandise resmi', href: '/merch' }
  ];

  return (
    <div className="pb-20 md:pb-8">
      <section className="relative py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <Image
              src="/newlogo.png"
              alt="TJRadio Jakarta"
              width={1280}
              height={640}
              className="h-40 w-auto md:h-48 lg:h-56 drop-shadow-lg mb-6 md:mb-8"
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
              priority
            />
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              TJRadio <span className="text-orange-500">Jakarta</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              Teman Perjalanan Jakarta
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href} className="rounded-xl p-4 hover:scale-105 transition-transform bg-white/5 hover:bg-white/10 ring-1 ring-white/10 backdrop-blur-sm">
                  <item.icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-white/60 text-xs">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

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