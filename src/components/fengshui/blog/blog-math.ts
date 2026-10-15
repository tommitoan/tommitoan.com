import { clamp } from "@kit/color";

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

/**
 * Where the floating preview goes for a pointer position: down and to the right of the pointer, flipped to the other
 * side when it would leave the window, and always kept at least `margin` inside it.
 */
export function previewPosition(pointer: Point, preview: Size, viewport: Size, offset = 20, margin = 12): Point {
  let x = pointer.x + offset;
  let y = pointer.y + offset;
  if (x + preview.width + margin > viewport.width) x = pointer.x - offset - preview.width;
  if (y + preview.height + margin > viewport.height) y = pointer.y - offset - preview.height;
  return {
    x: clamp(x, margin, Math.max(margin, viewport.width - preview.width - margin)),
    y: clamp(y, margin, Math.max(margin, viewport.height - preview.height - margin)),
  };
}

/**
 * How far a block of text has been "read": 0 while its top is below 60% of the window height, 1 once its bottom is above
 * 20%. `top` is the block's distance from the window's top edge.
 */
export function fillProgress(top: number, height: number, viewportHeight: number): number {
  const start = viewportHeight * 0.6;
  const span = height + viewportHeight * 0.4;
  return span <= 0 ? 1 : clamp((start - top) / span, 0, 1);
}

/** How many of `total` words are filled for a progress value. */
export const wordsFilled = (total: number, progress: number): number => Math.round(total * clamp(progress, 0, 1));

/** The words of a text, in order; the spaces between them are put back when it is drawn. */
export const splitWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);
