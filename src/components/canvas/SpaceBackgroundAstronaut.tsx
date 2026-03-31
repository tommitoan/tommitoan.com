"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { MathUtils } from "three";
import type { Group } from "three";
import { spaceBackgroundConfig } from "./spaceBackgroundConfig";

export function SpaceBackgroundAstronaut({ isWarping = false, targetIndex = 1 }: { isWarping?: boolean, targetIndex?: number }) {
  const rootRef = useRef<Group>(null);
  const billboardRef = useRef<Group>(null);
  const poseRef = useRef<Group>(null);
  const texture = useLoader(TextureLoader, "/astronaunt_1.png");
  const astronautConfig = spaceBackgroundConfig.astronaut;
  
  const warpProgress = useRef(0);
  
  useFrame((state, delta) => {
    const root = rootRef.current;
    const billboard = billboardRef.current;
    const pose = poseRef.current;

    if (!root || !billboard || !pose) {
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
  });

  return (
    <group ref={rootRef}>
      <group ref={billboardRef}>
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
