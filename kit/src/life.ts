import type { Tier } from "./env";

/**
 * Life strip (a light form of effect 25): a star falls, then a figure grows through the frames of a life while an age
 * counter runs. The frames are plain images; the page decides which ones and what they show.
 */

export const LIFE_FRAME_MS = 2200;
export const LIFE_REST_MS = 1800;

export interface LifeFrame {
  age: string;
  src: string;
}

/** Reads "12=/a.webp;22=/b.webp" into frames. Entries without both an age and a path are ignored. */
export function parseLifeFrames(value: string | null): LifeFrame[] {
  const frames: LifeFrame[] = [];
  for (const entry of (value ?? "").split(";")) {
    const cut = entry.indexOf("=");
    if (cut < 0) continue;
    const age = entry.slice(0, cut).trim();
    const src = entry.slice(cut + 1).trim();
    if (age && src) frames.push({ age, src });
  }
  return frames;
}

/** The frame after `index`, wrapping to the first; also says whether the loop restarted (the star falls again). */
export function nextFrame(index: number, count: number): { index: number; restarted: boolean } {
  if (count <= 0) return { index: 0, restarted: false };
  const next = index + 1;
  return next >= count ? { index: 0, restarted: true } : { index: next, restarted: false };
}

/** The frames play on the full tier only; the first frame stays visible on every other tier. */
export function shouldMountLife(tier: Tier): boolean {
  return tier === "full";
}

export interface Life {
  destroy(): void;
}

/**
 * Containers with data-kit-life hold one image with data-age (the first frame, so the page shows a figure without
 * script), a data-kit-life-frames list of the other frames (fetched only when the loop starts), an optional
 * [data-kit-life-star] and an optional [data-kit-life-age] counter.
 */
export function mountLife(tier: Tier, after: Promise<void> = Promise.resolve(), root: ParentNode = document): Life {
  if (!shouldMountLife(tier)) return { destroy: () => undefined };
  const cleanups: Array<() => void> = [];
  for (const host of Array.from(root.querySelectorAll<HTMLElement>("[data-kit-life]"))) {
    const first = host.querySelector<HTMLImageElement>("img[data-age]");
    const extra = parseLifeFrames(host.getAttribute("data-kit-life-frames"));
    if (!first || extra.length === 0) continue;
    const star = host.querySelector<HTMLElement>("[data-kit-life-star]");
    const counter = host.querySelector<HTMLElement>("[data-kit-life-age]");
    const frames: HTMLImageElement[] = [first];
    const created: HTMLImageElement[] = [];
    let current = 0;
    let timer = 0;
    let visible = false;
    let started = false;
    let disposed = false;

    const show = (index: number) => {
      frames.forEach((frame, i) => frame.classList.toggle("is-active", i === index));
      if (counter) counter.textContent = frames[index]?.getAttribute("data-age") ?? "";
    };
    const fall = () => {
      star?.animate(
        [
          { transform: "translate(70px, -150px) scale(0.6)", opacity: 0 },
          { opacity: 1, offset: 0.25 },
          { transform: "translate(0, 0) scale(1)", opacity: 0 },
        ],
        { duration: 1100, easing: "cubic-bezier(0.55, 0, 0.8, 0.4)" },
      );
    };
    const tick = () => {
      timer = 0;
      if (!visible || disposed) return;
      const step = nextFrame(current, frames.length);
      current = step.index;
      show(current);
      if (step.restarted) fall();
      const last = current === frames.length - 1;
      timer = window.setTimeout(tick, last ? LIFE_REST_MS + LIFE_FRAME_MS : LIFE_FRAME_MS);
    };
    const begin = () => {
      if (started || disposed) return;
      started = true;
      host.classList.add("kit-life-playing");
      for (const { age, src } of extra) {
        const image = document.createElement("img");
        image.alt = "";
        image.decoding = "async";
        image.width = first.width || 400;
        image.height = first.height || 600;
        image.setAttribute("data-age", age);
        image.src = src;
        host.insertBefore(image, star);
        frames.push(image);
        created.push(image);
      }
      fall();
      show(0);
      timer = window.setTimeout(tick, LIFE_FRAME_MS);
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (!visible) {
        if (timer) window.clearTimeout(timer);
        timer = 0;
        return;
      }
      if (!started) void after.then(begin);
      else if (!timer) timer = window.setTimeout(tick, LIFE_FRAME_MS);
    });
    observer.observe(host);

    cleanups.push(() => {
      disposed = true;
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
      host.classList.remove("kit-life-playing");
      created.forEach((image) => image.remove());
      first.classList.remove("is-active");
      if (counter) counter.textContent = first.getAttribute("data-age") ?? "";
    });
  }
  return { destroy: () => cleanups.forEach((cleanup) => cleanup()) };
}
