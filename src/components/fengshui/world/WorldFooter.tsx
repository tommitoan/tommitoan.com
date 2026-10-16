"use client";

import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { scrollToTop } from "./kit-handle";
import { WorldClock } from "./WorldClock";

export function WorldFooter() {
  const copy = useFengShuiWorldCopy().footer;
  const replay = () => scrollToTop(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  return (
    <>
      <div className="fs-replay-row">
        <div className="fs-wrap">
          <button type="button" className="fs-replay" onClick={replay}>
            <span className="fs-replay-arrow" aria-hidden="true">
              ↑
            </span>
            {copy.replay}
          </button>
        </div>
      </div>
      <footer className="fs-footer">
        <div className="fs-wrap fs-footer-inner">
          <p>{copy.note}</p>
          <WorldClock />
        </div>
      </footer>
    </>
  );
}
