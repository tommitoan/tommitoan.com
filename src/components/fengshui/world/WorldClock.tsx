"use client";

import { useEffect, useState } from "react";
import { shichen } from "@kit/shichen";
import { useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";

/** The current double-hour (canh giờ) and the minutes left in it. Renders nothing until the browser knows the time. */
export function WorldClock({ className }: { className?: string }) {
  const language = useFengShuiLanguage();
  const [now, setNow] = useState<{ han: string; name: string; left: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const date = new Date();
      const current = shichen(date.getHours(), date.getMinutes());
      setNow({ han: current.han, name: current.name, left: current.minutesLeft });
    };
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 30000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  if (!now) return null;
  const text = language === "en" ? `Hour of the ${now.name} · ${now.left} min left` : `Giờ ${now.name} · còn ${now.left} phút`;
  return (
    <span className={`fs-clock ${className ?? ""}`}>
      <b className="fs-han" aria-hidden="true">
        {now.han}
      </b>
      <span>{text}</span>
    </span>
  );
}
