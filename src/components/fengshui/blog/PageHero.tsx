"use client";

import { RevealHeading } from "@/components/fengshui/world/RevealHeading";

type Props = { eyebrow: string; title: string; description: string };

/** The short night band at the top of the blog and About pages. */
export function PageHero({ eyebrow, title, description }: Props) {
  return (
    <section className="fs-hero fs-hero-compact">
      <div className="fs-wrap fs-narrow">
        <span className="fs-eyebrow">{eyebrow}</span>
        <RevealHeading as="h1" className="fs-hero-title">
          {title}
        </RevealHeading>
        <p className="fs-hero-copy">{description}</p>
      </div>
    </section>
  );
}
