import type { Tier } from "./env";

export interface Wash {
  destroy(): void;
}

/** Ink-wash stains behind the page that drift at different speeds while scrolling. Full tier only. */
export function mountWash(tier: Tier): Wash {
  if (tier !== "full") return { destroy: () => undefined };
  const layer = document.createElement("div");
  layer.className = "kit-wash-layer";
  layer.setAttribute("aria-hidden", "true");
  const blobs = [0, 1, 2].map(() => {
    const blob = document.createElement("div");
    blob.className = "kit-wash";
    layer.appendChild(blob);
    return blob;
  });
  document.body.prepend(layer);

  const travel = [-260, 200, -180];
  let frame = 0;
  const update = () => {
    frame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    blobs.forEach((blob, index) => {
      blob.style.transform = `translate3d(0, ${(progress * travel[index]).toFixed(1)}px, 0)`;
    });
  };
  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return {
    destroy() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      layer.remove();
    },
  };
}
