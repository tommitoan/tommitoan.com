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

/** A soft glowing dot: the same look as the stars of the night sky (a core with a halo), here in gold. */
function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, core: number, haloRadius: number, haloAlpha: number, alpha: number): void {
  const halo = ctx.createRadialGradient(x, y, 0, x, y, haloRadius);
  halo.addColorStop(0, `rgba(255,222,140,${(haloAlpha * alpha).toFixed(3)})`);
  halo.addColorStop(0.35, `rgba(255,200,100,${(haloAlpha * 0.4 * alpha).toFixed(3)})`);
  halo.addColorStop(1, "rgba(255,190,90,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,244,208,${alpha.toFixed(3)})`;
  ctx.beginPath();
  ctx.arc(x, y, core, 0, Math.PI * 2);
  ctx.fill();
}

/** The guiding star: a bright gold core inside a wide halo, like the white stars of the sky but warmer and larger. */
function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number): void {
  drawGlow(ctx, x, y, radius * 0.95, radius * 11, 0.5, alpha);
  drawGlow(ctx, x, y, radius * 0.6, radius * 4.5, 0.85, alpha);
}

/** Five small gold glows that twinkle on their own beats around a point; the guiding star shines with them while it waits. */
export function drawSparkles(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, time: number, alpha: number): void {
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2 + 0.5;
    const distance = radius * (6.5 + (i % 3) * 2.6);
    const beat = 0.5 + 0.5 * Math.sin(time / (190 + i * 61) + i * 1.9);
    drawGlow(ctx, x + Math.cos(angle) * distance, y + Math.sin(angle) * distance * 0.85, 0.9 + beat * 0.9, 6 + beat * 4, 0.5, alpha * (0.35 + 0.65 * beat));
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
