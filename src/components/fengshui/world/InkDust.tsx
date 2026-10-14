"use client";

import { useEffect, useRef } from "react";
import { HAN_FONT_STACK } from "./han";
import { useWorldMode } from "./use-world-mode";

const SIZE = 340;
const STEP = 5;

interface Particle {
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** The character 命 made of thousands of gold specks that scatter away from the pointer and drift back. */
export function InkDust({ className }: { className?: string }) {
  const mode = useWorldMode();
  if (mode === "static") {
    return (
      <span className={`fs-glyph-static fs-han ${className ?? ""}`} aria-hidden="true">
        命
      </span>
    );
  }
  return <DustCanvas className={className} />;
}

function DustCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let particles: Particle[] = [];
    let pointer = { x: -9999, y: -9999 };
    let frame = 0;
    let visible = false;
    let disposed = false;

    const sample = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = SIZE;
      offscreen.height = SIZE;
      const paint = offscreen.getContext("2d");
      if (!paint) return;
      paint.fillStyle = "#000";
      paint.font = `290px ${HAN_FONT_STACK}`;
      paint.textAlign = "center";
      paint.textBaseline = "middle";
      paint.fillText("命", SIZE / 2, SIZE / 2 + 10);
      const data = paint.getImageData(0, 0, SIZE, SIZE).data;
      particles = [];
      for (let y = 0; y < SIZE; y += STEP) {
        for (let x = 0; x < SIZE; x += STEP) {
          if (data[(y * SIZE + x) * 4 + 3] > 140) particles.push({ tx: x, ty: y, x: Math.random() * SIZE, y: Math.random() * SIZE, vx: 0, vy: 0 });
        }
      }
    };

    const draw = () => {
      if (!visible || disposed) {
        frame = 0;
        return;
      }
      const box = canvas.getBoundingClientRect();
      const px = pointer.x - box.left;
      const py = pointer.y - box.top;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = "rgba(242,211,145,0.85)";
      for (const p of particles) {
        p.vx += (p.tx - p.x) * 0.022;
        p.vy += (p.ty - p.y) * 0.022;
        const dx = p.x - px;
        const dy = p.y - py;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 90 && distance > 0.1) {
          const push = (90 - distance) / 90;
          p.vx += (dx / distance) * push * 5;
          p.vy += (dy / distance) * push * 5;
        }
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillRect(p.x, p.y, 2.4, 2.4);
      }
      frame = window.requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible && !frame && particles.length > 0) frame = window.requestAnimationFrame(draw);
    });
    observer.observe(canvas);

    const start = () => {
      if (disposed) return;
      sample();
      if (visible && !frame) frame = window.requestAnimationFrame(draw);
    };
    if (document.fonts?.load) void document.fonts.load('290px "Noto Serif SC"', "命").then(start, start);
    else start();

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} width={SIZE} height={SIZE} className={`fs-dust ${className ?? ""}`} aria-hidden="true" />;
}
