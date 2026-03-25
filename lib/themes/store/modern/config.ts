import type { ThemeTokens } from "../../types";

/** Fallback tokens for the Modern theme */
export const modernDefaultTokens: ThemeTokens = {
  primary: "#10b981",
  secondary: "#064e3b",
  accent: "#f59e0b",
  textColor: "#1e293b",
  headingColor: "#064e3b",
  buttonColor: "#10b981",
  fontFamily: "'Tajawal', sans-serif",
  borderRadius: "16px",
  logoWidth: 120,
  logoHeight: 40,
  showStoreName: true,
};

/**
 * resolveTokens is intentionally not used at runtime for the modern theme —
 * ThemeEngine handles the three-layer merge. This function is kept for
 * isolated unit-testing of the modern defaults.
 */
export function resolveTokens(
  overrides: Partial<ThemeTokens> = {},
): ThemeTokens {
  return { ...modernDefaultTokens, ...overrides };
}
