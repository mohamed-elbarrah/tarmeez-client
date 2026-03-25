import DefaultTheme from "./store/default";
import ModernTheme from "./store/modern";
import { StoreData } from "./types";

export { ThemeEngine } from "./engine";
export type { ThemeConfig, ActiveTheme, ThemeStyleObject } from "./engine";

export const STORE_THEMES: Record<
  string,
  React.ComponentType<{ storeData: StoreData }>
> = {
  default: DefaultTheme,
  modern: ModernTheme,
};

export function getTheme(themeKey: string | null | undefined) {
  return STORE_THEMES[themeKey ?? "default"] ?? STORE_THEMES["default"];
}
