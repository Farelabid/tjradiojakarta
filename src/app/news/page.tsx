// src/app/news/page.tsx
import { Suspense } from 'react';
import NewsCard from '@/components/NewsCard';
import { fetchNews } from '@/lib/api';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

interface NewsPageProps {
  searchParams: { category?: string };
}

function NewsLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6 mb-8 bg-white/5 ring-1 ring-white/10 backdrop-blur-sm animate-pulse">
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
        {Array.from({ length: 9 }).map((_, i) => (
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

async function NewsContent({ category }: { category?: string }) {
  // Jika user tidak memilih, kategori default tetap "indonesia/jakarta"
  const newsData = await fetchNews();


  if (!newsData.articles.length) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 mb-4">
          <TrendingUp size={48} className="mx-auto mb-4" />
          <p>Tidak ada berita yang ditemukan untuk kategori ini.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <NewsCard article={newsData.articles[0]} featured />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData.articles.slice(1).map((article) => (
          <NewsCard key={article.url} article={article} />
        ))}
      </div>
    </>
  );
}

export default function NewsPage({ searchParams }: NewsPageProps) {
  const { category } = searchParams;

  const categories = [{ id: 'jakarta', label: 'Jakarta', icon: TrendingUp }];


  return (
    <div className="py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Berita Jakarta</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Kumpulan berita terbaru seputar Jakarta
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => {
            const isActive = (category || 'indonesia/jakarta') === cat.id;
            return (
              <Link
                key={cat.id}
                href={`/news?category=${cat.id}`}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-primary-800/50 text-white/70 hover:bg-primary-700/50 hover:text-white'
                }`}
              >
                <cat.icon size={16} />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>

        <Suspense fallback={<NewsLoadingSkeleton />}>
          <NewsContent category={category} />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const { category } = searchParams;
  const categoryNames: { [key: string]: string } = {
    'indonesia/jakarta': 'Jakarta',
  };
  const resolved = category || 'indonesia/jakarta';
  const title = `Berita ${categoryNames[resolved] ?? resolved} - TJ Radio Jakarta`;
  const description = `Baca berita terbaru seputar ${categoryNames[resolved] ?? resolved} di TJ Radio Jakarta`;
  return { title, description };
}
