export interface SpaceGateway {
  id: string;
  label: string;
  href: string;
  description: string;
  colorTheme: string; // e.g., 'from-cyan-500/20 to-blue-500/20'
  glowColor: string; // valid tailwind color name or hex
  planetGradient: string;
  borderColor: string;
}

export const spaceGateways: SpaceGateway[] = [
  {
    id: 'tech',
    label: 'Tech',
    href: '/tech',
    description: 'Dive into software, engineering, and digital tools.',
    colorTheme: 'from-blue-600/40 to-cyan-500/0',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    borderColor: 'border-blue-500/50',
    planetGradient: 'radial-gradient(circle at 35% 35%, #4ade80, #3b82f6, #1e3a8a)', // Earth-like
  },
  {
    id: 'discover',
    label: 'Discover',
    href: '/discover',
    description: 'Explore our curated collections and discoveries.',
    colorTheme: 'from-fuchsia-600/40 to-purple-600/0',
    glowColor: 'rgba(192, 38, 211, 0.6)',
    borderColor: 'border-fuchsia-500/50',
    planetGradient: 'radial-gradient(circle at 35% 35%, #f472b6, #c026d3, #4c1d95)', // Purple nebula
  },
  {
    id: 'fengshui',
    label: 'Feng Shui',
    href: '/fengshui',
    description: 'Balance energy and explore spatial harmony.',
    colorTheme: 'from-amber-500/40 to-orange-600/0',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    borderColor: 'border-amber-500/50',
    planetGradient: 'radial-gradient(circle at 35% 35%, #fde047, #d97706, #14532d)', // Warm/Nature/YinYang feel
  }
];

