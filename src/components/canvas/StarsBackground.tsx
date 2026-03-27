"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import type { Points as ThreePoints } from "three";

// ─── Tweak this object to customise the star field ───────────────────────────
const STARS_CONFIG = {
  /** Number of star points rendered. Lower = fewer stars. */
  count: 1200,
  /** Radius of the point sphere (world units). */
  radius: 1.2,
  /** Point size in world units (sizeAttenuation: true, so depth matters). */
  size: 0.002,
  /** Star colour — matches the site accent. */
  color: "#915EFF",
  /** Rotation speed around X axis (radians per second divisor). */
  rotationX: 15,
  /** Rotation speed around Y axis (radians per second divisor). */
  rotationY: 20,
};
// ─────────────────────────────────────────────────────────────────────────────

function useSpherePoints(count: number, radius: number): Float32Array {
  return useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number;
      do {
        // eslint-disable-next-line react-hooks/purity
        x = (Math.random() - 0.5) * 2;
        // eslint-disable-next-line react-hooks/purity
        y = (Math.random() - 0.5) * 2;
        // eslint-disable-next-line react-hooks/purity
        z = (Math.random() - 0.5) * 2;
      } while (x * x + y * y + z * z > 1);
      arr[i * 3]     = x * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = z * radius;
    }
    return arr;
  }, [count, radius]);
}

function StarField() {
  const ref = useRef<ThreePoints>(null!);
  const positions = useSpherePoints(STARS_CONFIG.count, STARS_CONFIG.radius);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / STARS_CONFIG.rotationX;
    ref.current.rotation.y -= delta / STARS_CONFIG.rotationY;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={STARS_CONFIG.color}
          size={STARS_CONFIG.size}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

/**
 * Style applied directly to the Canvas (= R3F's outer div).
 * Using fixed 100vw/100vh avoids any height-resolution issues that arise
 * when a lazy-mounted Canvas reads percentage heights before layout settles.
 */
const CANVAS_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: -10,
  pointerEvents: "none",
};

export function StarsBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      style={CANVAS_STYLE}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "low-power" }}
    >
      <StarField />
    </Canvas>
  );
}
