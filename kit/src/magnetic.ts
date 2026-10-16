import type { Tier } from "./env";

export interface Magnetic {
  destroy(): void;
}

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/** Elements with data-kit-magnetic lean toward the pointer and spring back. Needs a fine pointer and the full tier. */
export function mountMagnetic(tier: Tier, finePointer: boolean, root: ParentNode = document): Magnetic {
  if (tier !== "full" || !finePointer) return { destroy: () => undefined };
  const cleanups: Array<() => void> = [];
  for (const element of Array.from(root.querySelectorAll<HTMLElement>("[data-kit-magnetic]"))) {
    const onMove = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left - box.width / 2) * 0.35;
      const y = (event.clientY - box.top - box.height / 2) * 0.35;
      element.getAnimations().forEach((animation) => animation.cancel());
      element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const onLeave = () => {
      const from = element.style.transform || "translate(0, 0)";
      element.style.transform = "";
      element.animate([{ transform: from }, { transform: "translate(0, 0)" }], { duration: 700, easing: SPRING });
    };
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      element.style.transform = "";
    });
  }
  return { destroy: () => cleanups.forEach((cleanup) => cleanup()) };
}
