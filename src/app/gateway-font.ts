import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";

/**
 * The fonts of the home page. Be Vietnam Pro is drawn for Vietnamese (every stacked accent is designed, none comes from a
 * fallback) and reads clearly on a dark sky; Space Grotesk gives the names and small captions their technical, space-age
 * character and also has the Vietnamese subset.
 */
export const gatewayBody = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-gateway-body",
});

export const gatewayDisplay = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  variable: "--font-gateway-display",
});
