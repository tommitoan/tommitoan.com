import type { Tier } from "./env";

/** Ink dust (effect 2): a glyph made of small specks that scatter away from the pointer and drift back. */

export const DUST_SIZE = 340;
export const DUST_STEP = 5;
const PUSH_RADIUS = 90;

export interface Particle {
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Grid points whose pixel is dark enough, from the alpha channel of an RGBA image of `size` x `size`. */
export function sampleTargets(rgba: ArrayLike<number>, size: number, step: number, threshold = 140): Array<[number, number]> {
  const targets: Array<[number, number]> = [];
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      if ((rgba[(y * size + x) * 4 + 3] ?? 0) > threshold) targets.push([x, y]);
    }
  }
  return targets;
}

/** One physics step of a particle: a pull to its target, a push away from the pointer, and friction. Mutates `p`. */
export function stepParticle(p: Particle, pointer: { x: number; y: number } | null): void {
  p.vx += (p.tx - p.x) * 0.022;
  p.vy += (p.ty - p.y) * 0.022;
  if (pointer) {
    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < PUSH_RADIUS && distance > 0.1) {
      const push = (PUSH_RADIUS - distance) / PUSH_RADIUS;
      p.vx += (dx / distance) * push * 5;
      p.vy += (dy / distance) * push * 5;
    }
  }
  p.vx *= 0.86;
  p.vy *= 0.86;
  p.x += p.vx;
  p.y += p.vy;
}

/** The dust runs on the full tier only; other tiers keep the plain glyph that is already on the page. */
export function shouldMountDust(tier: Tier): boolean {
  return tier === "full";
}

export interface Dust {
  destroy(): void;
}

/**
 * Elements with data-kit-dust="命" hold the plain glyph (so the page reads without script). On the full tier a canvas is
 * added over it and the glyph fades out. The canvas only draws while it is on screen.
 */
export function mountDust(tier: Tier, root: ParentNode = document): Dust {
  if (!shouldMountDust(tier)) return { destroy: () => undefined };
  const cleanups: Array<() => void> = [];
  for (const host of Array.from(root.querySelectorAll<HTMLElement>("[data-kit-dust]"))) {
    const glyph = host.getAttribute("data-kit-dust") ?? "";
    if (!glyph) continue;
    const canvas = document.createElement("canvas");
    canvas.width = DUST_SIZE;
    canvas.height = DUST_SIZE;
    canvas.className = "kit-dust-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    host.appendChild(canvas);

    let particles: Particle[] = [];
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let visible = false;
    let disposed = false;
    const color = host.getAttribute("data-kit-dust-color") || "rgba(139, 46, 31, 0.8)";
    const font = getComputedStyle(host).getPropertyValue("--kit-han").trim() || "serif";

    const sample = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = DUST_SIZE;
      offscreen.height = DUST_SIZE;
      const paint = offscreen.getContext("2d");
      if (!paint) return;
      paint.fillStyle = "#000";
      paint.font = `290px ${font}`;
      paint.textAlign = "center";
      paint.textBaseline = "middle";
      paint.fillText(glyph, DUST_SIZE / 2, DUST_SIZE / 2 + 10);
      const targets = sampleTargets(paint.getImageData(0, 0, DUST_SIZE, DUST_SIZE).data, DUST_SIZE, DUST_STEP);
      particles = targets.map(([tx, ty]) => ({ tx, ty, x: Math.random() * DUST_SIZE, y: Math.random() * DUST_SIZE, vx: 0, vy: 0 }));
    };

    const draw = () => {
      if (!visible || disposed) {
        frame = 0;
        return;
      }
      const box = canvas.getBoundingClientRect();
      const scale = box.width > 0 ? DUST_SIZE / box.width : 1;
      const local = pointer ? { x: (pointer.x - box.left) * scale, y: (pointer.y - box.top) * scale } : null;
      ctx.clearRect(0, 0, DUST_SIZE, DUST_SIZE);
      ctx.fillStyle = color;
      for (const p of particles) {
        stepParticle(p, local);
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
      if (particles.length === 0) return;
      host.classList.add("kit-dust-on");
      if (visible && !frame) frame = window.requestAnimationFrame(draw);
    };
    if (document.fonts?.load) void document.fonts.load(`290px ${font}`, glyph).then(start, start);
    else start();

    cleanups.push(() => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
      host.classList.remove("kit-dust-on");
      canvas.remove();
    });
  }
  return { destroy: () => cleanups.forEach((cleanup) => cleanup()) };
}
