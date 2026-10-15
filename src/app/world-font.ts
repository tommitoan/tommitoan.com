import { Noto_Serif } from "next/font/google";

/** The serif of the Feng Shui world, shared by its layout and by the 404 page. */
export const worldSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-world-serif",
});
