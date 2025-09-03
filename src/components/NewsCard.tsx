"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ExternalLink } from 'lucide-react';
import { NewsArticle } from '@/types';
import { useState } from 'react';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const [imgSrc, setImgSrc] = useState(article.urlToImage || '/placeholder-news.jpg');
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (featured) {
    return (
      <div className="rounded-2xl p-6 mb-8 bg-white/5 ring-1 ring-white/10 backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden">
            <Image
              src={imgSrc}
              alt={article.title}
              fill
              className="object-cover"
              onError={() => {
                if (imgSrc !== '/placeholder-news.jpg') setImgSrc('/placeholder-news.jpg');
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2 text-orange-400 text-sm mb-3">
              <Calendar size={16} />
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.source.name}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h2>
            {article.description && (
              <p className="text-white/80 text-base lg:text-lg mb-6 line-clamp-3">
                {article.description}
              </p>
            )}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors w-fit"
            >
              <span>Baca Selengkapnya</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden hover:scale-[1.02] transition-transform bg-white/5 ring-1 ring-white/10 backdrop-blur-sm">
      <div className="relative h-48">
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          className="object-cover"
          onError={() => {
            if (imgSrc !== '/placeholder-news.jpg') setImgSrc('/placeholder-news.jpg');
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 text-orange-400 text-sm mb-2">
          <Calendar size={14} />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-2">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-white/70 text-sm line-clamp-2 mb-3">
            {article.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">{article.source.name}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}