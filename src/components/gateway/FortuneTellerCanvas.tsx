"use client";

import { useEffect, useRef } from "react";

function drawEye(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  hw: number,
  hh: number,
  alpha: number,
) {
  ctx.save();

  const auraGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hw * 2.2);
  auraGrad.addColorStop(0, `rgba(90, 210, 230, ${alpha * 0.55})`);
  auraGrad.addColorStop(1, `rgba(90, 210, 230, 0)`);
  ctx.beginPath();
  ctx.ellipse(cx, cy, hw * 2.2, hh * 4.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = auraGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx, cy, hw, hh * 0.58, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(215, 232, 240, ${alpha * 0.65})`;
  ctx.fill();

  const ir = hh * 0.52;
  const irisGrad = ctx.createRadialGradient(cx, cy - ir * 0.1, ir * 0.1, cx, cy, ir);
  irisGrad.addColorStop(0,   `rgba(60, 195, 215, ${alpha})`);
  irisGrad.addColorStop(0.55, `rgba(30, 150, 175, ${alpha})`);
  irisGrad.addColorStop(1,   `rgba(15, 100, 130, ${alpha * 0.75})`);
  ctx.beginPath();
  ctx.arc(cx, cy, ir, 0, Math.PI * 2);
  ctx.fillStyle = irisGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, ir * 0.42, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(5, 8, 18, ${alpha * 1.1})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + ir * 0.28, cy - ir * 0.28, ir * 0.11, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
  ctx.fill();

  ctx.restore();
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  side: "left" | "right",
  alpha: number,
) {
  const isLeft = side === "left";
  const palmCX  = isLeft ? W * 0.20 : W * 0.80;
  const palmCY  = H * 0.80;
  const palmW   = W * 0.14;
  const palmH   = H * 0.10;
  const fingerL = H * 0.20;
  const fingerR = W * 0.026;
  const tilt    = isLeft ? -0.38 : 0.38;

  ctx.save();
  ctx.translate(palmCX, palmCY);
  ctx.rotate(tilt);

  const palmGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, palmW * 1.1);
  palmGrad.addColorStop(0,   `rgba(238, 220, 205, ${alpha})`);
  palmGrad.addColorStop(0.55, `rgba(222, 204, 188, ${alpha * 0.62})`);
  palmGrad.addColorStop(1,   `rgba(210, 192, 175, 0)`);
  ctx.beginPath();
  ctx.ellipse(0, 0, palmW * 0.5, palmH * 0.52, 0, 0, Math.PI * 2);
  ctx.fillStyle = palmGrad;
  ctx.fill();

  const fingerFans = [-0.30, -0.10, 0.10, 0.30];
  for (const fOff of fingerFans) {
    const fx = Math.sin(fOff) * palmW * 0.28;
    const fy = -palmH * 0.42;
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(fOff * 0.55);
    const fg = ctx.createRadialGradient(0, -fingerL * 0.38, 0, 0, -fingerL * 0.38, fingerR * 1.6);
    fg.addColorStop(0,  `rgba(232, 214, 198, ${alpha * 0.88})`);
    fg.addColorStop(1,  `rgba(218, 200, 183, 0)`);
    ctx.beginPath();
    ctx.ellipse(0, -fingerL * 0.38, fingerR, fingerL * 0.50, 0, 0, Math.PI * 2);
    ctx.fillStyle = fg;
    ctx.fill();
    ctx.restore();
  }

  const thumbDir = isLeft ? 1 : -1;
  ctx.save();
  ctx.translate(palmW * 0.44 * thumbDir, -palmH * 0.08);
  ctx.rotate(thumbDir * 0.52);
  const tg = ctx.createRadialGradient(0, 0, 0, 0, 0, fingerR * 1.9);
  tg.addColorStop(0,  `rgba(228, 210, 193, ${alpha * 0.82})`);
  tg.addColorStop(1,  `rgba(215, 197, 180, 0)`);
  ctx.beginPath();
  ctx.ellipse(0, 0, fingerR * 0.85, fingerL * 0.32, 0, 0, Math.PI * 2);
  ctx.fillStyle = tg;
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

export function FortuneTellerCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = container.clientWidth  || 320;
    let H = container.clientHeight || 600;
    let animId: number;
    const startTime = performance.now();

    canvas.width  = W;
    canvas.height = H;

    const ro = new ResizeObserver(([entry]) => {
      W = entry.contentRect.width;
      H = entry.contentRect.height;
      canvas.width  = W;
      canvas.height = H;
    });
    ro.observe(container);

    function render(now: number) {
      const t     = (now - startTime) / 1000;
      const pulse = 0.78 + 0.22 * Math.sin(t * (Math.PI / 2.2));
      const base  = 0.15 * pulse;

      ctx!.clearRect(0, 0, W, H);

      const eyeHW = W * 0.095;
      const eyeHH = W * 0.038;

      drawEye(ctx!, W * 0.35, H * 0.165, eyeHW, eyeHH, base);
      drawEye(ctx!, W * 0.65, H * 0.165, eyeHW, eyeHH, base);

      drawHand(ctx!, W, H, "left",  base * 0.88);
      drawHand(ctx!, W, H, "right", base * 0.88);

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}
