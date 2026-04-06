import React from "react";
import type { ComparisonSection } from "@/lib/ai-generator/schemas/comparison.schema";

export function ComparisonSectionBlock({
  headline,
  description,
  mode,
  items,
}: ComparisonSection) {
  return (
    <section
      className="py-14 px-6"
      style={{ background: "var(--bg-color, #ffffff)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-black text-center mb-3"
          style={{ color: "var(--h-color, #111)" }}
        >
          {headline}
        </h2>
        {description && (
          <p
            className="text-center mb-8 text-lg"
            style={{ color: "var(--t-color, #555)" }}
          >
            {description}
          </p>
        )}

        {mode === "table" ? (
          <div
            className="overflow-x-auto rounded-2xl border"
            style={{ borderColor: "var(--p-color, #6366f1)30" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--p-color, #6366f1)" }}>
                  <th className="py-3 px-4 text-white font-semibold text-start">
                    الميزة
                  </th>
                  <th className="py-3 px-4 text-white font-semibold text-start">
                    القديم
                  </th>
                  <th className="py-3 px-4 text-white font-semibold text-start">
                    مع المنتج
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td
                      className="py-3 px-4 font-medium"
                      style={{ color: "var(--h-color, #111)" }}
                    >
                      {item.label}
                    </td>
                    <td className="py-3 px-4 text-red-500">{item.before}</td>
                    <td
                      className="py-3 px-4 font-semibold"
                      style={{ color: "var(--p-color, #6366f1)" }}
                    >
                      {item.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
              >
                <div
                  className="px-4 py-2 text-sm font-semibold"
                  style={{
                    background: "var(--p-color, #6366f1)18",
                    color: "var(--p-color, #6366f1)",
                  }}
                >
                  {item.label}
                </div>
                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-gray-100">
                  <div className="p-4 bg-red-50">
                    <p className="text-xs font-semibold text-red-500 mb-1">
                      {mode === "vs_competitor" ? "المنافس" : "قبل"}
                    </p>
                    <p className="text-sm text-red-700">{item.before}</p>
                  </div>
                  <div
                    className="p-4"
                    style={{ background: "var(--p-color, #6366f1)10" }}
                  >
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: "var(--p-color, #6366f1)" }}
                    >
                      {mode === "vs_competitor" ? "منتجنا" : "بعد"}
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--h-color, #111)" }}
                    >
                      {item.after}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
