import React from "react";
import type { OfferSection } from "@/lib/ai-generator/schemas/offer.schema";
import type { FinalCtaSection } from "@/lib/ai-generator/schemas/final-cta.schema";

// ─── Offer Section (pricing + CTA) ────────────────────────────
export function OfferSectionBlock({
  headline,
  description,
  price,
  originalPrice,
  currency,
  ctaText,
  urgencyText,
  bulletPoints,
}: OfferSection) {
  const currencySymbol = currency === "SAR" ? "ر.س" : currency;

  return (
    <section
      id="offer"
      className="py-16 px-6"
      style={{ background: "var(--p-color, #6366f1)" }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          {headline}
        </h2>

        {description && (
          <p className="text-white/80 text-base mb-6">{description}</p>
        )}

        {/* Price block */}
        <div className="inline-flex flex-col items-center gap-1 mb-6">
          {originalPrice && (
            <span className="line-through text-white/50 text-xl">
              {originalPrice} {currencySymbol}
            </span>
          )}
          <span className="text-5xl font-black text-white">
            {price}
            <span className="text-2xl font-normal ml-1">{currencySymbol}</span>
          </span>
        </div>

        {/* Bullet points */}
        {bulletPoints && bulletPoints.length > 0 && (
          <ul className="text-right mb-6 space-y-2 max-w-xs mx-auto">
            {bulletPoints.map((point, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-white/90 text-sm"
              >
                <span className="text-green-300 shrink-0">✓</span>
                {point}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <a
          href="#"
          className="inline-block px-10 py-4 rounded-xl text-base font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
          style={{
            background: "var(--s-color, #f59e0b)",
            color: "var(--p-color, #1e1e2e)",
          }}
        >
          {ctaText}
        </a>

        {urgencyText && (
          <p className="mt-4 text-white/70 text-sm font-medium">
            {urgencyText}
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Final CTA Section (closing banner) ───────────────────────
export function FinalCtaSectionBlock({
  headline,
  subheadline,
  ctaText,
  guaranteeText,
  ctaUrl,
}: FinalCtaSection) {
  return (
    <section className="py-16 px-6 bg-[var(--bg-color,#f9fafb)]">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-black mb-4"
          style={{ color: "var(--h-color, #111827)" }}
        >
          {headline}
        </h2>

        {subheadline && (
          <p
            className="text-base md:text-lg mb-8"
            style={{ color: "var(--t-color, #6b7280)" }}
          >
            {subheadline}
          </p>
        )}

        <a
          href={ctaUrl ?? "#offer"}
          className="inline-block px-10 py-4 rounded-xl text-base font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-white"
          style={{ background: "var(--p-color, #6366f1)" }}
        >
          {ctaText}
        </a>

        {guaranteeText && (
          <p
            className="mt-5 text-sm flex items-center justify-center gap-1.5"
            style={{ color: "var(--t-color, #6b7280)" }}
          >
            <span>🔒</span>
            {guaranteeText}
          </p>
        )}
      </div>
    </section>
  );
}
