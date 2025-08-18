import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NowPlayingPlayer from '@/components/NowPlayingPlayer';
import { PlayerProvider } from '@/context/PlayerContext';

export const metadata: Metadata = {
  title: 'TJ Radio Jakarta - Teman Perjalanan Kota Jakarta',
  description: 'Radio Jakarta adalah teman setia perjalanan Anda di ibu kota. Nikmati musik terkini, berita terpercaya, dan program menarik setiap hari.',
  keywords: 'radio jakarta, tj radio, radio online, berita jakarta, musik indonesia',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect untuk percepat handshake stream */}
        <link rel="preconnect" href="https://samcloud.spacial.com" />
        <link rel="dns-prefetch" href="https://samcloud.spacial.com" />
      </head>
      <body className="min-h-dvh bg-gradient-to-b from-primary-950 via-primary-900 to-primary-900 text-white font-jakarta">
        <PlayerProvider>
          <Header />
          <main className="pb-[calc(env(safe-area-inset-bottom)+96px)]">{children}</main>
          <Footer />
          {/* Portal target untuk overlay player */}
          <div id="player-portal" />
          {/* Player global yang persisten */}
          <NowPlayingPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
