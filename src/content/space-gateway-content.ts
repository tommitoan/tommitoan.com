import type {PlanetTextures} from "@/components/gateway/PlanetSphere";

export interface SpaceGateway {
    id: string;
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
        colorTheme: 'from-fuchsia-600/40 to-purple-600/0',
        glowColor: 'rgba(38,211,41,0.6)',
        borderColor: 'border-fuchsia-500/50',
        planet: {
            diffuse: '/textures/planets/earth_atmos_2048.jpg',
            normal: '/textures/planets/earth_normal_2048.jpg',
            specular: '/textures/planets/earth_specular_2048.jpg',
            clouds: '/textures/planets/earth_clouds_1024.png',
            colorTint: '#66ff85',
            atmosphereColor: '#20b033',
            ambientIntensity: 4.4,
            rotationOffset: 1.8,
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
        id: 'discover',
        label: 'Discover',
        href: '/discover',
        description: 'Explore our curated collections and discoveries.',
        colorTheme: 'from-blue-600/40 to-cyan-500/0',
        glowColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'border-blue-500/50',
        planet: {
            diffuse: '/textures/planets/earth_atmos_2048.jpg',
            normal: '/textures/planets/earth_normal_2048.jpg',
            specular: '/textures/planets/earth_specular_2048.jpg',
            clouds: '/textures/planets/earth_clouds_1024.png',
            atmosphereColor: '#3060e0',
            ambientIntensity: 4.4,
            rotationOffset: -0.6,
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
    // {
    //   id: 'discover',
    //   label: 'Discover',
    //   href: '/discover',
    //   description: 'Explore our curated collections and discoveries.',
    //   colorTheme: 'from-fuchsia-600/40 to-purple-600/0',
    //   glowColor: 'rgba(192, 38, 211, 0.6)',
    //   borderColor: 'border-fuchsia-500/50',
    //   planet: {
    //     diffuse: '/textures/planets/earth_atmos_2048.jpg',
    //     normal: '/textures/planets/earth_normal_2048.jpg',
    //     specular: '/textures/planets/earth_specular_2048.jpg',
    //     clouds: '/textures/planets/earth_clouds_1024.png',
    //     colorTint: '#cc66ff',
    //     atmosphereColor: '#7020b0',
    //     ambientIntensity: 4.4,
    //     rotationOffset: 1.8,
    //     rotationSpeed: 0.4,
    //     cloudSpeed: 0.5,
    //     bloom: {
    //       position: [-2.0, 2.5, 3.0],
    //       intensity: 0.6,
    //       color: '#ffffff',
    //       distance: 20,
    //       decay: 1.2,
    //       hoverPosition: [-2.5, 3.0, 3.0],
    //       hoverIntensity: 1.4,
    //     },
    //   },
    // },
    {
        id: 'fengshui',
        label: 'Feng Shui',
        href: '/fengshui',
        description: 'Balance energy and explore spatial harmony.',
        colorTheme: 'from-amber-500/40 to-orange-600/0',
        glowColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'border-amber-500/50',
        planet: {
            diffuse: '/textures/planets/earth_atmos_2048.jpg',
            normal: '/textures/planets/earth_normal_2048.jpg',
            specular: '/textures/planets/earth_specular_2048.jpg',
            clouds: '/textures/planets/earth_clouds_1024.png',
            colorTint: '#ff7722',
            atmosphereColor: '#c04010',
            ambientIntensity: 4.4,
            rotationOffset: 1.4,
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
];
