"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import type { Points as ThreePoints } from "three";
import { gatewayHomeConfig } from "@/components/gateway/gatewayHomeConfig";

type StarsConfig =
  | (typeof gatewayHomeConfig.spaceTheme.stars)["content"]
  | (typeof gatewayHomeConfig.spaceTheme.stars)["gateway"];

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function useSpherePoints(count: number, radius: number): Float32Array {
  return useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let seed = i * 3 + 1;
      let x: number, y: number, z: number;
      do {
        x = (seededRandom(seed) - 0.5) * 2;
        y = (seededRandom(seed + 1) - 0.5) * 2;
        z = (seededRandom(seed + 2) - 0.5) * 2;
        seed += 3;
      } while (x * x + y * y + z * z > 1);
      arr[i * 3] = x * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = z * radius;
    }
    return arr;
  }, [count, radius]);
}

function StarField({ config }: { config: StarsConfig }) {
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
  const config = gateway ? gatewayHomeConfig.spaceTheme.stars.gateway : gatewayHomeConfig.spaceTheme.stars.content;
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
