"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { easeToward } from "@/components/fengshui/world/scene-math";
import { previewPosition, type Point } from "./blog-math";
import { useFinePointer } from "./use-fine-pointer";

type Props = { className?: string; children: ReactNode };

/**
 * Wraps a list whose items carry `data-preview`, `data-preview-text` and `data-preview-lang`. With a mouse and the full
 * motion tier, a floating summary follows the pointer over an item; everywhere else the items show their summary themselves.
 * The position is written straight to the element, one frame at a time, so the page is not re-rendered while the pointer moves.
 */
export function PreviewZone({ className, children }: Props) {
  const enabled = useFinePointer();
  const zoneRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState({ active: false, text: "", lang: "vi" });

  useEffect(() => {
    const zone = zoneRef.current;
    const aside = asideRef.current;
    if (!enabled || !zone || !aside) return;
    let target: Point = { x: 0, y: 0 };
    let drawn: Point = { x: 0, y: 0 };
    let current: HTMLElement | null = null;
    let live = false;
    let frame = 0;

    const place = (point: Point): Point =>
      previewPosition(point, { width: aside.offsetWidth, height: aside.offsetHeight }, { width: window.innerWidth, height: window.innerHeight });
    const paint = () => {
      aside.style.transform = `translate3d(${drawn.x}px, ${drawn.y}px, 0)`;
    };
    const tick = () => {
      frame = 0;
      const goal = place(target);
      drawn = { x: easeToward(drawn.x, goal.x, 0.22, 0.4), y: easeToward(drawn.y, goal.y, 0.22, 0.4) };
      paint();
      if (live && (drawn.x !== goal.x || drawn.y !== goal.y)) frame = window.requestAnimationFrame(tick);
    };
    const run = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const hide = () => {
      live = false;
      current = null;
      setShown((previous) => (previous.active ? { ...previous, active: false } : previous));
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const item = (event.target as Element).closest<HTMLElement>("[data-preview]");
      if (!item) {
        hide();
        return;
      }
      target = { x: event.clientX, y: event.clientY };
      if (item !== current) {
        current = item;
        setShown({ active: true, text: item.dataset.previewText ?? "", lang: item.dataset.previewLang ?? "vi" });
      }
      if (!live) {
        // Start where the pointer is, so the card does not fly in from wherever it was last.
        live = true;
        drawn = place(target);
        paint();
      }
      run();
    };

    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerleave", hide);
    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", hide);
      live = false;
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return (
    <div ref={zoneRef} className={`${className ?? ""}${enabled ? " has-preview" : ""}`.trim()}>
      {children}
      <aside ref={asideRef} className="fs-preview" aria-hidden="true" data-active={shown.active ? "true" : "false"}>
        <p lang={shown.lang}>{shown.text}</p>
      </aside>
    </div>
  );
}
