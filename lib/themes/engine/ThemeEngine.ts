import type { StoreData } from '../types'
import type { ActiveTheme, ThemeConfig, ThemeStyleObject } from './types'

/**
 * Universal fallback config — used when neither the Theme's defaultConfig
 * nor the Store's override fields supply a value.
 */
const FALLBACK_CONFIG: ThemeConfig = {
  primary:      '#2563eb',
  secondary:    '#0f172a',
  accent:       '#f59e0b',
  textColor:    '#1e293b',
  headingColor: '#000000',
  buttonColor:  '#2563eb',
  fontFamily:   "'Cairo', sans-serif",
  borderRadius: '8px',
  logoWidth:    120,
  logoHeight:   40,
  showStoreName: true,
}

/**
 * ThemeEngine
 *
 * Implements a three-layer config cascade:
 *   Layer 0 (lowest):  FALLBACK_CONFIG   — universal hardcoded defaults
 *   Layer 1 (middle):  activeTheme.defaultConfig — from the Theme DB record
 *   Layer 2 (highest): store-level overrides — fields set directly on the Store
 *
 * This ensures backward compatibility: any store without a themeId or without
 * override values will still render correctly.
 */
export class ThemeEngine {
  private readonly storeData: StoreData
  private readonly activeTheme: ActiveTheme | null

  constructor(storeData: StoreData, activeTheme: ActiveTheme | null = null) {
    this.storeData   = storeData
    this.activeTheme = activeTheme
  }

  /**
   * Returns the fully merged ThemeConfig for this store.
   * Call this once and cache the result — it's pure.
   */
  getComputedConfig(): ThemeConfig {
    // Layer 0: start from universal fallbacks
    const config: ThemeConfig = { ...FALLBACK_CONFIG }

    // Layer 1: apply theme-level defaults (overrides fallback)
    if (this.activeTheme?.defaultConfig) {
      const d = this.activeTheme.defaultConfig
      if (d.primary      !== undefined) config.primary      = d.primary
      if (d.secondary    !== undefined) config.secondary    = d.secondary
      if (d.accent       !== undefined) config.accent       = d.accent
      if (d.textColor    !== undefined) config.textColor    = d.textColor
      if (d.headingColor !== undefined) config.headingColor = d.headingColor
      if (d.buttonColor  !== undefined) config.buttonColor  = d.buttonColor
      if (d.fontFamily   !== undefined) config.fontFamily   = d.fontFamily
      if (d.borderRadius !== undefined) config.borderRadius = d.borderRadius
      if (d.logoWidth    !== undefined) config.logoWidth    = d.logoWidth
      if (d.logoHeight   !== undefined) config.logoHeight   = d.logoHeight
      if (d.showStoreName !== undefined) config.showStoreName = d.showStoreName
    }

    // Layer 2: apply store-level overrides (highest priority)
    const s = this.storeData
    if (s.primaryColor   != null) config.primary      = s.primaryColor
    if (s.secondaryColor != null) config.secondary    = s.secondaryColor
    if (s.accentColor    != null) config.accent       = s.accentColor
    if (s.textColor      != null) config.textColor    = s.textColor
    if (s.headingColor   != null) config.headingColor = s.headingColor
    if (s.buttonColor    != null) config.buttonColor  = s.buttonColor
    if (s.fontFamily     != null) config.fontFamily   = s.fontFamily
    if (s.borderRadius   != null) config.borderRadius = s.borderRadius
    if (s.logoWidth      != null) config.logoWidth    = s.logoWidth
    if (s.logoHeight     != null) config.logoHeight   = s.logoHeight
    if (s.showStoreName  != null) config.showStoreName = s.showStoreName

    return config
  }

  /**
   * Returns a CSS variables object ready for use as an inline `style` prop.
   * All storefront components reference these tokens via Tailwind arbitrary values:
   *   bg-[var(--p-color)], text-[var(--t-color)], rounded-[var(--radius)], etc.
   */
  getStyleObject(): ThemeStyleObject {
    const c = this.getComputedConfig()
    return {
      '--p-color': c.primary,
      '--s-color': c.secondary,
      '--a-color': c.accent,
      '--t-color': c.textColor,
      '--h-color': c.headingColor,
      '--b-color': c.buttonColor,
      '--radius':  c.borderRadius,
      fontFamily:  c.fontFamily,
    } as ThemeStyleObject
  }

  /**
   * Convenience: returns the active theme slug, falling back to 'default'.
   * Use this to select the correct theme component from the registry.
   */
  getThemeSlug(): string {
    return this.activeTheme?.slug ?? 'default'
  }
}
