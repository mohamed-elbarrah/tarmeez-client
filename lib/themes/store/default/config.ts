import { ThemeTokens, StoreData } from '../../types'

export const defaultTokens: ThemeTokens = {
  primary: '#2563eb',
  secondary: '#0f172a',
  accent: '#f59e0b',
  textColor: '#1e293b',
  headingColor: '#000000',
  buttonColor: '#2563eb',
  fontFamily: "'Cairo', sans-serif",
  borderRadius: '8px',
  logoWidth: 120,
  logoHeight: 40,
  showStoreName: true,
}

export function resolveTokens(storeData: StoreData): ThemeTokens {
  return {
    primary: storeData.primaryColor ?? defaultTokens.primary,
    secondary: storeData.secondaryColor ?? defaultTokens.secondary,
    accent: storeData.accentColor ?? defaultTokens.accent,
    textColor: storeData.textColor ?? defaultTokens.textColor,
    headingColor: storeData.headingColor ?? defaultTokens.headingColor,
    buttonColor: storeData.buttonColor ?? defaultTokens.buttonColor,
    fontFamily: storeData.fontFamily ?? defaultTokens.fontFamily,
    borderRadius: storeData.borderRadius ?? defaultTokens.borderRadius,
    logoWidth: storeData.logoWidth ?? defaultTokens.logoWidth,
    logoHeight: storeData.logoHeight ?? defaultTokens.logoHeight,
    showStoreName: storeData.showStoreName ?? defaultTokens.showStoreName,
  }
}
