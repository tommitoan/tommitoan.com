"use client";

import Image from "next/image";
import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { siteContent } from "@/content/site-content";

export function DiscoverHomelabSection() {
  const { homelab } = siteContent.discover;

  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Infrastructure"
          title={
            <span className="cv-gradient-text-primary">{homelab.heading}</span>
          }
          description={homelab.body}
        />
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Reveal className="flex flex-col gap-6">
          <div className="cv-panel rounded-[1.75rem] p-6 md:p-8">
            <p className="cv-soft-caption">GitOps flow</p>
            <ol className="mt-4 space-y-3">
              {homelab.flow.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-xs font-semibold text-cyan-400">
                    {index + 1}
                  </span>
                  <span className="text-base leading-7 text-slate-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="cv-panel rounded-[1.75rem] p-6 md:p-8">
            <p className="cv-soft-caption">Stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {homelab.stack.map((item) => (
                <span key={item} className="cv-pill-tech">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="cv-panel-strong relative overflow-hidden rounded-[2rem] p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
              <Image
                src={homelab.image}
                alt={homelab.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 px-4 pb-3 text-center text-sm text-slate-500">
              {homelab.imageAlt}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
