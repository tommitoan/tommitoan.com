import { bezier, type Point, type SceneFrame } from "./scene-math";

/** Canvas drawing for the night sky and the guiding star. The shapes come from scene-math; this only paints them. */

export interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
}

/** A few stars in every twelve are large and glow; the rest are fine points, like the star dust of the other pages. */
export function makeStars(count: number, random: () => number = Math.random): Star[] {
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random() * 0.9,
    r: random() < 0.08 ? 1.5 + random() * 1.1 : random() * 1.0 + 0.3,
    phase: random() * 6,
  }));
}

/** Stars above this radius also get a soft halo. */
export const GLOW_RADIUS = 1.4;

export function drawStarfield(ctx: CanvasRenderingContext2D, width: number, height: number, stars: readonly Star[], timeMs: number, alpha: number): void {
  if (alpha <= 0.01) return;
  for (const star of stars) {
    const a = (0.3 + 0.7 * Math.abs(Math.sin(timeMs / 900 + star.phase))) * alpha;
    const x = star.x * width;
    const y = star.y * height;
    if (star.r > GLOW_RADIUS) {
      const halo = ctx.createRadialGradient(x, y, 0, x, y, star.r * 5);
      halo.addColorStop(0, `rgba(214,226,255,${(0.42 * a).toFixed(3)})`);
      halo.addColorStop(1, "rgba(214,226,255,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, star.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = `rgba(236,243,255,${a.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number): void {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 7);
  glow.addColorStop(0, `rgba(255,240,200,${0.9 * alpha})`);
  glow.addColorStop(0.25, `rgba(255,214,140,${0.35 * alpha})`);
  glow.addColorStop(1, "rgba(255,214,140,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(255,246,220,${0.8 * alpha})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - radius * 8, y);
  ctx.lineTo(x + radius * 8, y);
  ctx.moveTo(x, y - radius * 8);
  ctx.lineTo(x, y + radius * 8);
  ctx.stroke();
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x - radius * 3.2, y - radius * 3.2);
  ctx.lineTo(x + radius * 3.2, y + radius * 3.2);
  ctx.moveTo(x - radius * 3.2, y + radius * 3.2);
  ctx.lineTo(x + radius * 3.2, y - radius * 3.2);
  ctx.stroke();
  ctx.fillStyle = `rgba(255,252,240,${alpha})`;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.9, 0, Math.PI * 2);
  ctx.fill();
}

/** A small four-point sparkle, a thin cross with a bright core. */
function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number): void {
  ctx.strokeStyle = `rgba(255,246,220,${alpha.toFixed(3)})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.stroke();
  ctx.fillStyle = `rgba(255,252,240,${alpha.toFixed(3)})`;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

/** Six small sparkles that twinkle on their own beats around a point; the guiding star shines with them while it waits. */
export function drawSparkles(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, time: number, alpha: number): void {
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2 + 0.6;
    const distance = radius * (5.5 + (i % 3) * 2.2);
    const beat = 0.5 + 0.5 * Math.sin(time / (170 + i * 53) + i * 1.7);
    drawSparkle(ctx, x + Math.cos(angle) * distance, y + Math.sin(angle) * distance * 0.8, 2.5 + beat * 4.5, alpha * beat * 0.9);
  }
}

/**
 * The falling star with its trail, the landing ring and the newborn's halo. `pulse` is a slow beat around 1; `time` is the
 * clock in milliseconds, for the twinkle.
 */
export function drawGuidingStar(ctx: CanvasRenderingContext2D, frame: SceneFrame, curve: readonly [Point, Point, Point, Point], landing: Point, pulse: number, time = 0): void {
  const { star } = frame;
  const radius = star.radius * pulse;
  if (star.alpha > 0.01) {
    for (let k = 22; k >= 1; k--) {
      const point = bezier(curve, Math.max(0, star.fall - k * 0.011));
      const fade = 1 - k / 23;
      ctx.fillStyle = `rgba(255,224,160,${(0.38 * fade * star.alpha).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius * 0.7 * fade, 0, Math.PI * 2);
      ctx.fill();
    }
    drawStar(ctx, star.point.x, star.point.y, radius, star.alpha);
    drawSparkles(ctx, star.point.x, star.point.y, radius, time, star.alpha);
  }
  if (star.ring > 0) {
    ctx.strokeStyle = `rgba(255,226,170,${(0.55 * (1 - star.ring)).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(landing.x, landing.y, star.ring * 130, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (star.halo > 0.01) {
    const halo = ctx.createRadialGradient(landing.x, landing.y, 0, landing.x, landing.y, 150);
    halo.addColorStop(0, `rgba(255,230,170,${0.55 * star.halo})`);
    halo.addColorStop(1, "rgba(255,230,170,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(landing.x, landing.y, 150, 0, Math.PI * 2);
    ctx.fill();
  }
}
