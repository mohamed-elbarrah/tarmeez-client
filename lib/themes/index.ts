import DefaultTheme from './store/default'
import { StoreData } from './types'

export { ThemeEngine } from './engine'
export type { ThemeConfig, ActiveTheme, ThemeStyleObject } from './engine'

export const STORE_THEMES: Record<string, React.ComponentType<{ storeData: StoreData }>> = {
  'default': DefaultTheme,
}

export function getTheme(themeKey: string | null | undefined) {
  return STORE_THEMES[themeKey ?? 'default'] ?? STORE_THEMES['default']
}
