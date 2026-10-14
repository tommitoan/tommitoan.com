"use client";

import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { WorldClock } from "./WorldClock";

export function WorldFooter() {
  const copy = useFengShuiWorldCopy().footer;
  return (
    <footer className="fs-footer">
      <div className="fs-wrap fs-footer-inner">
        <p>{copy.note}</p>
        <WorldClock />
      </div>
    </footer>
  );
}
