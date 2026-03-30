"use client";
import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { CanvasTexture, LinearFilter, MathUtils, SRGBColorSpace } from "three";
import type { Group, Mesh } from "three";
import { spaceBackgroundConfig } from "./spaceBackgroundConfig";

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  const gradient = ctx.createRadialGradient(256, 256, 20, 256, 256, 220);
  gradient.addColorStop(0, "rgba(150, 199, 255, 0.72)");
  gradient.addColorStop(0.45, "rgba(139, 92, 246, 0.28)");
  gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function SpaceBackgroundAstronaut({ isWarping = false, targetIndex = 1 }: { isWarping?: boolean, targetIndex?: number }) {
  const rootRef = useRef<Group>(null);
  const billboardRef = useRef<Group>(null);
  const poseRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, "/astronaunt_1.png");
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const astronautConfig = spaceBackgroundConfig.astronaut;
  
  // Track warp progress
  const warpProgress = useRef(0);
  
  useFrame((state, delta) => {
    const root = rootRef.current;
    const billboard = billboardRef.current;
    const pose = poseRef.current;
    const glow = glowRef.current;

    if (!root || !billboard || !pose || !glow) {
      return;
    }

    const time = state.clock.elapsedTime;
    
    if (isWarping) {
       warpProgress.current = MathUtils.damp(warpProgress.current, 1, astronautConfig.warp.progressDamping, delta);
        
       const xDir = targetIndex === 0 ? -1 : targetIndex === 2 ? 1 : 0;
        
       const scale = MathUtils.lerp(astronautConfig.placement.scale, astronautConfig.warp.endScale, warpProgress.current);
       root.scale.setScalar(scale);
        
       root.position.y = MathUtils.lerp(astronautConfig.placement.y, astronautConfig.warp.endY, warpProgress.current);
       root.position.x = MathUtils.lerp(astronautConfig.placement.x, xDir * astronautConfig.warp.targetOffsetX, warpProgress.current);
       root.position.z = MathUtils.lerp(astronautConfig.placement.z, astronautConfig.warp.endZ, warpProgress.current);
        
       pose.rotation.z += delta * astronautConfig.warp.spinSpeedZ * warpProgress.current;
       pose.rotation.x += delta * astronautConfig.warp.spinSpeedX * warpProgress.current;
        
     } else {
      warpProgress.current = MathUtils.damp(warpProgress.current, 0, astronautConfig.warp.progressDamping, delta);
      root.position.set(
        astronautConfig.placement.x,
        astronautConfig.placement.y,
        astronautConfig.placement.z,
      );
      root.scale.setScalar(astronautConfig.placement.scale);

      if (astronautConfig.idle.enabled) {
        root.position.y = astronautConfig.placement.y + Math.sin(time * astronautConfig.idle.floatSpeed) * astronautConfig.idle.floatAmplitudeY;
      }

      billboard.quaternion.copy(state.camera.quaternion);

      const poseY = astronautConfig.idle.enabled
        ? Math.sin(time * astronautConfig.idle.poseBobSpeed) * astronautConfig.idle.poseBobAmplitudeY
        : 0;

      const tiltZ = astronautConfig.idle.enabled
        ? Math.sin(time * astronautConfig.idle.poseTiltSpeedZ) * astronautConfig.idle.poseTiltAmplitudeZ
        : 0;

      const tiltX = astronautConfig.idle.enabled
        ? Math.cos(time * astronautConfig.idle.poseTiltSpeedX) * astronautConfig.idle.poseTiltAmplitudeX
        : 0;

      pose.position.y = MathUtils.damp(pose.position.y, poseY, 3.8, delta);
      pose.rotation.z = MathUtils.damp(pose.rotation.z, tiltZ, 2.0, delta);
      pose.rotation.x = MathUtils.damp(pose.rotation.x, tiltX, 3.6, delta);
    }

    if (!Array.isArray(glow.material)) {
      glow.material.opacity = (
        astronautConfig.glow.baseOpacity +
        Math.sin(time * astronautConfig.glow.pulseSpeed) * astronautConfig.glow.pulseAmplitude
      ) * (1 - warpProgress.current);
    }
  });

  return (
    <group ref={rootRef}>
      <group ref={billboardRef}>
        <mesh
          ref={glowRef}
          position={[0, -0.02, -0.02]}
          scale={[
            astronautConfig.sprite.width * astronautConfig.sprite.glowScale,
            astronautConfig.sprite.height * astronautConfig.sprite.glowScale,
            1,
          ]}
          renderOrder={1}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={glowTexture}
            transparent
            opacity={0.6}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <group ref={poseRef}>
          <mesh
            scale={[
              astronautConfig.sprite.width,
              astronautConfig.sprite.height,
              1,
            ]}
            renderOrder={2}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={texture}
              transparent
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
