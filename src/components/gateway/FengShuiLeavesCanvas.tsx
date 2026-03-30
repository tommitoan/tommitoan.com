"use client";

import { useEffect, useRef } from "react";

const LEAF_COLORS = [
  "#6dbe45",
  "#7dc855",
  "#5aaa35",
  "#8fd065",
  "#4d9a2a",
  "#b5d97a",
  "#9ed160",
  "#65b540",
];

export interface LeavesConfig {
  count?: number;
  speedMin?: number;
  speedMax?: number;
  sizeMin?: number;
  sizeMax?: number;
}

const DEFAULTS: Required<LeavesConfig> = {
  count: 40,
  speedMin: 0.90,
  speedMax: 2.20,
  sizeMin: 4,
  sizeMax: 11,
};

interface Leaf {
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

function makeLeaf(w: number, h: number, cfg: Required<LeavesConfig>, initY?: number): Leaf {
  const r = Math.random;
  return {
    x: r() * w,
    y: initY !== undefined ? initY : -r() * 40 - 8,
    vy: cfg.speedMin + r() * (cfg.speedMax - cfg.speedMin),
    swing: 18 + r() * 32,
    swingSpeed: 0.008 + r() * 0.014,
    swingOffset: r() * Math.PI * 2,
    rotation: r() * Math.PI * 2,
    rotSpeed: (r() - 0.5) * 0.035,
    size: cfg.sizeMin + r() * (cfg.sizeMax - cfg.sizeMin),
    alpha: 0.28 + r() * 0.52,
    color: LEAF_COLORS[Math.floor(r() * LEAF_COLORS.length)],
  };
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf, t: number) {
  const sx = leaf.x + Math.sin(leaf.swingOffset + t * leaf.swingSpeed) * leaf.swing;

  ctx.save();
  ctx.translate(sx, leaf.y);
  ctx.rotate(leaf.rotation);
  ctx.globalAlpha = leaf.alpha;

  const s = leaf.size;

  ctx.fillStyle = leaf.color;
  ctx.beginPath();
  ctx.moveTo(0, -s * 1.9);
  ctx.bezierCurveTo( s * 0.55, -s * 0.7,  s * 0.55,  s * 0.7, 0,  s * 1.9);
  ctx.bezierCurveTo(-s * 0.55,  s * 0.7, -s * 0.55, -s * 0.7, 0, -s * 1.9);
  ctx.closePath();
  ctx.fill();

  const r = parseInt(leaf.color.slice(1, 3), 16);
  const g = parseInt(leaf.color.slice(3, 5), 16);
  const b = parseInt(leaf.color.slice(5, 7), 16);
  ctx.strokeStyle = `rgba(${Math.max(0, r - 50)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 30)}, ${leaf.alpha * 0.35})`;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -s * 1.9);
  ctx.lineTo(0,  s * 1.9);
  ctx.stroke();

  ctx.restore();
}

export function FengShuiLeavesCanvas({ config }: { config?: LeavesConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const cfgRef       = useRef<Required<LeavesConfig>>({ ...DEFAULTS, ...config });

  useEffect(() => {
    cfgRef.current = { ...DEFAULTS, ...config };
  }, [config]);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId  = 0;
    let lastTime = 0;
    let leaves: Leaf[] = [];
    let t = 0;

    const init = (w: number, h: number) => {
      canvas.width  = w;
      canvas.height = h;
      const cfg = cfgRef.current;
      leaves = Array.from({ length: cfg.count }, () =>
        makeLeaf(w, h, cfg, Math.random() * h)
      );
    };

    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      if (r.width > 0 && r.height > 0) init(r.width, r.height);
    });
    ro.observe(container);
    if (container.clientWidth > 0) init(container.clientWidth, container.clientHeight);

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);
      if (now - lastTime < 30) return;
      lastTime = now;
      t++;
      if (!leaves.length) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const leaf of leaves) {
        drawLeaf(ctx, leaf, t);
        leaf.y += leaf.vy;
        leaf.rotation += leaf.rotSpeed;
        if (leaf.y - leaf.size > canvas.height) {
          Object.assign(leaf, makeLeaf(canvas.width, canvas.height, cfgRef.current));
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
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.70 }}
      />
    </div>
  );
}
