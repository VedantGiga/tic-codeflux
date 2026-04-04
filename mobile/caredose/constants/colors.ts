/**
 * CareDose AI — Premium Dark Design System
 * Inspired by Ronas IT health/wellness aesthetic
 */
export const Colors = {
  // === Primary Accent ===
  primary: "#34D399",       // Soft emerald
  primaryDark: "#059669",   // Deep emerald
  primaryLight: "rgba(52, 211, 153, 0.15)", // Emerald glow

  // === Secondary & Accent ===
  secondary: "#818CF8",     // Soft indigo
  accent: "#FBBF24",        // Warm amber

  // === Status Colors ===
  taken: "#34D399",
  takenLight: "rgba(52, 211, 153, 0.12)",
  missed: "#F87171",
  missedLight: "rgba(248, 113, 113, 0.12)",
  pending: "#FBBF24",
  pendingLight: "rgba(251, 191, 36, 0.12)",

  // === Backgrounds (layered depth) ===
  background: "#080C18", // deeper, richer dark for liquid-glass depth
  surface: "rgba(255, 255, 255, 0.05)",
  surfaceAlt: "rgba(255, 255, 255, 0.03)",
  surfaceElevated: "rgba(255, 255, 255, 0.08)",

  // === Borders ===
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.04)",
  borderFocused: "rgba(52, 211, 153, 0.4)",

  // === Text ===
  text: "#F5F5F7",
  textSecondary: "#8E8E93",
  textTertiary: "#48484A",
  textInverse: "#FFFFFF",
  textWarm: "#34D399",      // Vibrant emerald green instead of warm cream

  // === Semantic ===
  success: "#34D399",
  error: "#F87171",
  warning: "#FBBF24",
  info: "#818CF8",

  // === Glass effect helpers ===
  glass: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.15)",
    borderHighlight: "rgba(255, 255, 255, 0.45)", // Stronger edge light
    innerOverlay: "rgba(255, 255, 255, 0.12)",
    backgroundElevated: "rgba(255, 255, 255, 0.1)",
    borderElevated: "rgba(255, 255, 255, 0.2)",
    glossStart: "rgba(255, 255, 255, 0.35)", // Brighter gloss
    glossEnd: "rgba(255, 255, 255, 0.0)",
  },

  gradient: {
    start: "#34D399",
    end: "#059669",
  },
  
  orb: {
    primary: "rgba(52, 211, 153, 0.35)",    // emerald
    secondary: "rgba(129, 140, 248, 0.30)",  // indigo
    accent: "rgba(251, 191, 36, 0.25)",     // amber
    tertiary: "rgba(56, 189, 248, 0.20)",    // sky
  },
};

export default Colors;
