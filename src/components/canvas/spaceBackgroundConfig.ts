export const spaceBackgroundConfig = {
  stars: {
    count: 1200,
    radius: 1.2,
    size: 0.002,
    color: "#915EFF",
    rotationX: 15,
    rotationY: 20,
  },
  astronaut: {
    sprite: {
      width: 0.35,
      height: 0.5,
      glowScale: 1.2,
    },
    placement: {
      x: 0,
      y: -1.4,
      z: 1,
      scale: 2.55,
    },
    idle: {
      enabled: true,
      floatAmplitudeY: 0.04,
      floatSpeed: 0.5,
      poseBobAmplitudeY: 0.018,
      poseBobSpeed: 0.8,
      poseTiltAmplitudeZ: 0.018,
      poseTiltSpeedZ: 0.5,
      poseTiltAmplitudeX: 0.018,
      poseTiltSpeedX: 0.4,
    },
    warp: {
      progressDamping: 4,
      targetOffsetX: 2.5,
      endY: 1.5,
      endZ: -2,
      endScale: 0.1,
      spinSpeedZ: 15,
      spinSpeedX: 10,
    },
    glow: {
      baseOpacity: 0.4,
      pulseAmplitude: 0.1,
      pulseSpeed: 1,
    },
  },
} as const;
