import type { PlanetTextures } from "@/components/gateway/PlanetSphere";

export type SpaceGatewayId = "tech" | "discover" | "fengshui";

export interface SpaceGateway {
  id: SpaceGatewayId;
  label: string;
  href: string;
  description: string;
  colorTheme: string;
  glowColor: string;
  planet: PlanetTextures;
  borderColor: string;
}

export const spaceGateways: SpaceGateway[] = [
  {
    id: 'tech',
    label: 'Tech',
    href: '/tech',
    description: 'Dive into software, engineering, and digital tools.',
    colorTheme: 'from-green-600/40 to-cyan-500/0',
    glowColor: 'rgba(38, 211, 80, 0.6)',
    borderColor: 'border-green-500/50',
    planet: {
      diffuse: '/textures/planets/earth_atmos_2048.jpg',
      normal: '/textures/planets/earth_normal_2048.jpg',
      specular: '/textures/planets/earth_specular_2048.jpg',
      clouds: '/textures/planets/earth_clouds_1024.png',
      lights: '/textures/planets/earth_lights_2048.png',
      colorTint: '#55ff88',
      atmosphereColor: '#20b033',
      ambientIntensity: 4.4,
      rotationOffset: 1.8,
      axialTilt: 0.5,
      rotationSpeed: 0.4,
      cloudSpeed: 0.5,
      bloom: {
        position: [-2.0, 2.5, 3.0],
        intensity: 0.6,
        color: '#ffffff',
        distance: 20,
        decay: 1.2,
        hoverPosition: [-2.5, 3.0, 3.0],
        hoverIntensity: 1.4,
      },
      techOverlay: {
        circuitColor: '#00ff88',
        circuitOpacity: 0.65,
      },
    },
  },
  {
    id: 'discover',
    label: 'Discover',
    href: '/discover',
    description: 'Explore our curated collections and discoveries.',
    colorTheme: 'from-fuchsia-600/40 to-purple-600/0',
    glowColor: 'rgba(192, 38, 211, 0.6)',
    borderColor: 'border-fuchsia-500/50',
    planet: {
      diffuse: '/textures/planets/earth_atmos_2048.jpg',
      normal: '/textures/planets/earth_normal_2048.jpg',
      specular: '/textures/planets/earth_specular_2048.jpg',
      clouds: '/textures/planets/earth_clouds_1024.png',
      colorTint: '#dd88ff',
      atmosphereColor: '#9933dd',
      ambientIntensity: 4.4,
      rotationOffset: 1.8,
      axialTilt: 0.5,
      rotationSpeed: 0.4,
      cloudSpeed: 0.5,
      bloom: {
        position: [-2.0, 2.5, 3.0],
        intensity: 0.6,
        color: '#ffffff',
        distance: 20,
        decay: 1.2,
        hoverPosition: [-2.5, 3.0, 3.0],
        hoverIntensity: 1.4,
      },
    },
  },
  {
    id: 'fengshui',
    label: 'Feng Shui',
    href: '/fengshui',
    description: 'Balance energy and explore spatial harmony.',
    colorTheme: 'from-slate-100/20 to-white/0',
    glowColor: 'rgba(205, 220, 255, 0.92)',
    borderColor: 'border-white/40',
    planet: {
      diffuse: '/textures/planets/earth_atmos_2048.jpg',
      normal: '/textures/planets/earth_normal_2048.jpg',
      specular: '/textures/planets/earth_specular_2048.jpg',
      clouds: '/textures/planets/2k_earth_clouds.jpg',
      crystalBall: true,
      colorTint: '#c8ddf4',
      atmosphereColor: '#b8ccee',
      ambientIntensity: 0.5,
      rotationOffset: 1.8,
      axialTilt: 0.5,
      rotationSpeed: 0.06,
      cloudSpeed: 0.28,
      bloom: {
        position: [-2.0, 2.5, 3.0],
        intensity: 1.8,
        color: '#d0e8ff',
        distance: 20,
        decay: 1.2,
        hoverPosition: [-2.5, 3.0, 3.0],
        hoverIntensity: 2.6,
      },
    },
  },
];
