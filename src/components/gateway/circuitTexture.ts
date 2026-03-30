import * as THREE from "three";

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const n = parseInt(c.length === 3 ? c.split("").map(x => x + x).join("") : c, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function generateCircuitTexture(color = "#00ff88", size = 2048): THREE.CanvasTexture {
  const W = size;
  const H = size;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Fully transparent — never fill background
  ctx.clearRect(0, 0, W, H);

  // NO shadowBlur anywhere — it bleeds into surrounding transparent pixels
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  const [r, g, b] = hexToRgb(color);
  const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;

  const rng = mulberry32(42);

  // Sparse grid — 28×28, only 20% density
  const COLS = 28;
  const ROWS = 28;
  const cw = W / COLS;
  const ch = H / ROWS;
  type Pt = { x: number; y: number };
  const grid: (Pt | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (rng() < 0.20) {
        grid[row][col] = {
          x: col * cw + cw * 0.5 + (rng() - 0.5) * cw * 0.25,
          y: row * ch + ch * 0.5 + (rng() - 0.5) * ch * 0.25,
        };
      }
    }
  }

  // L-shaped PCB trace — axis-aligned bends
  const drawTrace = (ax: number, ay: number, bx: number, by: number) => {
    const mx = ax + (bx - ax) * (0.3 + rng() * 0.4);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(mx, ay);
    ctx.lineTo(mx, by);
    ctx.lineTo(bx, by);
    ctx.stroke();
  };

  // ── Dim traces ──────────────────────────────────────────────────────────────
  ctx.strokeStyle = rgba(0.25);
  ctx.lineWidth = 0.9;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const a = grid[row][col];
      if (!a) continue;
      for (const [dr, dc] of [[0,1],[1,0],[0,2],[2,0]] as [number,number][]) {
        const nr = row + dr, nc = col + dc;
        if (nr >= ROWS || nc >= COLS) continue;
        const b = grid[nr][nc];
        if (!b || rng() > 0.40) continue;
        drawTrace(a.x, a.y, b.x, b.y);
      }
    }
  }

  // ── Bright traces ────────────────────────────────────────────────────────────
  ctx.strokeStyle = rgba(0.85);
  ctx.lineWidth = 1.4;
  const rng2 = mulberry32(77);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const a = grid[row][col];
      if (!a) continue;
      for (const [dr, dc] of [[0,1],[1,0]] as [number,number][]) {
        const nr = row + dr, nc = col + dc;
        if (nr >= ROWS || nc >= COLS) continue;
        const b = grid[nr][nc];
        if (!b || rng2() > 0.16) continue;
        const mx = a.x + (b.x - a.x) * (0.3 + rng2() * 0.4);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mx, a.y);
        ctx.lineTo(mx, b.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // ── Node dots — small white-hot filled circles, no shadow, no gradient ────────
  const rng3 = mulberry32(13);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const p = grid[row][col];
      if (!p) continue;
      const radius = 2.0 + rng3() * 2.0;

      ctx.fillStyle = `rgba(255,255,255,0.95)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
