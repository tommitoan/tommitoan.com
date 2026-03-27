"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, LinearFilter, MathUtils, SRGBColorSpace, Vector3 } from "three";
import type { Group, Mesh } from "three";
import { spaceBackgroundConfig } from "./spaceBackgroundConfig";

const OUTLINE = "#593e8f";
const SUIT = "#fffafc";
const SUIT_SOFT = "#e6ddff";
const VISOR = "#251649";
const ACCENT = "#54caff";

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function capsulePath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  roundedRectPath(ctx, x, y, width, height, Math.min(width, height) / 2);
}

function strokeAndFill(
  ctx: CanvasRenderingContext2D,
  fill: string,
  lineWidth = 18,
  stroke = OUTLINE,
) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = stroke;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawAstronautTexture(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  canvas.width = 1024;
  canvas.height = 1024;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.save();
  ctx.translate(512, 530);
  ctx.rotate(0.08);

  ctx.save();
  ctx.translate(132, 34);
  ctx.rotate(0.06);
  capsulePath(ctx, -42, -118, 84, 184);
  strokeAndFill(ctx, "#f3edff", 18);
  ctx.restore();

  ctx.save();
  ctx.translate(-2, 20);
  ctx.rotate(-0.04);
  capsulePath(ctx, -118, -112, 210, 240);
  strokeAndFill(ctx, SUIT, 18);
  ctx.restore();

  ctx.save();
  ctx.translate(2, -246);
  ctx.rotate(0.02);
  ctx.scale(1.08, 1);
  ctx.beginPath();
  ctx.arc(0, 0, 164, 0, Math.PI * 2);
  strokeAndFill(ctx, SUIT, 18);
  ctx.restore();

  ctx.save();
  ctx.translate(6, -240);
  ctx.scale(1.18, 1.06);
  ctx.beginPath();
  ctx.arc(0, 0, 114, 0, Math.PI * 2);
  strokeAndFill(ctx, VISOR, 18);
  ctx.restore();

  ctx.save();
  ctx.translate(14, -266);
  ctx.rotate(-0.48);
  ctx.strokeStyle = "rgba(255,255,255,0.92)";
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(0, 0, 82, 3.78, 5.18);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(18, -208);
  ctx.rotate(-0.38);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 3.7, 4.88);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(12, -34);
  roundedRectPath(ctx, -46, -24, 92, 70, 22);
  strokeAndFill(ctx, SUIT_SOFT, 16);
  ctx.beginPath();
  ctx.arc(0, 12, 15, 0, Math.PI * 2);
  ctx.fillStyle = ACCENT;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 12, 7, 0, Math.PI * 2);
  ctx.fillStyle = "#e6fbff";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(-136, -22);
  ctx.rotate(1.08);
  capsulePath(ctx, -34, -106, 64, 162);
  strokeAndFill(ctx, SUIT, 16);
  capsulePath(ctx, 24, 18, 58, 118);
  strokeAndFill(ctx, SUIT, 16);
  ctx.beginPath();
  ctx.arc(72, 126, 30, 0, Math.PI * 2);
  strokeAndFill(ctx, SUIT, 16);
  ctx.restore();

  ctx.save();
  ctx.translate(122, 20);
  ctx.rotate(-0.16);
  capsulePath(ctx, -32, -100, 64, 170);
  strokeAndFill(ctx, SUIT, 16);
  capsulePath(ctx, -30, 52, 62, 114);
  strokeAndFill(ctx, SUIT, 16);
  ctx.beginPath();
  ctx.arc(0, 154, 30, 0, Math.PI * 2);
  strokeAndFill(ctx, SUIT, 16);
  ctx.restore();

  ctx.save();
  ctx.translate(-54, 184);
  ctx.rotate(0.32);
  capsulePath(ctx, -42, -92, 84, 160);
  strokeAndFill(ctx, SUIT, 16);
  capsulePath(ctx, -30, 54, 64, 96);
  strokeAndFill(ctx, SUIT, 16);
  ctx.beginPath();
  ctx.ellipse(10, 146, 52, 38, 0.18, 0, Math.PI * 2);
  strokeAndFill(ctx, SUIT_SOFT, 16);
  ctx.restore();

  ctx.save();
  ctx.translate(74, 192);
  ctx.rotate(-0.08);
  capsulePath(ctx, -42, -92, 84, 168);
  strokeAndFill(ctx, SUIT, 16);
  capsulePath(ctx, -32, 62, 66, 94);
  strokeAndFill(ctx, SUIT, 16);
  ctx.beginPath();
  ctx.ellipse(0, 154, 52, 38, 0.02, 0, Math.PI * 2);
  strokeAndFill(ctx, SUIT_SOFT, 16);
  ctx.restore();

  ctx.save();
  ctx.translate(164, -186);
  ctx.rotate(0.08);
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  strokeAndFill(ctx, SUIT, 16);
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  strokeAndFill(ctx, SUIT_SOFT, 10);
  ctx.restore();

  ctx.restore();
}

function createAstronautTexture() {
  const canvas = document.createElement("canvas");
  drawAstronautTexture(canvas);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

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
  const texture = useMemo(() => createAstronautTexture(), []);
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
