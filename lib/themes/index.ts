import DefaultTheme from "./store/default";
import CharityTheme from "./store/charity";
import { StoreData } from "./types";

export { ThemeEngine } from "./engine";
export type { ThemeConfig, ActiveTheme, ThemeStyleObject } from "./engine";

export const STORE_THEMES: Record<
  string,
  React.ComponentType<{ storeData: StoreData }>
> = {
  default: DefaultTheme,
  charity: CharityTheme,
};

export function getTheme(themeKey: string | null | undefined) {
  return STORE_THEMES[themeKey ?? "default"] ?? STORE_THEMES["default"];
}
