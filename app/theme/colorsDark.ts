const palette = {
  primary500: "#0065FF",
  secondary500: "#FFF159",

  success300: "#80ED99",
  success500: "#52B69A",

  danger500: "#EF476F",
  info500: "#00E1F0",
  warning500: "#FFBE0B",

  neutral100: "#252525",
  neutral200: "#3C3C3C",
  neutral300: "#5C5C5C",
  neutral400: "#7D7D7D",
  neutral500: "#A0A0A0",
  neutral600: "#C4C4C4",
  neutral700: "#E0E0E0",
  neutral800: "#F5F5F5",
  neutral900: "#FFFFFF",

  overlay20: "rgba(255, 255, 255, 0.2)",
  overlay50: "rgba(255, 255, 255, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",

  text: palette.neutral900,
  textDim: palette.neutral600,
  background: palette.secondary500,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral500,
  separator: palette.neutral400,
  error: palette.danger500,
  errorBackground: palette.danger500 + "20",
} as const
