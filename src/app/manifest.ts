import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tommi Toan",
    short_name: "Tommi Toan",
    description: "Personal space of Toan Ngo — software engineer, homelab operator, and builder of Go microservices, Feng Shui tools, and digital products.",
    start_url: "/",
    display: "standalone",
    background_color: "#050812",
    theme_color: "#050812",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/profile/avatar-cartoon.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
