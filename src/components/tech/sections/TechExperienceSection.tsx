"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { portfolio } from "@/content/portfolio";

export function TechExperienceSection() {
  return (
    <section id="experience" className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Professional path"
          title={<span className="cv-gradient-text-purple-pink">Journey.</span>}
          description={
            <>
              From internship to architecting{" "}
              <span className="cv-gradient-text-cyan-blue">B2B gaming platforms</span> — four years
              of Go, cloud infrastructure, and building systems that teams depend on.
            </>
          }
        />
      </Reveal>

      <div className="mt-12 space-y-8">
        {portfolio.experience.map((job, jobIndex) => {
          const isMercury = job.company === "Mercury Studio";

          return (
            <Reveal key={job.company} delay={0.08 * (jobIndex + 1)}>
              <div
                className={`cv-panel rounded-[2rem] overflow-hidden ${
                  isMercury ? "!border-violet-500/35" : ""
                }`}
              >
                <div
                  className={`flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8 md:py-6 ${
                    isMercury
                      ? "border-b border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent"
                      : "border-b border-white/8 bg-white/[0.025]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white ${
                        isMercury
                          ? "bg-gradient-to-br from-violet-500 to-blue-500"
                          : "bg-gradient-to-br from-slate-600 to-slate-700"
                      }`}
                      style={
                        isMercury
                          ? { boxShadow: "0 4px 16px rgba(145,94,255,0.4)" }
                          : {}
                      }
                    >
                      {job.company[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-bold text-white md:text-xl">
                          {job.company}
                        </h3>
                        {isMercury && (
                          <span className="inline-flex items-center rounded-full border border-violet-500/35 bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-400">{job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-1">
                    <span className="text-sm font-medium text-slate-300">{job.period}</span>
                    <span className="text-xs text-slate-500">{job.role.split("—")[0].trim()}</span>
                  </div>
                </div>

                {isMercury && job.bullets && (
                  <div className="px-6 py-6 md:px-8 md:py-7">
                    <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400/80">
                      {job.role.includes("—") ? job.role.split("—")[1].trim() : job.role}
                    </p>
                    <ul className="space-y-4">
                      {job.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                          <span className="text-base leading-7 text-slate-300">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isMercury && job.subProjects && (
                  <div className="divide-y divide-white/[0.06]">
                    {job.subProjects.map((sub, subIndex) => (
                      <Reveal
                        key={sub.name}
                        delay={0.06 * (subIndex + 1)}
                        className={sub.isInternship ? "opacity-80" : ""}
                      >
                        <div
                          className={`px-6 py-5 md:px-8 md:py-6 ${
                            sub.isInternship ? "bg-white/[0.012]" : ""
                          }`}
                        >
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-2 w-2 shrink-0 rounded-full ${
                                  sub.isInternship
                                    ? "bg-slate-500"
                                    : subIndex === 0
                                    ? "bg-cyan-400"
                                    : subIndex === 1
                                    ? "bg-pink-400"
                                    : "bg-violet-500"
                                }`}
                              />
                              <h4
                                className={`font-semibold ${
                                  sub.isInternship
                                    ? "text-base text-slate-400"
                                    : "text-lg text-white"
                                }`}
                              >
                                {sub.name}
                              </h4>
                            </div>
                            <span
                              className={`shrink-0 text-xs font-medium ${
                                sub.isInternship ? "text-slate-600" : "text-slate-500"
                              }`}
                            >
                              {sub.period}
                            </span>
                          </div>

                          <ul
                            className={`mt-4 space-y-3 ${
                              sub.isInternship ? "mt-3 space-y-2" : ""
                            }`}
                          >
                            {sub.bullets.map((bullet, bi) => (
                              <li key={bi} className="flex gap-4">
                                <span
                                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                                    sub.isInternship
                                      ? "bg-slate-600"
                                      : subIndex === 0
                                      ? "bg-cyan-400/70"
                                      : subIndex === 1
                                      ? "bg-pink-400/70"
                                      : "bg-violet-500/70"
                                  }`}
                                />
                                <span
                                  className={`leading-7 ${
                                    sub.isInternship
                                      ? "text-sm text-slate-500"
                                      : "text-base text-slate-300"
                                  }`}
                                >
                                  {bullet}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
