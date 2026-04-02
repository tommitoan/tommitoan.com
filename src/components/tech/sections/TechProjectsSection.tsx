"use client";

import { useState } from "react";
import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { ImageLightbox } from "@/components/tech/ImageLightbox";
import { portfolio } from "@/content/portfolio";

export function TechProjectsSection() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section id="projects" className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Personal work"
          title={<span className="cv-gradient-text-cyan-blue">Projects.</span>}
          description={
            <>
              Open-source work and personal infrastructure — built for{" "}
              <span className="cv-gradient-text-primary">real use</span>, not portfolios.
            </>
          }
        />
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {portfolio.projects.map((project, index) => {
          const gradientClass =
            index === 0 ? "cv-gradient-text-cyan-blue" : "cv-gradient-text-purple-pink";
          const isBazica = index === 0;
          const previewSrc = project.diagram ?? project.image ?? "";
          const previewAlt = project.diagram
            ? `${project.name} architecture diagram`
            : `${project.name} screenshot`;

          return (
            <Reveal
              key={project.name}
              className="cv-panel group flex h-full flex-col rounded-[1.75rem] overflow-hidden transition hover:!border-violet-500/40"
              delay={0.1 * (index + 1)}
            >
              {previewSrc && (
                <div
                  className="relative w-full cursor-zoom-in overflow-hidden"
                  style={{ aspectRatio: "16 / 9" }}
                  onClick={() => setLightbox({ src: previewSrc, alt: previewAlt })}
                  title="Click to expand"
                >
                  <img
                    src={previewSrc}
                    alt={previewAlt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    style={{ objectPosition: project.imagePosition ?? "50% 20%" }}
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b1027]/70 pointer-events-none" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
                    <span className="flex items-center gap-2 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                      <span className="text-base">⤢</span> Expand
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                    {isBazica && project.stats ? (
                      <div className="flex items-center gap-2">
                        {project.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 backdrop-blur-sm"
                          >
                            <span className="text-sm font-bold text-white">{stat.value}</span>
                            <span className="text-xs text-slate-400">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm">
                        Architecture Diagram
                      </span>
                    )}
                    <span className="rounded-full border border-white/10 bg-black/55 px-3 py-1 text-xs text-slate-500 backdrop-blur-sm">
                      {isBazica ? "Open Source · Go" : "Not publicly hosted"}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className={`text-2xl font-bold leading-tight ${gradientClass}`}>
                  {project.name}
                </h3>

                <p className="mt-3 text-base leading-7 text-slate-300">{project.summary}</p>

                <p className="mt-3 text-base leading-7 text-slate-200">
                  <span className={`font-semibold ${gradientClass}`}>Impact: </span>
                  {project.impact}
                </p>

                <div className="mt-auto pt-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="cv-pill-tech">
                      {item}
                    </span>
                  ))}
                </div>

                {isBazica && project.href && (
                  <div className="mt-5 flex gap-3">
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-black/70 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5"
                    >
                      GitHub →
                    </a>
                    <a
                      href="https://bazica.onrender.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-400/8 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:-translate-y-0.5 hover:border-cyan-400/45"
                    >
                      Live Demo →
                    </a>
                  </div>
                )}

                {!isBazica && (
                  <div className="mt-5">
                    <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-500">
                      Private homelab — diagram only
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <ImageLightbox
        src={lightbox?.src ?? ""}
        alt={lightbox?.alt ?? ""}
        isOpen={lightbox !== null}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}
