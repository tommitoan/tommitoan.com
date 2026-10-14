import { dayState, rgbString, type DayState } from "./color";

export interface DayCycle {
  /** Apply one position of the cycle: 0 is night, 1 is paper. Returns the computed state. */
  render(progress: number): DayState;
  destroy(): void;
}

export interface DayCycleOptions {
  /** Paint the page background too. Defaults to true. */
  paintBody?: boolean;
  root?: HTMLElement;
}

/**
 * Applies the day cycle to the page: the sky colour, the text colours that stay readable on it
 * (CSS variables --kit-sky, --kit-fg, --kit-fg-muted), and optionally the body background.
 */
export function createDayCycle(options: DayCycleOptions = {}): DayCycle {
  const root = options.root ?? document.documentElement;
  const paintBody = options.paintBody ?? true;
  const bodyBefore = document.body.style.background;
  return {
    render(progress) {
      const state = dayState(progress);
      root.style.setProperty("--kit-sky", rgbString(state.sky));
      root.style.setProperty("--kit-fg", rgbString(state.fg));
      root.style.setProperty("--kit-fg-muted", rgbString(state.muted));
      if (paintBody) document.body.style.background = rgbString(state.sky);
      return state;
    },
    destroy() {
      root.style.removeProperty("--kit-sky");
      root.style.removeProperty("--kit-fg");
      root.style.removeProperty("--kit-fg-muted");
      if (paintBody) document.body.style.background = bodyBefore;
    },
  };
}
