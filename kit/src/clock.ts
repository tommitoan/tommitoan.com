import { shichen } from "./shichen";

export type Locale = "vi" | "en";

export interface Clock {
  destroy(): void;
}

const label = (locale: Locale, name: string, minutesLeft: number): string =>
  locale === "en" ? `Hour of the ${name} · ${minutesLeft} min left` : `Giờ ${name} · còn ${minutesLeft} phút`;

/** Fills every [data-kit-clock] element with the current double-hour (canh giờ) and the minutes left in it. */
export function mountClock(locale: Locale, root: ParentNode = document): Clock {
  const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-kit-clock]"));
  const parts = targets.map((target) => {
    target.classList.add("kit-clock");
    const han = document.createElement("b");
    han.className = "kit-clock-han";
    han.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    target.textContent = "";
    target.append(han, text);
    return { han, text };
  });
  const update = () => {
    const now = new Date();
    const current = shichen(now.getHours(), now.getMinutes());
    for (const part of parts) {
      part.han.textContent = current.han;
      part.text.textContent = label(locale, current.name, current.minutesLeft);
    }
  };
  update();
  const timer = parts.length > 0 ? window.setInterval(update, 30000) : 0;
  return {
    destroy() {
      if (timer) window.clearInterval(timer);
    },
  };
}
