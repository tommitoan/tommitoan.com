"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { MathUtils, TextureLoader, AdditiveBlending } from "three";
import type {
  Mesh,
  Group,
  DirectionalLight as ThreeDirectionalLight,
} from "three";
import * as THREE from "three";
import { generateCircuitTexture } from "./circuitTexture";
import { generateFengShuiCloudTexture } from "./fengShuiCloudTexture";

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface PlanetBloom {
  position: [number, number, number];
  intensity: number;
  color: string;
  hoverIntensity: number;
}

export interface TechOverlayConfig {
  circuitColor?: string;
  circuitOpacity?: number;
}

export interface PlanetTextures {
  diffuse: string;
  normal?: string;
  specular?: string;
  clouds?: string;
  lights?: string;
  colorTint?: string;
  atmosphereColor: string;
  ambientIntensity?: number;
  rotationOffset?: number;
  axialTilt?: number;
  rotationSpeed?: number;
  cloudSpeed?: number;
  bloom: PlanetBloom;
  techOverlay?: TechOverlayConfig;
  fengShuiClouds?: boolean;
  crystalBall?: boolean;
  woodBase?: boolean;
}

interface PlanetMeshProps extends PlanetTextures {
  isHovered: boolean;
}

// ─── Circuit overlay ──────────────────────────────────────────────────────────

function CircuitOverlay({
  color,
  opacity,
  isHovered,
}: {
  color: string;
  opacity: number;
  isHovered: boolean;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useMemo(() => generateCircuitTexture(color, 2048), [color]);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const target = isHovered ? Math.min(opacity * 1.5, 0.85) : opacity;
    matRef.current.opacity = MathUtils.damp(matRef.current.opacity, target, 5, delta);
  });

  return (
    <mesh>
      <sphereGeometry args={[1.004, 64, 64]} />
      <meshBasicMaterial
        ref={matRef}
        map={tex}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Crystal ball pedestal ────────────────────────────────────────────────────
// Renders wood_base.png as a textured plane. A GLSL fragment shader strips the
// white background (luminance threshold) and darkens the wood per user request.
// Image dimensions: 1024×1536. The disc occupies the lower-centre of the image.

const WOOD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const WOOD_FRAG = `
  uniform sampler2D map;
  varying vec2 vUv;
  void main() {
    vec4 col = texture2D(map, vUv);
    vec3 dark = col.rgb * 0.72;
    gl_FragColor = vec4(dark, col.a);
  }
`;

function CrystalBallBase() {
  const tex = useLoader(TextureLoader, '/textures/wood_base.png');

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { map: { value: tex } },
        vertexShader: WOOD_VERT,
        fragmentShader: WOOD_FRAG,
        transparent: true,
        depthWrite: false,
      }),
    [tex]
  );

  const W = 2.3;
  const H = W * (1536 / 1024);

  return (
    <mesh position={[0, -0.82, 0.18]} rotation={[-0.08, 0, 0]}>
      <planeGeometry args={[W, H]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

// ─── Wood-base camera tilt ────────────────────────────────────────────────────
// Tilts camera to look at y=-0.5 so the pedestal disc below the ball is fully
// in frame. Without this the camera bottom barely grazes y=-1.15 (a tiny sliver).
// With lookAt(0,-0.5,0) + fov=55 the camera bottom reaches y≈-1.84, showing the
// full disc rim (rows 873-1200 of wood_base.png, y≈-1.055 to -1.835).

function WoodBaseCameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, -0.3, 0);
    camera.updateMatrixWorld();
  }, [camera]);
  return null;
}

// ─── Planet mesh ──────────────────────────────────────────────────────────────

function PlanetMesh({
  diffuse,
  normal,
  specular,
  clouds,
  lights,
  colorTint,
  ambientIntensity = 4.4,
  rotationOffset = 0,
  axialTilt = 0,
  rotationSpeed = 0.4,
  cloudSpeed,
  bloom,
  isHovered,
  techOverlay,
  fengShuiClouds,
  crystalBall,
  woodBase,
}: PlanetMeshProps) {
  const groupRef    = useRef<Group>(null);
  const cloudRef    = useRef<Mesh>(null);
  const dirLightRef = useRef<ThreeDirectionalLight>(null);
  const initialised = useRef(false);

  const diffuseMap  = useLoader(TextureLoader, diffuse);
  const normalMap   = useLoader(TextureLoader, normal   ?? diffuse);
  const specularMap = useLoader(TextureLoader, specular ?? diffuse);
  const cloudMap    = useLoader(TextureLoader, clouds   ?? diffuse);
  const lightsMap   = useLoader(TextureLoader, lights   ?? diffuse);

  const resolvedCloudSpeed = cloudSpeed ?? rotationSpeed * 1.3;

  useFrame((_, delta) => {
    if (groupRef.current) {
      if (!initialised.current) {
        groupRef.current.rotation.y = rotationOffset;
        groupRef.current.rotation.x = axialTilt;
        initialised.current = true;
      }
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * resolvedCloudSpeed;
    }
    if (dirLightRef.current) {
      const target = isHovered ? bloom.hoverIntensity : bloom.intensity;
      dirLightRef.current.intensity = MathUtils.damp(
        dirLightRef.current.intensity, target, 4, delta
      );
    }
  });

  const circuitColor   = techOverlay?.circuitColor   ?? "#00ff88";
  const circuitOpacity = techOverlay?.circuitOpacity ?? 0.6;

  const fengShuiCloudTex = useMemo(
    () => (fengShuiClouds ? generateFengShuiCloudTexture() : null),
    [fengShuiClouds]
  );

  const crystalSpecularTex = useMemo(() => {
    if (!crystalBall) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const g1 = ctx.createRadialGradient(195, 138, 0, 195, 138, 38);
    g1.addColorStop(0,    "rgba(255,255,255,1.0)");
    g1.addColorStop(0.30, "rgba(255,255,255,0.75)");
    g1.addColorStop(0.65, "rgba(255,255,255,0.20)");
    g1.addColorStop(1,    "rgba(255,255,255,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, 1024, 512);
    const g2 = ctx.createRadialGradient(210, 155, 0, 210, 155, 88);
    g2.addColorStop(0,    "rgba(215,235,255,0.28)");
    g2.addColorStop(0.55, "rgba(215,235,255,0.08)");
    g2.addColorStop(1,    "rgba(215,235,255,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, 1024, 512);
    return new THREE.CanvasTexture(canvas);
  }, [crystalBall]);

  return (
    <>
      <ambientLight intensity={ambientIntensity} color="#ffffff" />
      <directionalLight
        ref={dirLightRef}
        position={bloom.position}
        intensity={bloom.intensity}
        color={bloom.color}
      />
      {crystalBall && (
        <>
          <directionalLight
            position={[0, 2.0, 2.5]}
            intensity={2.8}
            color="#d8ecff"
          />
          {/* Strong upper point light → creates the tight specular hotspot on glass */}
          <pointLight position={[0, 1.0, 1.8]} intensity={12.0} color="#ffffff" distance={8} decay={2} />
        </>
      )}

      <group ref={groupRef}>

        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhongMaterial
            map={diffuseMap}
            normalMap={normal ? normalMap : undefined}
            specularMap={specular ? specularMap : undefined}
            color={colorTint ?? "#ffffff"}
            shininess={crystalBall ? 400 : (specular ? 18 : 4)}
            specular={crystalBall ? "#c0dcff" : (specular ? "#888888" : "#111111")}
            transparent={crystalBall}
            opacity={crystalBall ? 0.78 : 1}
          />
        </mesh>

        {lights && (
          <mesh>
            <sphereGeometry args={[1.001, 64, 64]} />
            <meshBasicMaterial
              map={lightsMap}
              blending={AdditiveBlending}
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
        )}

        {techOverlay && (
          <CircuitOverlay
            color={circuitColor}
            opacity={circuitOpacity}
            isHovered={isHovered}
          />
        )}

      </group>

      {crystalBall && (
        <>
          {/* Tight specular hotspot — upper-left, small sharp reflection like real glass */}
          {crystalSpecularTex && (
            <mesh>
              <sphereGeometry args={[1.006, 64, 64]} />
              <meshBasicMaterial
                map={crystalSpecularTex}
                transparent
                opacity={0.50}
                depthWrite={false}
              />
            </mesh>
          )}
          {/* BackSide rim — very thin glass edge */}
          <mesh>
            <sphereGeometry args={[1.04, 64, 64]} />
            <meshBasicMaterial
              side={THREE.BackSide}
              color="#dceeff"
              transparent
              opacity={0.05}
              depthWrite={false}
            />
          </mesh>
          {/* Primary glass shell — catches specular glint */}
          <mesh>
            <sphereGeometry args={[1.025, 64, 64]} />
            <meshPhongMaterial
              color="#eef4ff"
              transparent
              opacity={0.10}
              shininess={1200}
              specular="#ffffff"
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      {(clouds || fengShuiClouds) && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[1.012, 64, 64]} />
          {crystalBall ? (
            <meshBasicMaterial
              map={fengShuiCloudTex ?? cloudMap}
              color="#ffffff"
              transparent
              opacity={0.65}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          ) : (
            <meshPhongMaterial
              map={fengShuiCloudTex ?? cloudMap}
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          )}
        </mesh>
      )}

      {woodBase && <CrystalBallBase />}
    </>
  );
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

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
      camera={{ position: [0, props.woodBase ? -0.38 : 0, 2.7], fov: props.woodBase ? 55 : 44 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      style={CANVAS_STYLE}
    >
      <Suspense fallback={<FallbackSphere atmosphereColor={props.atmosphereColor} />}>
        {props.woodBase && <WoodBaseCameraSetup />}
        <PlanetMesh {...props} />
      </Suspense>
    </Canvas>
  );
}
