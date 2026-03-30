import * as THREE from "three";

function seededRand() {
  let s = 31337;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

function drawWispyCloud(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  length: number,
  maxR: number,
  angle: number,
  alpha: number,
  rand: () => number,
) {
  const segments = 5 + Math.floor(rand() * 4);
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1);
    const x = cx + Math.cos(angle) * length * (t - 0.5);
    const y = cy + Math.sin(angle) * length * (t - 0.5);
    const r = maxR * (0.52 + 0.48 * Math.sin(t * Math.PI));
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0,    `rgba(255, 255, 255, ${alpha})`);
    grad.addColorStop(0.40, `rgba(248, 240, 255, ${alpha * 0.62})`);
    grad.addColorStop(1,    `rgba(230, 215, 255, 0)`);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

export function generateFengShuiCloudTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx  = canvas.getContext("2d")!;
  const rand = seededRand();

  ctx.clearRect(0, 0, W, H);

  const clouds: Array<{ cx: number; cy: number; len: number; r: number; a: number }> = [
    { cx: 80,   cy: 70,  len: 155, r: 29, a: 0.50 },
    { cx: 275,  cy: 58,  len: 185, r: 33, a: 0.55 },
    { cx: 488,  cy: 78,  len: 150, r: 27, a: 0.48 },
    { cx: 678,  cy: 52,  len: 172, r: 31, a: 0.52 },
    { cx: 868,  cy: 68,  len: 142, r: 26, a: 0.46 },
    { cx: 1010, cy: 88,  len: 125, r: 24, a: 0.43 },

    { cx: 155,  cy: 180, len: 196, r: 35, a: 0.53 },
    { cx: 375,  cy: 165, len: 182, r: 32, a: 0.56 },
    { cx: 565,  cy: 190, len: 162, r: 30, a: 0.49 },
    { cx: 755,  cy: 172, len: 192, r: 34, a: 0.52 },
    { cx: 945,  cy: 180, len: 150, r: 28, a: 0.47 },

    { cx: 68,   cy: 305, len: 170, r: 30, a: 0.48 },
    { cx: 248,  cy: 320, len: 205, r: 36, a: 0.51 },
    { cx: 448,  cy: 295, len: 160, r: 29, a: 0.45 },
    { cx: 635,  cy: 315, len: 180, r: 32, a: 0.50 },
    { cx: 830,  cy: 298, len: 155, r: 28, a: 0.44 },
    { cx: 998,  cy: 310, len: 135, r: 25, a: 0.41 },

    { cx: 138,  cy: 425, len: 165, r: 29, a: 0.42 },
    { cx: 338,  cy: 440, len: 180, r: 31, a: 0.45 },
    { cx: 530,  cy: 420, len: 150, r: 27, a: 0.39 },
    { cx: 725,  cy: 435, len: 170, r: 30, a: 0.43 },
    { cx: 915,  cy: 422, len: 140, r: 26, a: 0.37 },
  ];

  for (const c of clouds) {
    const angle = (rand() - 0.5) * 0.28;
    drawWispyCloud(ctx, c.cx, c.cy, c.len, c.r, angle, c.a, rand);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
