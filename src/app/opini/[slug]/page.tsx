// app/opini/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOpinis, getOpiniBySlug } from "@/lib/opini";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getOpinis().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getOpiniBySlug(params.slug);
  if (!data) return {};
  return {
    title: `${data.title} - Opini TJ Radio Jakarta`,
    description: data.body.replace(/\s+/g, " ").slice(0, 160),
  };
}

export default function OpiniDetailPage({ params }: Props) {
  const data = getOpiniBySlug(params.slug);
  if (!data) return notFound();

  const dateLabel = new Date(data.date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const paragraphs = data.body.split(/\n\s*\n/);

  return (
    <div className="pt-6 md:pt-10 pb-[calc(env(safe-area-inset-bottom)+116px)] md:pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-5 text-sm">
            <Link
              href="/opini"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition"
            >
              <span aria-hidden>←</span>
              Kembali ke Opini
            </Link>
          </div>

          <article className="rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-xl shadow-black/20 backdrop-blur-sm p-6 md:p-8">
            <div className="text-[11px] md:text-xs font-semibold tracking-wide uppercase text-orange-300">
              {dateLabel}
            </div>

            <h1 className="mt-1 text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {data.title}
            </h1>

            {data.author && (
              <div className="mt-1 text-sm md:text-base text-white/70">
                Oleh {data.author}
              </div>
            )}

{data.imageUrl && (
  <figure className="mt-6 md:float-left md:mr-6 md:mb-2">
    <img
      src={data.imageUrl}
      alt={data.imageAlt || "Foto"}
      loading="lazy"
      decoding="async"
      className="h-auto w-[200px] md:w-[240px] lg:w-[280px] object-contain rounded-xl ring-1 ring-white/10 shadow-md shadow-black/20 mx-auto md:mx-0"
      sizes="(min-width: 1024px) 280px, (min-width: 768px) 240px, 200px"
    />
    {data.imageCaption && (
      <figcaption className="mt-2 text-[11px] text-white/60 text-center md:text-left">
        {data.imageCaption}
      </figcaption>
    )}
  </figure>
)}


            {/* Isi artikel, tanpa drop-cap */}
            <div
  className="
    prose prose-invert prose-base md:prose-lg xl:prose-xl
    max-w-[68ch] md:max-w-[72ch]   /* 50–75 CPL = nyaman dibaca */
    prose-p:my-3 md:prose-p:my-4   /* jeda antar paragraf */
    prose-p:leading-[1.75]         /* line-height ~1.7 */
    prose-p:text-white/90
    prose-a:text-orange-300 hover:prose-a:text-orange-200
    prose-strong:text-white
    text-justify
    [text-wrap:pretty]             /* kurangi widow/orphan */
    [hyphens:auto] [-webkit-hyphens:auto]
    prose-p:break-words
    selection:bg-orange-500/30 selection:text-white
  "
>
              {paragraphs.map((p, i) => (
                <p key={i}>{p.trim()}</p>
              ))}
            </div>

            {data.sourceUrl && (
              <div className="mt-8 text-sm md:text-base text-white/70">
                Sumber asli:{" "}
                <a
                  href={data.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-300 hover:text-orange-200 underline underline-offset-4"
                >
                  {new URL(data.sourceUrl).hostname}
                </a>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
