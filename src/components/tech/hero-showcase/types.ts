export type OrbitDirection = "clockwise" | "counterclockwise";

export type ShowcasePhase = "off" | "booting" | "visible" | "fading";

export type TooltipContentMode = "text" | "icon" | "iconText" | "none";

export type OrbitTooltipConfig = {
  mode?: TooltipContentMode;
  label?: string;
  icon?: string;
  distance?: number;
  beamLength?: number;
  minWidthRem?: number;
  textColor?: string;
  accentColor?: string;
  surfaceFrom?: string;
  surfaceTo?: string;
  glowColor?: string;
};

export type OrbitNodeConfig = {
  id: string;
  label: string;
  startAngle: number;
  planetColor: string;
  planetGlow: string;
  planetSizeRem?: number;
  icon?: string;
  interactive?: boolean;
  tooltip?: OrbitTooltipConfig;
};

export type OrbitConfig = {
  id: string;
  radius: number;
  duration: number;
  direction: OrbitDirection;
  trackColor: string;
  tooltipDefaults?: OrbitTooltipConfig;
  defaultPlanetSizeRem?: number;
  nodes: OrbitNodeConfig[];
};

export type ShowcaseLayoutConfig = {
  frameMaxWidthRem: number;
  stageMinHeightRem: number;
  interactionZoneSizeRem: number;
  offsetXRem: number;
  offsetYRem: number;
  scale: number;
  lightSizeRem: number;
  lightTopPercent: number;
  lightRightPercent: number;
  glowInsetPercent: number;
  corePulseSizeRem: number;
  coreIconSizeRem: number;
  coreIconFontSizeRem: number;
  ghostOrbitDiameterRem: number;
};

export type ShowcaseCycleConfig = {
  idleDelayMs: number;
  bootDurationMs: number;
  visibleDurationMs: number;
  fadeDurationMs: number;
  bootStaggerMs: number;
};

export type ShowcaseCoreConfig = {
  icon: string;
  pulseFrom: string;
  pulseTo: string;
  iconGradient: [string, string, string];
};

export type HeroShowcaseConfig = {
  layout: ShowcaseLayoutConfig;
  cycle: ShowcaseCycleConfig;
  core: ShowcaseCoreConfig;
  ghostTrackColor: string;
  orbits: OrbitConfig[];
};
