"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import type { Points as ThreePoints } from "three";

const STARS_CONFIG = {
  count: 300,
  radius: 1.2,
  size: 0.004,
  color: "#c8a8ff",
  rotationX: 10,
  rotationY: 15,
};

const GATEWAY_STARS_CONFIG = {
  count: 1500,
  radius: 1.2,
  size: 0.003,
  color: "#915EFF",
  rotationX: 15,
  rotationY: 20,
};

function useSpherePoints(count: number, radius: number): Float32Array {
  return useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number;
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 2;
      } while (x * x + y * y + z * z > 1);
      arr[i * 3] = x * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = z * radius;
    }
    return arr;
  }, [count, radius]);
}

function StarField({ config }: { config: typeof STARS_CONFIG }) {
  const ref = useRef<ThreePoints>(null!);
  const positions = useSpherePoints(config.count, config.radius);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / config.rotationX;
    ref.current.rotation.y -= delta / config.rotationY;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={config.color}
          size={config.size}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

const CANVAS_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 2,
  pointerEvents: "none",
};

const CANVAS_ABSOLUTE_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

export function StarsBackground({ absolute = false, gateway = false }: { absolute?: boolean; gateway?: boolean }) {
  const config = gateway ? GATEWAY_STARS_CONFIG : STARS_CONFIG;
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      style={absolute ? CANVAS_ABSOLUTE_STYLE : CANVAS_STYLE}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "low-power" }}
    >
      <StarField config={config} />
    </Canvas>
  );
}
