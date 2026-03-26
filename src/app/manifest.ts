import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tommi Toan",
    short_name: "Tommi Toan",
    description: "Simple portfolio for Toan Ngo covering software engineering, platform work, and public products.",
    start_url: "/",
    display: "standalone",
    background_color: "#050812",
    theme_color: "#050812",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
