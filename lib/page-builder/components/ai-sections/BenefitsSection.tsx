import React from "react";
import type { BenefitsSection } from "@/lib/ai-generator/schemas/benefits.schema";

export function BenefitsSectionBlock({
  headline,
  description,
  benefits,
}: BenefitsSection) {
  return (
    <section
      className="py-16 px-6"
      style={{ background: "var(--bg-color, #f9fafb)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-3 p-5"
            >
              {benefit.icon && (
                <span
                  className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "color-mix(in srgb, var(--p-color, #6366f1) 10%, transparent)",
                  }}
                >
                  {benefit.icon}
                </span>
              )}
              <h3
                className="font-bold text-base"
                style={{ color: "var(--h-color, #111827)" }}
              >
                {benefit.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--t-color, #6b7280)" }}
              >
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
