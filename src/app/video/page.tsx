// app/video/page.tsx
import LiveVideoEmbed from "@/components/LiveVideoEmbed";

/** Placeholder box untuk slot iklan */
function AdBox({
  label = "IKLAN",
  note,
  className = "",
}: {
  label?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm",
        "flex items-center justify-center text-center text-white/80",
        className,
      ].join(" ")}
      aria-label="Placeholder Iklan"
    >
      <div>
        <div className="text-xs tracking-widest font-semibold text-orange-300">
          {label}
        </div>
        {note && <div className="text-[11px] mt-1 text-white/60">{note}</div>}
      </div>
    </div>
  );
}

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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Live Video
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Saksikan siaran langsung TJRadio Jakarta dalam format video.
          </p>
        </div>

        {/* Grid utama: Video + Sidebar iklan */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Kolom kiri: video */}
          <div className="lg:col-span-3">
            <div className="card-gradient rounded-2xl p-3">
              <LiveVideoEmbed />

              {/* Deskripsi singkat */}
              <div className="mt-6 px-2 md:px-1">
                <h2 className="text-xl font-bold text-white mb-2">
                  TJRadio Jakarta — Live Stream
                </h2>
                <p className="text-white/70">
                  Nikmati pengalaman mendengarkan radio yang lebih interaktif
                  dengan tayangan live video kami.
                </p>
              </div>
            </div>

            {/* Banner iklan (hanya mobile/tablet) */}
            <div className="mt-4 lg:hidden">
              <AdBox note="728×90 / 320×100" className="h-24" />
            </div>
          </div>

          {/* Kolom kanan: ganti live chat dengan slot iklan */}
          <aside className="space-y-4">
            <AdBox note="300×250" className="h-[250px]" />
            <AdBox note="300×600" className="h-[600px] hidden md:flex" />
          </aside>
        </div>
      </div>
    </div>
  );
}
