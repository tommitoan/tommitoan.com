import type { WindBandPalette } from "./AuroraCanvas";
import type { GatewayHomePortal, GatewayPlanetLayout, ResponsiveSize } from "./gatewayHomeConfig";

function makePortalPlanetLayout(size: ResponsiveSize): GatewayPlanetLayout {
  return {
    size,
    anchor: {
      horizontal: "center",
      vertical: "center",
      offsetXPercent: 0,
      offsetYPercent: 0,
    },
    hoverLiftPx: 18,
    frameHeightScale: 1,
  };
}

const FENG_SHUI_WIND_PALETTE: WindBandPalette[] = [
  { hue: 104, saturation: 58, alpha: 0.52, thickness: 10, lightness: 70 },
  { hue: 112, saturation: 66, alpha: 0.58, thickness: 8, lightness: 76 },
  { hue: 118, saturation: 74, alpha: 0.62, thickness: 9, lightness: 80 },
  { hue: 124, saturation: 68, alpha: 0.48, thickness: 7, lightness: 74 },
  { hue: 132, saturation: 72, alpha: 0.64, thickness: 8, lightness: 82 },
  { hue: 138, saturation: 64, alpha: 0.44, thickness: 6, lightness: 72 },
  { hue: 144, saturation: 70, alpha: 0.60, thickness: 8, lightness: 78 },
  { hue: 150, saturation: 62, alpha: 0.54, thickness: 7, lightness: 75 },
  { hue: 156, saturation: 68, alpha: 0.58, thickness: 8, lightness: 81 },
  { hue: 162, saturation: 56, alpha: 0.42, thickness: 6, lightness: 73 },
  { hue: 126, saturation: 80, alpha: 0.66, thickness: 9, lightness: 84 },
  { hue: 146, saturation: 76, alpha: 0.50, thickness: 7, lightness: 79 },
];

export const gatewayHomePortals = [
  {
    id: "tech",
    label: "Tech",
    href: "/tech",
    description: "Dive into software, engineering, and digital tools.",
    theme: {
      hoverGradientClass: "from-green-600/40 to-cyan-500/0",
      glowColor: "rgba(38, 211, 80, 0.6)",
      borderColorClass: "border-green-500/50",
      frameBg: "radial-gradient(ellipse at 50% 55%, rgba(0,255,136,0.09) 0%, rgba(0,50,25,0.55) 45%, rgba(0,0,0,0.88) 100%)",
    },
    planet: {
      ...makePortalPlanetLayout({ mobileRem: 7.75, viewport: 14.5, desktopRem: 16 }),
      diffuse: "/gateway/textures/planets/earth-atmosphere.jpg",
      normal: "/gateway/textures/planets/earth-normal.jpg",
      specular: "/gateway/textures/planets/earth-specular.jpg",
      clouds: "/gateway/textures/planets/earth-clouds.png",
      lights: "/gateway/textures/planets/earth-lights.png",
      colorTint: "#55ff88",
      atmosphereColor: "#20b033",
      ambientIntensity: 4.4,
      rotationOffset: 1.8,
      axialTilt: 0.5,
      rotationSpeed: 0.4,
      cloudSpeed: 0.5,
      bloom: {
        position: [0, 2.5, 3],
        intensity: 1.15,
        color: "#ffffff",
        hoverIntensity: 2.1,
      },
      techOverlay: {
        circuitColor: "#00ff88",
        circuitOpacity: 0.65,
      },
    },
    effects: [{ kind: "matrixRain" }],
  },
  {
    id: "discover",
    label: "Discover",
    href: "/discover",
    description: "Explore our curated collections and discoveries.",
    theme: {
      hoverGradientClass: "from-fuchsia-600/40 to-purple-600/0",
      glowColor: "rgba(192, 38, 211, 0.6)",
      borderColorClass: "border-fuchsia-500/50",
      frameBg: "radial-gradient(ellipse at 50% 45%, rgba(192,38,211,0.10) 0%, rgba(50,0,70,0.58) 45%, rgba(0,0,0,0.88) 100%)",
    },
    planet: {
      ...makePortalPlanetLayout({ mobileRem: 7.75, viewport: 14.5, desktopRem: 16 }),
      diffuse: "/gateway/textures/planets/earth-atmosphere.jpg",
      normal: "/gateway/textures/planets/earth-normal.jpg",
      specular: "/gateway/textures/planets/earth-specular.jpg",
      clouds: "/gateway/textures/planets/earth-clouds.png",
      colorTint: "#dd88ff",
      atmosphereColor: "#9933dd",
      ambientIntensity: 4.4,
      rotationOffset: 1.8,
      axialTilt: 0.5,
      rotationSpeed: 0.4,
      cloudSpeed: 0.5,
      bloom: {
        position: [0, 2.5, 3],
        intensity: 1.05,
        color: "#ffffff",
        hoverIntensity: 1.95,
      },
    },
    effects: [{ kind: "aurora" }],
  },
  {
    id: "fengshui",
    label: "Feng Shui",
    href: "/fengshui",
    description: "Balance energy and explore spatial harmony.",
    theme: {
      hoverGradientClass: "from-slate-100/20 to-white/0",
      glowColor: "rgba(205, 220, 255, 0.92)",
      borderColorClass: "border-white/40",
      frameBg: "radial-gradient(ellipse at 50% 50%, rgba(205,220,255,0.07) 0%, rgba(20,30,45,0.52) 45%, rgba(0,0,0,0.85) 100%)",
    },
    planet: {
      ...makePortalPlanetLayout({ mobileRem: 7.75, viewport: 14.5, desktopRem: 16 }),
      diffuse: "/gateway/textures/planets/earth-atmosphere.jpg",
      normal: "/gateway/textures/planets/earth-normal.jpg",
      specular: "/gateway/textures/planets/earth-specular.jpg",
      clouds: "/gateway/textures/planets/earth-clouds-hires.jpg",
      crystalBall: true,
      colorTint: "#c8ddf4",
      atmosphereColor: "#b8ccee",
      ambientIntensity: 0.5,
      rotationOffset: 1.8,
      axialTilt: 0.5,
      rotationSpeed: 0.4,
      cloudSpeed: 0.5,
      bloom: {
        position: [0, 2.5, 3],
        intensity: 2.15,
        color: "#d0e8ff",
        hoverIntensity: 3.1,
      },
    },
    effects: [
      {
        kind: "aurora",
        windConfig: {
          density: 12,
          speed: 0.42,
          thickness: 0.52,
          palette: FENG_SHUI_WIND_PALETTE,
        },
      },
    ],
  },
] satisfies GatewayHomePortal[];
