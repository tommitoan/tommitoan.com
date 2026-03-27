"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { portfolio } from "@/content/portfolio";

export function TechAboutSection() {
  return (
    <section id="about" className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Introduction"
          title={<span className="cv-gradient-text-primary">Overview.</span>}
          description={
            <>
              I build backend systems that are fast, observable, and maintainable.
              My current work spans <span className="cv-gradient-text-cyan-blue">Golang services</span>, microservice architecture,
              cloud infrastructure, CI/CD, and the <span className="cv-gradient-text-purple-pink">product thinking</span> needed
              to turn technical systems into usable software.
            </>
          }
        />
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal className="flex flex-col items-center">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-violet-500/20 bg-gradient-to-br from-violet-500/30 via-[#171c3b] to-[#0b1027]" style={{ boxShadow: "0 0 40px rgba(145,94,255,0.15)" }}>
            <div className="absolute inset-[6px] overflow-hidden rounded-full">
              <img
                src="/avatar.png"
                alt="Toan Ngo"
                className="h-full w-full object-cover object-[center_15%]"
                draggable="false"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {portfolio.about.actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                className={action.variant === "primary" ? "cv-gradient-button" : "cv-ghost-button"}
              >
                {action.label}
              </a>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5">
          <Reveal className="cv-panel rounded-[1.75rem] p-6 md:p-8">
            <div className="space-y-5">
              {portfolio.about.points.map((point, index) => (
                <div key={point} className="flex gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10 text-sm font-semibold text-violet-400">
                    {index + 1}
                  </span>
                  <p className="text-lg leading-8 text-slate-300">{point}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {portfolio.about.principles.map((principle, index) => {
            const gradientClass = index === 0
              ? "cv-gradient-text-primary"
              : index === 1
                ? "cv-gradient-text-cyan-blue"
                : "cv-gradient-text-purple-pink";

            return (
              <Reveal
                key={principle.title}
                className="cv-panel rounded-[1.5rem] p-6"
                delay={0.08 * (index + 1)}
              >
                <p className="cv-soft-caption">Core strength</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  <span className={gradientClass}>{principle.title}</span>
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-300">{principle.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
