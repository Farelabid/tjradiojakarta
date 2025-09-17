// app/opini/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getOpinis, getExcerpt } from "@/lib/opini";

export const metadata: Metadata = {
  title: "Opini - TJ Radio Jakarta",
  description: "Kumpulan opini pilihan dari TJ Radio Jakarta.",
};

export default function OpiniPage() {
  const items = getOpinis();

  return (
    <div className="pt-6 md:pt-10 pb-[calc(env(safe-area-inset-bottom)+116px)] md:pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Opini</h1>
          <p className="text-white/70 mt-2">Tulisan pilihan, diperbarui mingguan.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {items.map((it) => (
            <Link
              key={it.slug}
              href={`/opini/${it.slug}`}
              className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 hover:bg-white/10 transition-colors shadow-lg shadow-black/10"
            >
              <div className="text-[11px] font-semibold tracking-wide uppercase text-orange-300">
                {new Date(it.date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <h2 className="mt-1 text-lg md:text-xl font-bold text-white group-hover:text-white">
                {it.title}
              </h2>

              {it.author && (
                <div className="text-sm text-white/60 mt-0.5">Oleh {it.author}</div>
              )}

              <p className="text-white/70 text-sm mt-3 line-clamp-3 md:line-clamp-4">
                {getExcerpt(it.body, 40)}
              </p>

              <div className="mt-4 text-orange-300 text-sm font-semibold">
                Baca selengkapnya →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
