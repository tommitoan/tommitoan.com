"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { portfolio } from "@/content/portfolio";

export function TechEducationSection() {
  return (
    <section id="education" className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Education & Certifications"
          title={<span className="cv-gradient-text-cyan-blue">Credentials.</span>}
          description={
            <>
              Formal foundations backed by{" "}
              <span className="cv-gradient-text-primary">cloud certification</span> and a
              computer science degree.
            </>
          }
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {portfolio.education.map((item, index) => {
          const isCert = item.type === "cert";

          return (
            <Reveal key={item.title} delay={0.1 * (index + 1)}>
              <div
                className={`cv-panel-strong group flex h-full flex-col rounded-[1.75rem] p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 ${
                  isCert ? "hover:!border-amber-400/50" : "hover:!border-violet-500/50"
                }`}
              >
                <div className="flex items-start gap-5">
                  {isCert ? (
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #f59e0b, #d97706, #b45309)",
                        boxShadow: "0 8px 24px rgba(245,158,11,0.35)"
                      }}
                    >
                      ☁
                    </div>
                  ) : (
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #4f7cff)",
                        boxShadow: "0 8px 24px rgba(124,58,237,0.35)"
                      }}
                    >
                      🎓
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="cv-soft-caption">
                      {isCert ? "Certification" : "University Degree"}
                    </p>
                    <h3 className="mt-2 text-xl font-bold leading-tight text-white md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-base text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/8 pt-5">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      isCert
                        ? "border border-amber-400/30 bg-amber-400/10 text-amber-300"
                        : "border border-violet-500/30 bg-violet-500/10 text-violet-400"
                    }`}
                  >
                    {item.date}
                  </span>

                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/8 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:border-amber-400/50 hover:bg-amber-400/15"
                    >
                      Verify on Credly
                      <span className="text-xs opacity-70">↗</span>
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500">Ton Duc Thang University</span>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-8 flex items-center justify-center gap-0">
          <div
            className="inline-flex items-center gap-6 rounded-2xl border border-white/10 px-8 py-4"
            style={{ background: "rgba(24,18,47,0.6)" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-sm font-medium text-slate-300">English</span>
              <span className="rounded-md border border-blue-400/25 bg-blue-400/10 px-2 py-0.5 text-xs font-semibold text-blue-300">
                B1+
              </span>
            </div>
            <div className="h-5 w-px bg-white/15" />
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-sm font-medium text-slate-300">Vietnamese</span>
              <span className="rounded-md border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-400">
                Native
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
