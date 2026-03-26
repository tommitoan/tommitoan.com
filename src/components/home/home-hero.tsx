import Link from "next/link";
import { CommandVisual } from "@/components/home/command-visual";
import { siteContent } from "@/content/site-content";

export function HomeHero() {
  return (
    <section className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-center">
      <div className="relative pl-5 md:pl-10">
        <div className="absolute left-0 top-3 h-40 w-px bg-gradient-to-b from-cyan-300 via-cyan-300/50 to-transparent md:left-2" />
        <div className="absolute left-[-0.35rem] top-0 h-3.5 w-3.5 rounded-full bg-cyan-200 shadow-[0_0_22px_rgba(109,211,255,0.95)] md:left-[0.1rem]" />

        <span className="inline-flex rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/62">
          {siteContent.home.eyebrow}
        </span>
        <h1 className="mt-6 max-w-4xl font-[var(--font-display)] text-5xl font-semibold leading-[0.96] tracking-[-0.07em] text-white sm:text-6xl md:text-7xl xl:text-[5.6rem]">
          <span className="block">Route into</span>
          <span className="block bg-[linear-gradient(135deg,#f6fbff_0%,#8be6ff_38%,#ffd091_100%)] bg-clip-text text-transparent">
            systems, story, and live output.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
          {siteContent.home.description}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          {siteContent.home.proof.map((item) => (
            <span key={item} className="status-chip inline-flex rounded-full px-4 py-2 text-sm text-white/74">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {siteContent.home.ctas.map((cta) => {
            const className =
              cta.style === "primary"
                ? "inline-flex rounded-full border border-cyan-300/22 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/16"
                : "inline-flex rounded-full border border-white/12 bg-white/4 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8";

            return (
              <Link
                key={cta.label}
                href={cta.href}
                target={cta.kind === "external" ? "_blank" : undefined}
                rel={cta.kind === "external" ? "noreferrer" : undefined}
                className={className}
              >
                {cta.label}
              </Link>
            );
          })}
        </div>
      </div>

      <CommandVisual />
    </section>
  );
}
