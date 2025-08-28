// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"
import {
  Exo2_300Light as exo2Light,
  Exo2_400Regular as exo2Regular,
  Exo2_500Medium as exo2Medium,
  Exo2_600SemiBold as exo2SemiBold,
  Exo2_700Bold as exo2Bold,
} from "@expo-google-fonts/exo-2"

export const customFontsToLoad = {
  exo2Light,
  exo2Regular,
  exo2Medium,
  exo2SemiBold,
  exo2Bold,
}

const fonts = {
  spaceGrotesk: {
    // Cross-platform Google font.
    light: "exo2Light",
    normal: "exo2Regular",
    medium: "exo2Medium",
    semiBold: "exo2SemiBold",
    bold: "exo2Bold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.spaceGrotesk,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}
