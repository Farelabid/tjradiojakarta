// app/video/page.tsx
import LiveVideoEmbed from "@/components/LiveVideoEmbed";
import { Analytics } from "@vercel/analytics/next"

const AD = {
  href: "https://www.transjakarta.co.id/", // Ganti ke URL sponsor
  imgDesktop: "/ads/Desktop.png", // bisa .png
  imgMobile: "/ads/Mobile.jpg",     // bisa .png
  alt: "Iklan Sponsor",
};
  <Analytics/>
export default function VideoPage() {
  return (
    <div className="py-8 pb-[calc(env(safe-area-inset-bottom)+96px)] md:pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold text-sm">LIVE STREAMING</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Live Video</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Saksikan siaran langsung TJRadio Jakarta dalam format video.
          </p>
        </div>

        {/* Grid utama: Video (kiri) + Sidebar Iklan (kanan saat desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Kolom kiri: video & deskripsi */}
          <div className="lg:col-span-3">
            <div className="card-gradient rounded-2xl p-3">
              <LiveVideoEmbed />

              {/* Deskripsi singkat */}
              <div className="mt-6 px-2 md:px-1">
                <h2 className="text-xl font-bold text-white mb-2">
                  TJRadio Jakarta — Live Stream
                </h2>
                <p className="text-white/70">
                  Nikmati pengalaman mendengarkan radio yang lebih interaktif dengan tayangan live video kami.
                </p>
              </div>
            </div>

            {/* IKLAN MOBILE (< lg): pindah ke bawah player, 300×250 */}
            <div className="mt-4 lg:hidden">
              <a
                href={AD.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Iklan Sponsor"
                className="block w-full"
              >
                <img
                  src={AD.imgMobile}
                  alt={AD.alt}
                  width={300}
                  height={250}
                  loading="lazy"
                  className="w-full max-w-[300px] mx-auto rounded-xl ring-1 ring-white/10"
                />
              </a>
            </div>
          </div>

          {/* Kolom kanan (≥ lg): 1 slot iklan 300×600 */}
          <aside className="hidden lg:block lg:col-span-1">
            <a
              href={AD.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Iklan Sponsor"
              className="block"
            >
              <img
                src={AD.imgDesktop}
                alt={AD.alt}
                width={300}
                height={600}
                className="w-full max-w-[300px] rounded-2xl ring-1 ring-white/10"
              />
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
