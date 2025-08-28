const palette = {
  primary500: "#0065FF",

  secondary500: "#FFF159",

  success300: "#80ED99",
  success500: "#52B69A",

  danger500: "#EF476F",
  info500: "#00E1F0",
  warning500: "#FFBE0B",

  neutral900: "#252525",
  neutral800: "#3C3C3C",
  neutral700: "#5C5C5C",
  neutral600: "#7D7D7D",
  neutral500: "#A0A0A0",
  neutral400: "#C4C4C4",
  neutral300: "#E0E0E0",
  neutral200: "#F5F5F5",
  // Primary Colors
  primary100: "#00829B", // Teal
  primary200: "#2176B6", // Blue
  primary300: "#4CB6A3", // Green-Teal
  primary400: "#00E6F6", // Cyan

  // Semantic Colors
  success: "#8CF6A0", // Green
  error: "#F24B6A",   // Pink/Red
  warning: "#FFC221", // Yellow

  // Neutrals
  neutral100: "#FFFFFF",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",

  text: palette.neutral900,
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100, // Use white for card backgrounds
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary200, // Use blue as main accent
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.error,
  /**
   * Error Background.
   */
  errorBackground: palette.error + '20', // 20% opacity
  success: palette.success,
  warning: palette.warning,
} as const
