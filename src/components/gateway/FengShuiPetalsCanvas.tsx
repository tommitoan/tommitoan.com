"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "#ffb7c5",  // cherry pink
  "#ffd6e0",  // light pink
  "#ffecf1",  // blush white
  "#ff8fa3",  // medium pink
  "#ff6b8a",  // deeper rose
  "#ffffff",  // white
  "#c8f2d5",  // soft green (leaf accent)
  "#e8ffe0",  // pale green
];

const PETAL_COUNT = 52;

interface Petal {
  x: number;
  y: number;
  vy: number;
  swing: number;
  swingSpeed: number;
  swingOffset: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  alpha: number;
  color: string;
}

function makePetal(w: number, h: number, initY?: number): Petal {
  const rng = Math.random;
  return {
    x: rng() * w,
    y: initY !== undefined ? initY : -rng() * 30 - 10,
    vy: 0.25 + rng() * 0.6,
    swing: 20 + rng() * 35,
    swingSpeed: 0.010 + rng() * 0.016,
    swingOffset: rng() * Math.PI * 2,
    rotation: rng() * Math.PI * 2,
    rotSpeed: (rng() - 0.5) * 0.04,
    size: 3 + rng() * 6,
    alpha: 0.40 + rng() * 0.50,
    color: COLORS[Math.floor(rng() * COLORS.length)],
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal, t: number) {
  const sx =
    petal.x + Math.sin(petal.swingOffset + t * petal.swingSpeed) * petal.swing;

  ctx.save();
  ctx.translate(sx, petal.y);
  ctx.rotate(petal.rotation);
  ctx.globalAlpha = petal.alpha;
  ctx.fillStyle = petal.color;
  ctx.shadowBlur = 5;
  ctx.shadowColor = petal.color;

  const s = petal.size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.65, -s * 0.3, s * 0.65, s * 0.3, 0, s);
  ctx.bezierCurveTo(-s * 0.65, s * 0.3, -s * 0.65, -s * 0.3, 0, -s);
  ctx.fill();
  ctx.restore();
}

export function FengShuiPetalsCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let lastTime = 0;
    let petals: Petal[] = [];
    let t = 0;

    const init = (w: number, h: number) => {
      canvas.width = w;
      canvas.height = h;
      petals = Array.from({ length: PETAL_COUNT }, () =>
        makePetal(w, h, Math.random() * h)
      );
    };

    // Observe the explicit container div, not canvas.parentElement,
    // to avoid any Framer Motion ancestor sizing issues
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      if (r.width > 0 && r.height > 0) init(r.width, r.height);
    });
    ro.observe(container);
    if (container.clientWidth > 0) init(container.clientWidth, container.clientHeight);

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      if (now - lastTime < 33) return;
      lastTime = now;
      t++;
      if (!petals.length) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of petals) {
        drawPetal(ctx, p, t);
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (p.y - p.size > canvas.height) {
          Object.assign(p, makePetal(canvas.width, canvas.height));
        }
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    // Explicit overflow:hidden container — belt-and-suspenders clipping
    // that works even when Framer Motion transforms break the parent's overflow:hidden
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.65 }}
      />
    </div>
  );
}
