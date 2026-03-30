"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { MathUtils, TextureLoader } from "three";
import type { Mesh, DirectionalLight as ThreeDirectionalLight } from "three";

export interface PlanetBloom {
  position: [number, number, number];
  intensity: number;
  color: string;
  distance: number;
  decay: number;
  hoverPosition: [number, number, number];
  hoverIntensity: number;
}

export interface PlanetTextures {
  diffuse: string;
  normal?: string;
  specular?: string;
  clouds?: string;
  colorTint?: string;
  atmosphereColor: string;
  ambientIntensity?: number;
  rotationOffset?: number;
  rotationSpeed?: number;
  cloudSpeed?: number;
  bloom: PlanetBloom;
}

interface PlanetMeshProps extends PlanetTextures {
  isHovered: boolean;
}

function PlanetMesh({
  diffuse,
  normal,
  specular,
  clouds,
  colorTint,
  atmosphereColor,
  ambientIntensity = 0.8,
  rotationOffset = 0,
  rotationSpeed = 0.06,
  cloudSpeed,
  bloom,
  isHovered,
}: PlanetMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const cloudRef = useRef<Mesh>(null);
  const dirLightRef = useRef<ThreeDirectionalLight>(null);
  const initialised = useRef(false);

  const diffuseMap = useLoader(TextureLoader, diffuse);
  const normalMap = useLoader(TextureLoader, normal ?? diffuse);
  const specularMap = useLoader(TextureLoader, specular ?? diffuse);
  const cloudMap = useLoader(TextureLoader, clouds ?? diffuse);

  const resolvedCloudSpeed = cloudSpeed ?? rotationSpeed * 1.5;

  useFrame((_, delta) => {
    if (meshRef.current) {
      if (!initialised.current) {
        meshRef.current.rotation.y = rotationOffset;
        initialised.current = true;
      }
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * resolvedCloudSpeed;
    }
    if (dirLightRef.current) {
      const targetIntensity = isHovered ? bloom.hoverIntensity : bloom.intensity;
      dirLightRef.current.intensity = MathUtils.damp(dirLightRef.current.intensity, targetIntensity, 4, delta);
    }
  });

  return (
    <>
      <ambientLight intensity={ambientIntensity} color="#ffffff" />

      <directionalLight
        ref={dirLightRef}
        position={bloom.position}
        intensity={bloom.intensity}
        color={bloom.color}
      />

      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={diffuseMap}
          normalMap={normal ? normalMap : undefined}
          specularMap={specular ? specularMap : undefined}
          color={colorTint ?? "#ffffff"}
          shininess={specular ? 18 : 4}
          specular={specular ? "#aaaaaa" : "#111111"}
        />
      </mesh>

      {clouds && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[1.012, 64, 64]} />
          <meshPhongMaterial
            map={cloudMap}
            transparent
            opacity={0.72}
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
}

function FallbackSphere({ atmosphereColor }: { atmosphereColor: string }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={atmosphereColor} roughness={0.7} />
      </mesh>
    </>
  );
}

const CANVAS_STYLE: React.CSSProperties = {
  background: "transparent",
  width: "100%",
  height: "100%",
};

export function PlanetSphere(props: PlanetMeshProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.7], fov: 44 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={CANVAS_STYLE}
    >
      <Suspense fallback={<FallbackSphere atmosphereColor={props.atmosphereColor} />}>
        <PlanetMesh {...props} />
      </Suspense>
    </Canvas>
  );
}
