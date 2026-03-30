"use client";
import { useRef, useEffect } from "react";

interface Ring {
  rFrac: number;
  phase: number;
  phaseSpeed: number;
  baseAlpha: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  blinkPhase: number;
  blinkSpeed: number;
}

const RING_CONFIGS: Array<Omit<Ring, "phase">> = [
  { rFrac: 0.26, phaseSpeed: 0.010, baseAlpha: 0.18 },
  { rFrac: 0.42, phaseSpeed: 0.007, baseAlpha: 0.13 },
  { rFrac: 0.58, phaseSpeed: 0.005, baseAlpha: 0.09 },
  { rFrac: 0.76, phaseSpeed: 0.004, baseAlpha: 0.06 },
  { rFrac: 0.96, phaseSpeed: 0.003, baseAlpha: 0.03 },
];

export function FengShuiMysticCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const ringsRef = useRef<Ring[]>(
    RING_CONFIGS.map((r, i) => ({ ...r, phase: i * 1.3 }))
  );
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 38; i++) {
        particlesRef.current.push({
          x: Math.random(),
          y: Math.random() * 0.85 + 0.05,
          size: 0.5 + Math.random() * 1.6,
          alpha: 0.12 + Math.random() * 0.32,
          blinkPhase: Math.random() * Math.PI * 2,
          blinkSpeed: 0.012 + Math.random() * 0.030,
        });
      }
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.42;

      const baseR = Math.min(w, h) * 0.55;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR);
      grd.addColorStop(0,    "rgba(200, 215, 255, 0.20)");
      grd.addColorStop(0.30, "rgba(180, 200, 255, 0.10)");
      grd.addColorStop(0.65, "rgba(160, 185, 255, 0.04)");
      grd.addColorStop(1,    "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      const halfMin = Math.min(w, h) * 0.5;
      for (const ring of ringsRef.current) {
        ring.phase += ring.phaseSpeed;
        const pulse = 0.60 + 0.40 * Math.sin(ring.phase);
        const r = ring.rFrac * halfMin;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(218, 228, 255, ${(ring.baseAlpha * pulse).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (const p of particlesRef.current) {
        p.blinkPhase += p.blinkSpeed;
        const a = p.alpha * (0.35 + 0.65 * Math.sin(p.blinkPhase));
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 232, 255, ${a.toFixed(3)})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
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
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.90 }}
      />
    </div>
  );
}
