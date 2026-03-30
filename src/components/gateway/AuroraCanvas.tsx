"use client";

import { useEffect, useRef } from "react";

export interface WindConfig {
  density?: number;    // number of bands to render (4–24, default uses all defs)
  speed?: number;      // phase-speed multiplier, e.g. 0.5 = half speed, 2.0 = double (default 1.0)
  thickness?: number;  // thickness multiplier, e.g. 1.5 = 50 % thicker (default 1.0)
}

interface Band {
  yFraction: number;
  amplitude: number;
  frequency: number;
  phase: number;
  phaseSpeed: number;
  thickness: number;
  hue: number;
  saturation: number;
  alpha: number;
  lightness: number;
}

type BandDef = Omit<Band, "yFraction" | "amplitude" | "frequency" | "phase" | "phaseSpeed">;

const AURORA_DEFS: BandDef[] = [
  { hue: 270, saturation: 90, alpha: 0.52, thickness: 14, lightness: 78 },
  { hue: 195, saturation: 95, alpha: 0.46, thickness:  9, lightness: 82 },
  { hue: 285, saturation: 85, alpha: 0.58, thickness: 16, lightness: 75 },
  { hue: 215, saturation: 90, alpha: 0.42, thickness: 10, lightness: 80 },
  { hue: 305, saturation: 80, alpha: 0.50, thickness: 12, lightness: 77 },
  { hue: 180, saturation: 100,alpha: 0.44, thickness:  8, lightness: 76 },
  { hue: 250, saturation: 90, alpha: 0.62, thickness: 18, lightness: 74 },
  { hue: 260, saturation: 85, alpha: 0.44, thickness: 11, lightness: 79 },
  { hue: 190, saturation: 92, alpha: 0.40, thickness:  9, lightness: 81 },
  { hue: 275, saturation: 88, alpha: 0.54, thickness: 13, lightness: 76 },
  { hue: 200, saturation: 90, alpha: 0.48, thickness: 10, lightness: 80 },
  { hue: 290, saturation: 82, alpha: 0.56, thickness: 15, lightness: 77 },
];

// Silver/white wind: wide alpha + lightness range creates dark-white ↔ bright-white contrast.
// Low lightness (70–78) = steel/slate bands; high lightness (94–100) = pure white highlights.
const SILVER_DEFS: BandDef[] = [
  { hue: 205, saturation: 48, alpha: 0.75, thickness: 14, lightness: 92  },
  { hue: 195, saturation: 14, alpha: 0.32, thickness:  9, lightness: 72  },
  { hue: 218, saturation: 55, alpha: 0.88, thickness: 16, lightness: 98  },
  { hue: 202, saturation: 12, alpha: 0.38, thickness: 10, lightness: 74  },
  { hue: 222, saturation: 52, alpha: 0.80, thickness: 12, lightness: 95  },
  { hue: 192, saturation: 10, alpha: 0.28, thickness:  8, lightness: 70  },
  { hue: 210, saturation: 58, alpha: 0.90, thickness: 18, lightness: 99  },
  { hue: 206, saturation: 36, alpha: 0.52, thickness: 11, lightness: 84  },
  { hue: 196, saturation: 12, alpha: 0.36, thickness:  9, lightness: 73  },
  { hue: 215, saturation: 52, alpha: 0.82, thickness: 13, lightness: 96  },
  { hue: 200, saturation: 22, alpha: 0.44, thickness: 10, lightness: 78  },
  { hue: 212, saturation: 55, alpha: 0.85, thickness: 15, lightness: 97  },
];

function makeBands(defs: BandDef[], density?: number, speedMult = 1, thickMult = 1): Band[] {
  const src = density ? defs.slice(0, Math.min(density, defs.length)) : defs;
  const count = src.length;
  return src.map((def, i) => ({
    ...def,
    thickness: def.thickness * thickMult,
    yFraction: (i + 0.5) / count + (Math.random() * 0.04 - 0.02),
    amplitude: 18 + Math.random() * 28,
    frequency: 0.004 + Math.random() * 0.004,
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: (0.004 + Math.random() * 0.006) * speedMult,
  }));
}

export function AuroraCanvas({
  theme = "aurora",
  windConfig,
}: {
  theme?: "aurora" | "silver";
  windConfig?: WindConfig;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const defs   = theme === "silver" ? SILVER_DEFS : AURORA_DEFS;
    const speed  = windConfig?.speed     ?? 1.0;
    const thick  = windConfig?.thickness ?? 1.0;
    const bands  = makeBands(defs, windConfig?.density, speed, thick);
    let w = 0;
    let h = 0;

    const init = (width: number, height: number) => {
      w = width;
      h = height;
      canvas.width  = w;
      canvas.height = h;
    };

    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      if (r.width > 0 && r.height > 0) init(r.width, r.height);
    });
    ro.observe(container);
    if (container.clientWidth > 0) init(container.clientWidth, container.clientHeight);

    const drawBand = (band: Band) => {
      const cy    = band.yFraction * h;
      const steps = Math.ceil(w / 4);
      const l1    = band.lightness;
      const l2    = Math.min(100, band.lightness + 6);

      const points: [number, number][] = [];
      for (let s = 0; s <= steps; s++) {
        const x = (s / steps) * w;
        const y = cy + Math.sin(x * band.frequency + band.phase) * band.amplitude;
        points.push([x, y]);
      }

      const xGrad = ctx.createLinearGradient(0, 0, w, 0);
      xGrad.addColorStop(0,    `hsla(${band.hue}, ${band.saturation}%, ${l1}%, 0)`);
      xGrad.addColorStop(0.08, `hsla(${band.hue}, ${band.saturation}%, ${l1}%, 1)`);
      xGrad.addColorStop(0.5,  `hsla(${band.hue}, ${band.saturation}%, ${l2}%, 1)`);
      xGrad.addColorStop(0.92, `hsla(${band.hue}, ${band.saturation}%, ${l1}%, 1)`);
      xGrad.addColorStop(1,    `hsla(${band.hue}, ${band.saturation}%, ${l1}%, 0)`);

      const layers = [
        { width: band.thickness * 3.2, alpha: band.alpha * 0.10 },
        { width: band.thickness * 2.0, alpha: band.alpha * 0.25 },
        { width: band.thickness * 1.1, alpha: band.alpha * 0.58 },
        { width: band.thickness * 0.4, alpha: band.alpha * 1.00 },
      ];

      for (const layer of layers) {
        ctx.save();
        ctx.globalAlpha = layer.alpha;
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const [x, y] = points[i];
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle  = xGrad;
        ctx.lineWidth    = layer.width;
        ctx.lineCap      = "round";
        ctx.lineJoin     = "round";
        ctx.stroke();
        ctx.restore();
      }
    };

    const tick = () => {
      animId = requestAnimationFrame(tick);
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);
      for (const band of bands) {
        band.phase += band.phaseSpeed;
        drawBand(band);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [theme, windConfig]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.85 }}
      />
    </div>
  );
}
