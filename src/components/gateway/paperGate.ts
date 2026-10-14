/** Pure rules for the paper gate: the Feng Shui portal frame grows into a full sheet of paper, then the world opens. */

/** Same colour as the paper cover that the Feng Shui world paints while it loads, so the two read as one sheet. */
export const PAPER_COLOUR = "#f3ead7";

/** Portal whose frame opens as a paper gate. Other portals keep the warp and flash. */
export const PAPER_GATE_PORTAL = "fengshui";

export const PAPER_GATE_DURATION_MS = 800;
/** Navigate anyway if the animation never reports it finished. */
export const PAPER_GATE_FALLBACK_MS = 1600;

export interface GateBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface GateViewport {
  width: number;
  height: number;
}

/** The paper gate needs motion: with reduced motion the portal navigates at once, like the others. */
export function usesPaperGate(portalId: string, reducedMotion: boolean): boolean {
  return portalId === PAPER_GATE_PORTAL && !reducedMotion;
}

/** Destination of the gate. A full page load needs the trailing slash of the static export. */
export function gateDestination(href: string): string {
  return href.endsWith("/") ? href : `${href}/`;
}

const px = (value: number): string => `${Math.max(0, Math.round(value))}px`;

/** `clip-path` that shows only the frame's rectangle, so the paper starts exactly where the frame is. */
export function gateStartClip(box: GateBox, viewport: GateViewport, radiusPx: number): string {
  const top = px(box.top);
  const right = px(viewport.width - box.right);
  const bottom = px(viewport.height - box.bottom);
  const left = px(box.left);
  return `inset(${top} ${right} ${bottom} ${left} round ${px(radiusPx)})`;
}

/** `clip-path` that shows the whole viewport. */
export const GATE_FULL_CLIP = "inset(0px 0px 0px 0px round 0px)";
