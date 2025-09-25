"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

export default function EventImageGrid({
  images,
  title = "Foto event",
}: {
  images: string[];
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const slides = images.map((src) => ({ src }));

  return (
    <>
      {/* grid foto */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group block rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label={`Buka foto ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Foto ${i + 1} - ${title}`}
              width={640}
              height={360}
              loading="lazy"
              className="w-full h-40 md:h-48 object-cover group-hover:opacity-95 transition"
            />
          </button>
        ))}
      </div>

      {/* lightbox — scroll halaman TETAP aktif */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom]}                // lepas jika ingin lebih ringan
        noScroll={{ disabled: true }}   // jangan kunci body scroll
        carousel={{ imageFit: "contain" }}
      />
    </>
  );
}
