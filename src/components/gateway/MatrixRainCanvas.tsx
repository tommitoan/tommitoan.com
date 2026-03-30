"use client";

import { useEffect, useRef } from "react";

// Mostly 0s and 1s for the "compile code" feel, plus hex/symbols for variety
const CHARS =
  "01101001011010010110100101101001011010010110" +
  "ABCDEFabcdef0123456789!?<>#@";

const FS = 14; // font size / column width in px

export function MatrixRainCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let lastTime = 0;
    let cols = 0;
    let drops: number[] = [];
    let speeds: number[] = [];

    const init = (w: number, h: number) => {
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      cols = Math.floor(w / FS);
      drops = Array.from(
        { length: cols },
        (_, i) => -(Math.random() * (h / FS)) - (i % 9) * 2
      );
      speeds = Array.from(
        { length: cols },
        () => 0.5 + Math.random() * 1.4
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
      // ~22 fps — rain doesn't need 60fps and saves CPU
      if (now - lastTime < 45) return;
      lastTime = now;
      if (cols === 0) return;

      // Semi-transparent black fill creates the fading trail
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${FS}px monospace`;

      for (let i = 0; i < cols; i++) {
        const py = Math.floor(drops[i]) * FS;

        if (py >= 0 && py < canvas.height) {
          const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
          // Head character: near-white bright green
          ctx.fillStyle = "rgba(200,255,215,0.96)";
          ctx.fillText(ch, i * FS, py);
        }

        drops[i] += speeds[i];

        // Reset column when it passes the bottom — random chance for natural stagger
        if (drops[i] * FS > canvas.height && Math.random() > 0.974) {
          drops[i] = -(Math.random() * 18 + 4);
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
        ref={ref}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.42 }}
      />
    </div>
  );
}
