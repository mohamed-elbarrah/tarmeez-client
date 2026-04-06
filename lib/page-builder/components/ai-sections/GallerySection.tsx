"use client";

import React from "react";
import Image from "next/image";
import type { GallerySection } from "@/lib/ai-generator/schemas/gallery.schema";

export function GallerySectionBlock({
  headline,
  description,
  images,
  layout,
}: GallerySection) {
  return (
    <section
      className="py-14 px-6"
      style={{ background: "var(--bg-color, #ffffff)" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-black text-center mb-3"
          style={{ color: "var(--h-color, #111)" }}
        >
          {headline}
        </h2>
        {description && (
          <p
            className="text-center mb-10"
            style={{ color: "var(--t-color, #555)" }}
          >
            {description}
          </p>
        )}

        <div
          className={
            layout === "masonry"
              ? "columns-2 md:columns-3 gap-4 space-y-4"
              : "grid grid-cols-2 md:grid-cols-3 gap-4"
          }
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden shadow-sm relative aspect-square bg-gray-100"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 px-3 py-2 text-xs text-white bg-black/40">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
