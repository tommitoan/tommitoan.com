"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { MathUtils } from "three";
import type { Group, MeshBasicMaterial } from "three";
import { gatewayHomeConfig } from "@/components/gateway/gatewayHomeConfig";
import { pulledTilt, turnSquash } from "@/components/gateway/gatewayHover";

type Props = {
  isWarping?: boolean;
  targetIndex?: number;
  /** While set, the astronaut turns to face the visitor, grows and stands on this side. Null: he faces the globes. */
  talkSide?: "left" | "right" | null;
};

export function SpaceBackgroundAstronaut({ isWarping = false, targetIndex = 1, talkSide = null }: Props) {
  const rootRef = useRef<Group>(null);
  const billboardRef = useRef<Group>(null);
  const poseRef = useRef<Group>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);
  const [back, front, pulled] = useLoader(TextureLoader, [gatewayHomeConfig.astronaut.assetSrc, gatewayHomeConfig.astronaut.frontAssetSrc, gatewayHomeConfig.astronaut.pulledAssetSrc]);
  const astronautConfig = gatewayHomeConfig.astronaut;

  const warpProgress = useRef(0);
  const talkProgress = useRef(0);
  // Where the pull starts: wherever he stands at the click, so he does not jump from the talking place to the resting one.
  const pullFrom = useRef<{ x: number; y: number; scale: number } | null>(null);
  // The side he stands on is kept while he turns back, so he does not slide across the screen as he leaves.
  const lastSide = useRef<"left" | "right">("right");

  useFrame((state, delta) => {
    const root = rootRef.current;
    const billboard = billboardRef.current;
    const pose = poseRef.current;

    if (!root || !billboard || !pose) {
      return;
    }

    const time = state.clock.elapsedTime;

    if (isWarping) {
      // The pull starts from where he stands: he is already facing us when he was talking, and stays facing us as he is
      // dragged backward into the portal, arms and legs reaching toward the camera. No spinning.
      if (!pullFrom.current) {
        const talk = talkProgress.current;
        const talkX = (lastSide.current === "left" ? -1 : 1) * astronautConfig.talk.x;
        pullFrom.current = {
          x: MathUtils.lerp(astronautConfig.placement.x, talkX, talk),
          y: MathUtils.lerp(astronautConfig.placement.y, astronautConfig.talk.y, talk),
          scale: MathUtils.lerp(astronautConfig.placement.scale, astronautConfig.talk.scale, talk),
        };
      }
      const from = pullFrom.current;
      pose.scale.x = 1;
      const material = materialRef.current;
      if (material && material.map !== pulled) {
        material.map = pulled;
        material.needsUpdate = true;
      }
      warpProgress.current = MathUtils.damp(warpProgress.current, 1, astronautConfig.warp.progressDamping, delta);
      const pull = warpProgress.current;

      const xDir = targetIndex === 0 ? -1 : targetIndex === 2 ? 1 : 0;

      root.scale.setScalar(MathUtils.lerp(from.scale, astronautConfig.warp.endScale, pull));
      root.position.y = MathUtils.lerp(from.y, astronautConfig.warp.endY, pull);
      root.position.x = MathUtils.lerp(from.x, xDir * astronautConfig.warp.targetOffsetX, pull);
      root.position.z = MathUtils.lerp(astronautConfig.placement.z, astronautConfig.warp.endZ, pull);

      billboard.quaternion.copy(state.camera.quaternion);
      pose.rotation.x = 0;
      pose.rotation.z = pulledTilt(xDir, pull, time, astronautConfig.warp.lean, astronautConfig.warp.wobble);
    } else {
      pullFrom.current = null;
      warpProgress.current = MathUtils.damp(warpProgress.current, 0, astronautConfig.warp.progressDamping, delta);
      if (talkSide) lastSide.current = talkSide;
      talkProgress.current = MathUtils.damp(talkProgress.current, talkSide ? 1 : 0, 3.2, delta);
      const talk = talkProgress.current;
      const talkX = (lastSide.current === "left" ? -1 : 1) * astronautConfig.talk.x;
      root.position.set(
        MathUtils.lerp(astronautConfig.placement.x, talkX, talk),
        MathUtils.lerp(astronautConfig.placement.y, astronautConfig.talk.y, talk),
        astronautConfig.placement.z,
      );
      root.scale.setScalar(MathUtils.lerp(astronautConfig.placement.scale, astronautConfig.talk.scale, talk));

      // He turns round: the picture narrows to a line, is swapped for the front one, and widens again.
      pose.scale.x = turnSquash(talk);
      const material = materialRef.current;
      const wanted = talk > 0.5 ? front : back;
      if (material && material.map !== wanted) {
        material.map = wanted;
        material.needsUpdate = true;
      }

      if (astronautConfig.idle.enabled) {
        root.position.y += Math.sin(time * astronautConfig.idle.floatSpeed) * astronautConfig.idle.floatAmplitudeY;
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
              ref={materialRef}
              map={back}
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
