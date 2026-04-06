import React from "react";
import type { HeroSection } from "@/lib/ai-generator/schemas/hero.schema";

interface HeroSectionProps extends HeroSection {
  ctaUrl?: string;
}

export function HeroSectionBlock({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  badgeText,
  alignment,
}: HeroSectionProps) {
  const alignClass = {
    center: "items-center text-center",
    right: "items-end text-right",
    left: "items-start text-left",
  }[alignment ?? "center"];

  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-6">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, var(--p-color, #6366f1) 0%, color-mix(in srgb, var(--p-color, #6366f1) 60%, transparent) 100%)",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/20" />

      <div className={`max-w-4xl mx-auto flex flex-col gap-6 ${alignClass}`}>
        {badgeText && (
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white border border-white/30 backdrop-blur-sm w-fit"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            {badgeText}
          </span>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
          {headline}
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
          {subheadline}
        </p>

        {ctaText && (
          <a
            href={ctaUrl ?? "#offer"}
            className="inline-block mt-2 px-8 py-4 rounded-xl text-base font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "var(--s-color, #f59e0b)",
              color: "var(--p-color, #1e1e2e)",
            }}
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
