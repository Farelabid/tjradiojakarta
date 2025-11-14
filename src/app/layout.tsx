import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NowPlayingPlayer from '@/components/NowPlayingPlayer';
import { PlayerProvider } from '@/context/PlayerContext';
import BackgroundFX from '@/components/BackgroundFX';
import Script from 'next/script'; // <-- Import Next.js Script
import { Analytics } from '@vercel/analytics/react'; // <-- Import Vercel Analytics
import AnalyticsTracker from '@/components/AnalyticsTracker'; // <-- Import tracker kita
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'TJ Radio Jakarta - Teman Perjalanan Jakarta',
  description: 'TJ Radio Jakarta adalah teman setia perjalanan Anda di Jakarta. Nikmati musik terkini, berita terpercaya, dan program menarik setiap hari.',
  keywords: 'tjradio, radio jakarta, tj radio, radio online, berita jakarta, musik indonesia, teman perjalanan jakarta',
  authors: [{ name: 'TJ Radio Jakarta' }],
  creator: 'TJ Radio Jakarta',
  publisher: 'TJ Radio Jakarta',
  metadataBase: new URL('https://tjradiojakarta.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TJ Radio Jakarta - Teman Perjalanan Jakarta',
    description: 'Nikmati musik terkini, berita terpercaya, dan program menarik setiap hari.',
    url: 'https://tjradiojakarta.com',
    siteName: 'TJ Radio Jakarta',
    images: [
      {
        url: '/newlogo.png', // Pastikan path ini benar
        width: 1280,
        height: 640,
        alt: 'Logo TJ Radio Jakarta',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TJ Radio Jakarta - Teman Perjalanan Jakarta',
    description: 'Nikmati musik terkini, berita terpercaya, dan program menarik setiap hari.',
    images: ['/newlogo.png'], // Pastikan path ini benar
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest', // Anda perlu membuat file manifest ini
};

const GA_MEASUREMENT_ID = 'G-913X6XFVQ3';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="antialiased">
      <head>
        {/* Preconnect untuk percepat handshake stream */}
        <link rel="preconnect" href="https://samcloud.spacial.com" />
        <link rel="dns-prefetch" href="https://samcloud.spacial.com" />
      </head>
      <body className="min-h-dvh bg-gradient-to-b from-primary-950 via-primary-900 to-primary-900 text-white font-jakarta relative overflow-x-clip">
        {/* Dekorasi background */}
        <BackgroundFX />

        <PlayerProvider>
          <Header />
          <main className="pb-[calc(env(safe-area-inset-bottom)+96px)]">{children}</main>
          <Footer />
          {/* Portal target untuk overlay player */}
          <div id="player-portal" />
          {/* Player global yang persisten */}
          <NowPlayingPlayer />
        </PlayerProvider>

        {/* === ANALYTICS SCRIPTS === */}
        
        {/* 1. Vercel Analytics (TETAP ADA) */}
        <Analytics />
        
        {/* 2. Google Analytics (GA4) (TAMBAHAN) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="ga-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Komponen Client untuk melacak navigasi Google */}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
      </body>
    </html>
  );
}
