import { ThemeTokens, StoreData } from '../../types'

export const defaultTokens: ThemeTokens = {
  primary: '#2563eb',
  secondary: '#0f172a',
  accent: '#f59e0b',
  fontFamily: "'Inter', 'Cairo', sans-serif",
  borderRadius: '20px',
}

export function resolveTokens(storeData: StoreData): ThemeTokens {
  return {
    primary: storeData.primaryColor ?? defaultTokens.primary,
    secondary: storeData.secondaryColor ?? defaultTokens.secondary,
    accent: storeData.accentColor ?? defaultTokens.accent,
    fontFamily: storeData.fontFamily ?? defaultTokens.fontFamily,
    borderRadius: storeData.borderRadius ?? defaultTokens.borderRadius,
  }
}
