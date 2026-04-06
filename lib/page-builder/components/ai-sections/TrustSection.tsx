import React from "react";
import type { TrustSection } from "@/lib/ai-generator/schemas/trust.schema";

export function TrustSectionBlock({ headline, stats, badges }: TrustSection) {
  return (
    <section
      className="py-14 px-6"
      style={{ background: "var(--p-color, #6366f1)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-center text-white mb-10">
          {headline}
        </h2>

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {badges && badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white border border-white/30"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {badge.icon && <span>{badge.icon}</span>}
                {badge.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
