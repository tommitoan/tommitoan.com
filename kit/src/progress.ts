import type { Tier } from "./env";
import type { SmoothScroll } from "./scroll";

export interface Mounted {
  destroy(): void;
}

/** Thin bar at the top of the page that fills while you scroll. */
export function mountProgress(): Mounted {
  const bar = document.createElement("div");
  bar.className = "kit-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  let frame = 0;
  const update = () => {
    frame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
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
      bar.remove();
    },
  };
}

export interface DotsOptions {
  tier: Tier;
  smooth?: SmoothScroll;
  root?: ParentNode;
}

/** Dots at the right edge, one per [data-kit-section]; the label comes from the attribute value. */
export function mountDots(options: DotsOptions): Mounted {
  const root = options.root ?? document;
  const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-kit-section]"));
  if (sections.length < 2) return { destroy: () => undefined };

  const nav = document.createElement("nav");
  nav.className = "kit-dots";
  nav.setAttribute("aria-label", "Sections");
  const buttons = sections.map((section, index) => {
    const name = section.getAttribute("data-kit-section") || `Section ${index + 1}`;
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", name);
    const label = document.createElement("span");
    label.textContent = name;
    button.appendChild(label);
    button.addEventListener("click", () => {
      if (options.smooth) options.smooth.scrollTo(section, -64);
      else section.scrollIntoView({ behavior: options.tier === "off" ? "auto" : "smooth", block: "start" });
    });
    nav.appendChild(button);
    return button;
  });
  document.body.appendChild(nav);

  const setCurrent = (index: number) => buttons.forEach((button, i) => (i === index ? button.setAttribute("aria-current", "true") : button.removeAttribute("aria-current")));
  let frame = 0;
  const update = () => {
    frame = 0;
    let current = 0;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.45) current = index;
    });
    setCurrent(current);
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
      nav.remove();
    },
  };
}
