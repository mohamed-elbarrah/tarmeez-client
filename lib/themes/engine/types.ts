import type { CSSProperties } from "react";

// ─── Strict type for the computed theme configuration ───────────────────────
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
  headingColor: string;
  buttonColor: string;
  fontFamily: string;
  borderRadius: string;
  logoWidth: number;
  logoHeight: number;
  showStoreName: boolean;
}

// ─── Shape of a Theme record returned by GET /themes ────────────────────────
export interface ActiveTheme {
  id: string;
  slug: string;
  name: string;
  previewImage: string | null;
  /** Raw JSON from Theme.defaultConfig in the DB */
  defaultConfig: Partial<ThemeConfig>;
}

// ─── CSS variables map (mapped to Tailwind arbitrary value tokens) ───────────
export interface ThemeStyleObject extends CSSProperties {
  "--p-color": string;
  "--s-color": string;
  "--a-color": string;
  "--t-color": string;
  "--h-color": string;
  "--b-color": string;
  "--radius": string;
}
