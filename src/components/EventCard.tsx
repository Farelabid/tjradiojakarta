import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events";
import { formatDateRange } from "@/lib/events";
import { EVENT_PLACEHOLDER } from "@/lib/events";

export default function EventCard({ ev }: { ev: EventItem }) {
  const dateLabel = formatDateRange(ev);
  const href = `/event/${ev.slug}`;

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 backdrop-blur-sm">
      {/* Media area: seragam aspect-video */}
      <Link href={href} className="relative block">
        <div className="relative aspect-video">
          <Image
            src={ev.coverImage || ev.images?.[0] || EVENT_PLACEHOLDER}
            alt={ev.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-orange-400 text-sm">
          <Calendar size={12} />
          <span className="line-clamp-1">{dateLabel}</span>
        </div>
        {ev.location && (
          <div className="mt-1 flex items-center gap-1 text-white/65 text-sm">
            <MapPin size={12} />
            <span className="line-clamp-1">{ev.location}</span>
          </div>
        )}

        <Link href={href} className="mt-2">
          <h3 className="text-white font-semibold text-base line-clamp-2">
            {ev.title}
          </h3>
        </Link>

        {/* Deskripsi ringkas: tetap ada ruang agar tinggi kartu seragam */}
        <p className="text-white/70 text-sm mt-1 line-clamp-2 min-h-[40px]">
          {ev.shortDescription || ""}
        </p>

        {/* Spacer agar tombol selalu di bawah */}
        <div className="mt-auto" />

        {/* Tombol konsisten */}
        <Link
          href={href}
          className="mt-3 inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
