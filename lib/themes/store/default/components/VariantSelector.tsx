"use client";

import React from "react";
import { ProductOption, ProductVariant } from "@/lib/themes/types";

interface Props {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onSelect: (optionName: string, value: string) => void;
}

/**
 * Returns true if choosing `optionName = VALUE` alongside the already-selected
 * options would still match at least one active variant (even if that variant
 * has zero stock — we display it disabled but visible).
 */
function isValueAvailable(
  optionName: string,
  value: string,
  selectedOptions: Record<string, string>,
  variants: ProductVariant[],
): boolean {
  const trial = { ...selectedOptions, [optionName]: value };
  return variants.some(
    (v) =>
      v.isActive &&
      Object.entries(trial).every(([optName, optVal]) =>
        v.optionValues.some((ov) => {
          // We need to find the parent option name to match
          // optionValue.value = the display string; but we don't have optionName
          // in ProductVariantValue directly. We rely on the parent option lookup
          // that is done in the component below via the passed `options` array.
          return ov.optionValue.value === optVal;
        }),
      ),
  );
}

function isValueInStock(
  optionName: string,
  value: string,
  selectedOptions: Record<string, string>,
  variants: ProductVariant[],
): boolean {
  const trial = { ...selectedOptions, [optionName]: value };
  return variants.some(
    (v) =>
      v.isActive &&
      v.quantity > 0 &&
      Object.values(trial).every((optVal) =>
        v.optionValues.some((ov) => ov.optionValue.value === optVal),
      ),
  );
}

/** Comprehensive Arabic + English color name → hex map */
const COLOR_MAP: Record<string, string> = {
  // reds
  أحمر: "#ef4444",
  red: "#ef4444",
  crimson: "#dc143c",
  قرمزي: "#dc143c",
  maroon: "#800000",
  كستنائي: "#800000",
  coral: "#ff6b6b",
  مرجاني: "#ff6b6b",
  salmon: "#fa8072",
  سلموني: "#fa8072",
  // pinks
  وردي: "#ec4899",
  pink: "#ec4899",
  hotpink: "#ff69b4",
  زهري: "#ff69b4",
  rose: "#f43f5e",
  ورد: "#f43f5e",
  magenta: "#d946ef",
  فوشيا: "#d946ef",
  // oranges
  برتقالي: "#f97316",
  orange: "#f97316",
  peach: "#ffb347",
  خوخي: "#ffb347",
  // yellows
  أصفر: "#eab308",
  yellow: "#eab308",
  amber: "#f59e0b",
  عنبري: "#f59e0b",
  لايم: "#84cc16",
  lime: "#84cc16",
  // greens
  أخضر: "#22c55e",
  green: "#22c55e",
  teal: "#14b8a6",
  زمردي: "#10b981",
  emerald: "#10b981",
  خضراء: "#22c55e",
  زيتوني: "#65a30d",
  olive: "#65a30d",
  mint: "#6ee7b7",
  نعناعي: "#6ee7b7",
  forest: "#166534",
  غابات: "#166534",
  // blues
  أزرق: "#3b82f6",
  blue: "#3b82f6",
  سماوي: "#06b6d4",
  cyan: "#06b6d4",
  كحلي: "#1e40af",
  navy: "#1e40af",
  sky: "#0ea5e9",
  سكاي: "#0ea5e9",
  indigo: "#6366f1",
  نيلي: "#6366f1",
  cobalt: "#1e3a8a",
  كوبالت: "#1e3a8a",
  turquoise: "#2dd4bf",
  فيروزي: "#2dd4bf",
  aqua: "#22d3ee",
  أكوا: "#22d3ee",
  // purples & violets
  بنفسجي: "#a855f7",
  purple: "#a855f7",
  violet: "#7c3aed",
  بنفسجي_غامق: "#5b21b6",
  lavender: "#c4b5fd",
  خزامى: "#c4b5fd",
  lilac: "#d8b4fe",
  لايلك: "#d8b4fe",
  plum: "#7e22ce",
  برقوقي: "#7e22ce",
  // neutrals
  أبيض: "#ffffff",
  white: "#ffffff",
  cream: "#fef9c3",
  كريمي: "#fefce8",
  ivory: "#fffff0",
  عاجي: "#fffff0",
  offwhite: "#f8fafc",
  أوف_وايت: "#f8fafc",
  أسود: "#000000",
  black: "#000000",
  charcoal: "#374151",
  فحمي: "#374151",
  رمادي: "#6b7280",
  gray: "#6b7280",
  grey: "#6b7280",
  silver: "#9ca3af",
  فضي: "#9ca3af",
  slate: "#64748b",
  ardoise: "#64748b",
  darkgray: "#374151",
  lightgray: "#d1d5db",
  رمادي_فاتح: "#d1d5db",
  // browns & earth tones
  بني: "#92400e",
  brown: "#92400e",
  chocolate: "#7c2d12",
  شوكولاتة: "#7c2d12",
  caramel: "#d97706",
  كراميل: "#d97706",
  tan: "#d4a373",
  بيج: "#d4b08c",
  beige: "#d4b08c",
  sand: "#fbbf24",
  رملي: "#fde68a",
  khaki: "#a3b18a",
  كاكي: "#a3b18a",
  mocha: "#6f4e37",
  موكا: "#6f4e37",
  // metallics
  ذهبي: "#ca8a04",
  gold: "#ca8a04",
  brass: "#b5a016",
  نحاسي: "#b45309",
  copper: "#b45309",
  bronze: "#a16207",
  برونزي: "#a16207",
};

/**
 * Resolves a color value string to a hex code.
 * Returns null if no match is found, triggering the fallback UI.
 */
function resolveColor(value: string): string | null {
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value;
  // Try exact lowercase match first, then strip spaces
  const key = value.toLowerCase().trim().replace(/\s+/g, "_");
  return COLOR_MAP[key] ?? COLOR_MAP[value.toLowerCase().trim()] ?? null;
}

/** Multi-color gradient for unknown color names */
const MULTICOLOR_GRADIENT =
  "conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ec4899, #ef4444)";

export default function VariantSelector({
  options,
  variants,
  selectedOptions,
  onSelect,
}: Props) {
  if (!options.length) return null;

  return (
    <div className="space-y-5 mb-8">
      {options
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((option) => {
          const selected = selectedOptions[option.name];
          const isColor = option.type === "COLORS";

          return (
            <div key={option.id}>
              {/* Option label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-black text-slate-700">
                  {option.name}:
                </span>
                {selected && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: "var(--p-color)",
                      backgroundColor:
                        "color-mix(in srgb, var(--p-color) 10%, transparent)",
                    }}
                  >
                    {selected}
                  </span>
                )}
              </div>

              {/* Values — RADIO gets a column layout, all others wrap */}
              <div
                className={`flex gap-2.5 ${
                  option.type === "RADIO" ? "flex-col" : "flex-wrap"
                }`}
                dir="rtl"
              >
                {option.values
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map((val) => {
                    const isSelected = selected === val.value;
                    const inStock = isValueInStock(
                      option.name,
                      val.value,
                      selectedOptions,
                      variants,
                    );
                    const available = isValueAvailable(
                      option.name,
                      val.value,
                      selectedOptions,
                      variants,
                    );
                    const hex = isColor
                      ? (val.colorCode && val.colorCode.trim() !== ""
                          ? val.colorCode
                          : resolveColor(val.value))
                      : null;

                    if (isColor) {
                      return (
                        <button
                          key={val.id}
                          type="button"
                          disabled={!available}
                          onClick={() => onSelect(option.name, val.value)}
                          title={val.value}
                          className={`
                            relative w-10 h-10 rounded-full border-2 transition-all duration-200
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${isSelected ? "border-(--p-color) scale-110 shadow-lg" : "border-slate-200 hover:border-slate-400"}
                            ${!available ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                          `}
                          style={
                            hex
                              ? { backgroundColor: hex }
                              : { background: MULTICOLOR_GRADIENT }
                          }
                          aria-label={val.value}
                          aria-pressed={isSelected}
                        >
                          {/* First letter overlay when no hex match */}
                          {!hex && (
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow">
                              {val.value.charAt(0)}
                            </span>
                          )}
                          {/* Checkmark overlay for selected */}
                          {isSelected && (
                            <span
                              className="absolute inset-0 flex items-center justify-center rounded-full"
                              style={{ backgroundColor: "rgba(0,0,0,0.20)" }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                              >
                                <path
                                  d="M2.5 7L5.5 10L11.5 4"
                                  stroke="white"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                          {/* Out-of-stock diagonal slash */}
                          {/* {!inStock && available && (
                            <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                              <svg
                                className="w-full h-full"
                                viewBox="0 0 40 40"
                                fill="none"
                              >
                                <line
                                  x1="4"
                                  y1="36"
                                  x2="36"
                                  y2="4"
                                  stroke="rgba(239,68,68,0.75)"
                                  strokeWidth="2.5"
                                />
                              </svg>
                            </span>
                          )} */}
                        </button>
                      );
                    }

                    /* ── RADIO type ── vertical list of radio rows */
                    if (option.type === "RADIO") {
                      return (
                        <button
                          key={val.id}
                          type="button"
                          disabled={!available}
                          onClick={() => onSelect(option.name, val.value)}
                          className={`
                            relative flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-sm font-bold
                            transition-all duration-200 text-right
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                            ${
                              isSelected
                                ? "border-(--p-color) bg-[color-mix(in_srgb,var(--p-color)_8%,transparent)]"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }
                            ${!available ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                          `}
                          aria-pressed={isSelected}
                        >
                          {/* Radio circle */}
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                              isSelected
                                ? "border-(--p-color)"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && (
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: "var(--p-color)" }}
                              />
                            )}
                          </span>
                          <span
                            className={
                              isSelected ? "text-(--p-color)" : "text-slate-700"
                            }
                          >
                            {val.value}
                          </span>
                          {!inStock && available && (
                            <span className="mr-auto text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                              نفد
                            </span>
                          )}
                        </button>
                      );
                    }

                    /* ── Default: BUTTONS / SIZES / DROPDOWN → toggle pills ── */
                    return (
                      <button
                        key={val.id}
                        type="button"
                        disabled={!available}
                        onClick={() => onSelect(option.name, val.value)}
                        className={`
                          relative px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all duration-200
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                          ${
                            isSelected
                              ? "border-(--p-color) text-(--p-color) bg-[color-mix(in_srgb,var(--p-color)_10%,transparent)] shadow-sm"
                              : "border-slate-200 text-slate-600 hover:border-slate-400 bg-white"
                          }
                          ${!available ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}
                        `}
                        aria-pressed={isSelected}
                      >
                        {val.value}
                        {!inStock && available && (
                          <span className="absolute -top-2 -right-2 text-[8px] font-black bg-red-500 text-white px-1 rounded-full leading-tight">
                            نفد
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
