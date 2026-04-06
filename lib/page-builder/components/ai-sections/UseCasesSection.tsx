import React from "react";
import type { UseCasesSection } from "@/lib/ai-generator/schemas/use-cases.schema";

export function UseCasesSectionBlock({
  headline,
  description,
  cases,
}: UseCasesSection) {
  return (
    <section
      className="py-14 px-6"
      style={{ background: "var(--s-color, #f8f8ff)" }}
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
            className="text-center mb-10 text-lg"
            style={{ color: "var(--t-color, #555)" }}
          >
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 shadow-sm border border-gray-100 bg-white"
            >
              {c.icon && (
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: "var(--p-color, #6366f1)18" }}
                >
                  {c.icon}
                </div>
              )}
              {c.persona && (
                <p
                  className="text-xs font-semibold mb-2 px-2 py-1 rounded-full inline-block"
                  style={{
                    background: "var(--p-color, #6366f1)18",
                    color: "var(--p-color, #6366f1)",
                  }}
                >
                  {c.persona}
                </p>
              )}
              <h3
                className="text-base font-bold mb-2"
                style={{ color: "var(--h-color, #111)" }}
              >
                {c.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--t-color, #555)" }}
              >
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
