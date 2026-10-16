"use client";

import type { ReactNode } from "react";
import { useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";

type Props = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: string;
};

/**
 * A heading the kit splits into words and animates. The kit rewrites the heading's children, which React
 * must not touch afterwards, so the element is keyed by language: a language change replaces the whole element.
 * `children` has to be one plain string for the same reason.
 */
export function RevealHeading({ as: Tag = "h2", className, children }: Props): ReactNode {
  const language = useFengShuiLanguage();
  return (
    <Tag key={language} data-kit-reveal className={className}>
      {children}
    </Tag>
  );
}
