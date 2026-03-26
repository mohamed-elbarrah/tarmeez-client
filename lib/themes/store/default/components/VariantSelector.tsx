"use client"

import React from 'react'
import { ProductOption, ProductVariant } from '@/lib/themes/types'

interface Props {
  options: ProductOption[]
  variants: ProductVariant[]
  selectedOptions: Record<string, string>
  onSelect: (optionName: string, value: string) => void
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
  variants: ProductVariant[]
): boolean {
  const trial = { ...selectedOptions, [optionName]: value }
  return variants.some(v =>
    v.isActive &&
    Object.entries(trial).every(([optName, optVal]) =>
      v.optionValues.some(ov => {
        // We need to find the parent option name to match
        // optionValue.value = the display string; but we don't have optionName
        // in ProductVariantValue directly. We rely on the parent option lookup
        // that is done in the component below via the passed `options` array.
        return ov.optionValue.value === optVal
      })
    )
  )
}

function isValueInStock(
  optionName: string,
  value: string,
  selectedOptions: Record<string, string>,
  variants: ProductVariant[]
): boolean {
  const trial = { ...selectedOptions, [optionName]: value }
  return variants.some(v =>
    v.isActive &&
    v.quantity > 0 &&
    Object.values(trial).every(optVal =>
      v.optionValues.some(ov => ov.optionValue.value === optVal)
    )
  )
}

/** Naive hex detection — tries to map common Arabic/English color names to hex */
const COLOR_MAP: Record<string, string> = {
  // Arabic names
  أحمر: '#ef4444', red: '#ef4444',
  أزرق: '#3b82f6', blue: '#3b82f6',
  أخضر: '#22c55e', green: '#22c55e',
  أصفر: '#eab308', yellow: '#eab308',
  برتقالي: '#f97316', orange: '#f97316',
  بنفسجي: '#a855f7', purple: '#a855f7',
  وردي: '#ec4899', pink: '#ec4899',
  أبيض: '#ffffff', white: '#ffffff',
  أسود: '#000000', black: '#000000',
  رمادي: '#6b7280', gray: '#6b7280', grey: '#6b7280',
  بني: '#92400e', brown: '#92400e',
  ذهبي: '#ca8a04', gold: '#ca8a04',
  فضي: '#9ca3af', silver: '#9ca3af',
  سماوي: '#06b6d4', cyan: '#06b6d4',
  كحلي: '#1e40af', navy: '#1e40af',
  زيتوني: '#65a30d', olive: '#65a30d',
  بيج: '#d4b08c', beige: '#d4b08c',
}

function resolveColor(value: string): string | null {
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value
  return COLOR_MAP[value.toLowerCase().trim()] ?? null
}

export default function VariantSelector({ options, variants, selectedOptions, onSelect }: Props) {
  if (!options.length) return null

  return (
    <div className="space-y-5 mb-8">
      {options
        .slice()
        .sort((a, b) => a.position - b.position)
        .map(option => {
          const selected = selectedOptions[option.name]
          const isColor = option.type === 'COLORS'

          return (
            <div key={option.id}>
              {/* Option label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-black text-slate-700">{option.name}:</span>
                {selected && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: 'var(--p-color)',
                      backgroundColor: 'color-mix(in srgb, var(--p-color) 10%, transparent)',
                    }}
                  >
                    {selected}
                  </span>
                )}
              </div>

              {/* Values */}
              <div className="flex flex-wrap gap-2.5" dir="rtl">
                {option.values
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map(val => {
                    const isSelected = selected === val.value
                    const inStock = isValueInStock(option.name, val.value, selectedOptions, variants)
                    const available = isValueAvailable(option.name, val.value, selectedOptions, variants)
                    const hex = isColor ? resolveColor(val.value) : null

                    if (isColor) {
                      return (
                        <button
                          key={val.id}
                          type="button"
                          disabled={!available}
                          onClick={() => onSelect(option.name, val.value)}
                          title={val.value}
                          className={`
                            relative w-9 h-9 rounded-full border-2 transition-all duration-200
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${isSelected
                            ? 'border-(--p-color) scale-110 shadow-lg'
                              : 'border-slate-200 hover:border-slate-400'
                            }
                            ${!available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                          style={hex
                            ? { backgroundColor: hex }
                            : { background: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)' }
                          }
                          aria-label={val.value}
                          aria-pressed={isSelected}
                        >
                          {/* Checkmark overlay for selected */}
                          {isSelected && (
                            <span
                              className="absolute inset-0 flex items-center justify-center rounded-full"
                              style={{ backgroundColor: 'rgba(0,0,0,0.18)' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          )}
                          {/* Out-of-stock diagonal slash */}
                          {!inStock && available && (
                            <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                              <svg className="w-full h-full" viewBox="0 0 36 36" fill="none">
                                <line x1="4" y1="32" x2="32" y2="4" stroke="rgba(239,68,68,0.7)" strokeWidth="2.5" />
                              </svg>
                            </span>
                          )}
                        </button>
                      )
                    }

                    /* BUTTONS / SIZES / DROPDOWN fallback as toggle pills */
                    return (
                      <button
                        key={val.id}
                        type="button"
                        disabled={!available}
                        onClick={() => onSelect(option.name, val.value)}
                        className={`
                          relative px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all duration-200
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                          ${isSelected
                            ? 'border-(--p-color) text-(--p-color) bg-[color-mix(in_srgb,var(--p-color)_10%,transparent)] shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
                          }
                          ${!available ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}
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
                    )
                  })}
              </div>
            </div>
          )
        })}
    </div>
  )
}
