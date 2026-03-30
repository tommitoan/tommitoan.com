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
       // Quickly accelerate warp progress
       warpProgress.current = MathUtils.damp(warpProgress.current, 1, 4, delta);
       
       // Calculate target X position based on which portal was clicked (-1 for left, 0 for center, 1 for right)
       const xDir = targetIndex === 0 ? -1 : targetIndex === 2 ? 1 : 0;
       
       // Sucked into portal effect
       // Shrinks rapidly
       const scale = MathUtils.lerp(2.4, 0.1, warpProgress.current);
       root.scale.setScalar(scale);
       
       // Flies upwards and towards the target portal
       root.position.y = MathUtils.lerp(-1.8, 1.5, warpProgress.current);
       root.position.x = MathUtils.lerp(0, xDir * 2.5, warpProgress.current);
       root.position.z = MathUtils.lerp(1, -2, warpProgress.current); // fly away from camera
       
       // Starts spinning out of control
       pose.rotation.z += delta * 15 * warpProgress.current;
       pose.rotation.x += delta * 10 * warpProgress.current;
       
    } else {
      // Idle state
      // Position at bottom center, acting as foreground observer
      root.position.set(0, -1.8, 1);
      root.scale.setScalar(2.4); // make larger to seem closer

      // Slight floating effect for the whole group
      root.position.y = -1.8 + Math.sin(time * 0.5) * 0.05;

      // Billboard looks at camera
      billboard.quaternion.copy(state.camera.quaternion);

      // Subtle breathing/bobbing for the pose
      pose.position.y = MathUtils.damp(
        pose.position.y,
        Math.sin(time * 0.8) * 0.02,
        3.8,
        delta,
      );
      // Subtle rotation/sway
      pose.rotation.z = MathUtils.damp(
        pose.rotation.z,
        Math.sin(time * 0.5) * 0.02,
        2.0,
        delta,
      );
      pose.rotation.x = MathUtils.damp(
        pose.rotation.x,
        Math.cos(time * 0.4) * 0.02,
        3.6,
        delta,
      );
    }

    if (!Array.isArray(glow.material)) {
      glow.material.opacity = (0.4 + Math.sin(time) * 0.1) * (1 - warpProgress.current);
    }
  });

  return (
    <group ref={rootRef}>
      <group ref={billboardRef}>
        <mesh
          ref={glowRef}
          position={[0, -0.02, -0.02]}
          scale={[
            spaceBackgroundConfig.astronaut.spriteWidth * spaceBackgroundConfig.astronaut.glowScale,
            spaceBackgroundConfig.astronaut.spriteHeight * spaceBackgroundConfig.astronaut.glowScale,
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
              spaceBackgroundConfig.astronaut.spriteWidth,
              spaceBackgroundConfig.astronaut.spriteHeight,
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
