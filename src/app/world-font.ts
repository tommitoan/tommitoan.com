import { Inter, Noto_Serif } from "next/font/google";

/** The serif of the Feng Shui world, shared by its layout and by the 404 page. */
export const worldSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-world-serif",
});

/**
 * The sans of the Feng Shui world. The site's body font (Instrument Sans) has no Vietnamese letters, so every accented
 * Vietnamese word fell back to a system font and the text looked mixed; Inter has them, as one variable file per subset.
 */
export const worldSans = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-world-sans",
});
