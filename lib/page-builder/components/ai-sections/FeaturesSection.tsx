import React from "react";
import type { FeaturesSection } from "@/lib/ai-generator/schemas/features.schema";

export function FeaturesSectionBlock({
  headline,
  description,
  features,
  layout,
}: FeaturesSection) {
  const gridClass =
    layout === "list"
      ? "flex flex-col gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";

  return (
    <section className="py-16 px-6 bg-[var(--bg-color,#ffffff)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-black mb-3"
            style={{ color: "var(--h-color, #111827)" }}
          >
            {headline}
          </h2>
          {description && (
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: "var(--t-color, #6b7280)" }}
            >
              {description}
            </p>
          )}
        </div>

        <div className={gridClass}>
          {features.map((feature, i) => (
            <FeatureCard key={i} layout={layout ?? "grid"} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  layout,
}: {
  icon?: string;
  title: string;
  description: string;
  layout: string;
}) {
  if (layout === "alternating") {
    return (
      <div
        className="flex gap-4 p-6 rounded-2xl border"
        style={{ borderColor: "var(--border-color, #e5e7eb)" }}
      >
        {icon && <span className="text-3xl shrink-0">{icon}</span>}
        <div>
          <h3
            className="font-bold mb-1"
            style={{ color: "var(--h-color, #111827)" }}
          >
            {title}
          </h3>
          <p className="text-sm" style={{ color: "var(--t-color, #6b7280)" }}>
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-3 p-6 rounded-2xl border hover:shadow-md transition-shadow"
      style={{ borderColor: "var(--border-color, #e5e7eb)" }}
    >
      {icon && (
        <span
          className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl"
          style={{
            background:
              "color-mix(in srgb, var(--p-color, #6366f1) 10%, transparent)",
          }}
        >
          {icon}
        </span>
      )}
      <h3
        className="font-bold text-base"
        style={{ color: "var(--h-color, #111827)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--t-color, #6b7280)" }}
      >
        {description}
      </p>
    </div>
  );
}
