import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAll, bySlug, jsonLd, formatDateRange } from "@/lib/events";
import EventLightbox from "@/components/LightboxMedia";
import EventImageGrid from "@/components/EventImageGrid";

export async function generateStaticParams() {
  return getAll().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const ev = bySlug(params.slug);
  if (!ev) return { title: "Event tidak ditemukan" };

  const images = [ev.coverImage, ...(ev.images || [])].filter(Boolean) as string[];
  const desc =
    ev.shortDescription ||
    ev.description?.slice(0, 160) ||
    `${ev.title} - ${formatDateRange(ev)}`;

  return {
    title: `${ev.title} - Event TJ Radio Jakarta`,
    description: desc,
    openGraph: {
      title: ev.title,
      description: desc,
      images: images.length ? images : undefined,
      type: "article",
    },
    alternates: { canonical: `/event/${ev.slug}` },
  };
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const ev = bySlug(params.slug);
  if (!ev) return notFound();

  const dateLabel = formatDateRange(ev);
  const heroYouTube = ev.youtubeIds?.[0];
  const heroFile = ev.videoUrls?.[0];
  const heroPoster = ev.coverImage || ev.images?.[0];

  // Untuk lightbox (preview selalu landscape, rasio di modal pakai preferensi event)
  const aspect = ev.mediaAspect ?? "16/9";
  const fit = ev.mediaFit ?? (aspect === "9/16" ? "contain" : "cover");

  const json = JSON.stringify(jsonLd(ev));

  return (
    <div className="pt-6 md:pt-10 pb-[calc(env(safe-area-inset-bottom)+116px)] md:pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />

          <div className="mb-5 text-sm">
            <Link
              href="/event"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition"
            >
              <span aria-hidden>←</span> Kembali ke Event
            </Link>
          </div>

          <article className="rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-xl shadow-black/20 backdrop-blur-sm p-6 md:p-8">
            <div className="text-[11px] md:text-xs font-semibold tracking-wide uppercase text-orange-300">
              {dateLabel}
              {ev.location ? ` • ${ev.location}` : ""}
            </div>
            <h1 className="mt-1 text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {ev.title}
            </h1>
            {ev.subtitle && <p className="text-white/80 mt-1">{ev.subtitle}</p>}
            {ev.statusNote && <p className="text-white/70 mt-1">{ev.statusNote}</p>}

            {(heroYouTube || heroFile || heroPoster) && (
              <div className="mt-6">
                <EventLightbox
                  youtubeIds={ev.youtubeIds}
                  fileSrc={ev.videoUrls?.[0]}
                  poster={heroPoster}
                  aspect={ev.mediaAspect ?? "16/9"}
                  fit={ev.mediaFit ?? (ev.mediaAspect === "9/16" ? "contain" : "cover")}
                  className=""
                />
              </div>
            )}

            {/* Deskripsi: dibuat justify untuk kenyamanan baca */}
            {ev.description && (
              <div
                className="prose prose-invert prose-base md:prose-lg max-w-none mt-6 prose-p:my-4 leading-relaxed"
                style={{ textAlign: "justify", textJustify: "inter-word" }}
              >
                {ev.description.split(/\n\s*\n/).map((p, i) => (
                  <p key={i}>{p.trim()}</p>
                ))}
              </div>
            )}

            {(ev.registrationUrl || ev.ticketUrl) && (
              <div className="mt-6">
                <a
                  href={ev.registrationUrl || ev.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {ev.ctaLabel || "Info & Daftar"}
                </a>
              </div>
            )}

            {ev.images && ev.images.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Poster & Foto
                </h2>

                {/* klik foto => lightbox, tidak buka tab */}
                <EventImageGrid images={ev.images} title={ev.title} />
              </section>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
