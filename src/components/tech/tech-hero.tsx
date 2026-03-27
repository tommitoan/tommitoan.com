import Link from "next/link";
import { techContent } from "@/content/tech-content";

export function TechHero() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
      <div className="space-route-panel rounded-[2rem] p-7 md:p-9">
        <span className="tech-eyebrow">{techContent.eyebrow}</span>
        <h1 className="mt-5 max-w-4xl font-[var(--font-display)] text-5xl font-semibold tracking-[-0.07em] text-white md:text-7xl">
          {techContent.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{techContent.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {techContent.highlights.map((item) => (
            <span key={item} className="tech-pill">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="#experience" className="tech-button-primary">
            View experience
          </Link>
          <Link href={techContent.contact.resume} target="_blank" rel="noreferrer" className="tech-button-secondary">
            Open resume site
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {techContent.metrics.map((metric) => (
          <div key={metric.label} className="space-route-panel rounded-[1.5rem] p-5">
            <p className="font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em] text-white">{metric.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/46">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
