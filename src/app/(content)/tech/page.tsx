import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { TechHero } from "@/components/tech/tech-hero";
import { TechSectionHeading } from "@/components/tech/tech-section-heading";
import { techContent } from "@/content/tech-content";

export const metadata = createMetadata({
  title: "Tech",
  description: techContent.description,
  path: "/tech/",
});

export default function TechPage() {
  return (
    <PageShell className="space-y-8 pb-20 pt-10 md:space-y-10 md:pb-28 md:pt-14">
      <TechHero />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-route-panel rounded-[2rem] p-6 md:p-8">
          <TechSectionHeading eyebrow="Overview" title="The backend and platform layer I like working in." />
          <div className="mt-6 space-y-5 text-base leading-8 text-white/72">
            {techContent.about.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {techContent.strengths.map((item) => (
            <div key={item.title} className="space-route-panel rounded-[1.7rem] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">Core strength</p>
              <h3 className="mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/68">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-route-panel rounded-[2rem] p-6 md:p-8">
        <TechSectionHeading
          eyebrow="Skills"
          title="The stack I use most often when building reliable systems."
          description="A compact grouping of the tools and layers that show up repeatedly across production work and personal builds."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {techContent.skills.map((group) => (
            <article key={group.title} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
              <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                {group.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="tech-pill">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="space-route-panel rounded-[2rem] p-6 md:p-8">
        <TechSectionHeading
          eyebrow="Experience"
          title="Production environments, migrations, and delivery systems."
          description="A short version of the engineering journey now living inside tommitoan.com."
        />
        <div className="mt-8 grid gap-4">
          {techContent.experience.map((item) => (
            <article key={`${item.company}-${item.period}`} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-white">
                    {item.company}
                  </h3>
                  <p className="mt-1 text-base text-white/64">{item.role}</p>
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-white/42">
                  {item.location} · {item.period}
                </p>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-white/72 md:text-base">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-[1.1rem] border border-white/6 bg-black/12 px-4 py-3">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="space-route-panel rounded-[2rem] p-6 md:p-8">
          <TechSectionHeading eyebrow="Projects" title="Public proof and personal systems." />
          <div className="mt-8 grid gap-4">
            {techContent.projects.map((project) => (
              <article key={project.name} className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-white/[0.03]">
                {project.image ? (
                  <div className="border-b border-white/8 bg-black/20 p-3">
                    <div className="overflow-hidden rounded-[1.2rem] border border-white/6 bg-[#09101d]">
                      <Image
                        src={project.image}
                        alt={project.name}
                        width={1600}
                        height={900}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                        {project.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-white/68">{project.summary}</p>
                    </div>
                    {project.href ? (
                      <Link href={project.href} target="_blank" rel="noreferrer" className="tech-button-secondary shrink-0">
                        GitHub
                      </Link>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/78">{project.impact}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="tech-pill">
                        {item}
                      </span>
                    ))}
                  </div>
                  {project.liveHref ? (
                    <div className="mt-5">
                      <Link href={project.liveHref} target="_blank" rel="noreferrer" className="tech-button-primary">
                        Open live demo
                      </Link>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <section className="space-route-panel rounded-[2rem] p-6 md:p-8">
            <TechSectionHeading eyebrow="Education" title="Credentials and formal milestones." />
            <div className="mt-6 grid gap-3">
              {techContent.education.map((item) => (
                <article key={item.title} className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
                  <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/68">{item.subtitle}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/42">{item.date}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-route-panel rounded-[2rem] p-6 md:p-8">
            <TechSectionHeading
              eyebrow="Contact"
              title="If the Tech route is the right one, these are the fastest exits."
            />
            <div className="mt-8 grid gap-3">
              <a href={`mailto:${techContent.contact.email}`} className="tech-contact-card">
                <span>Email</span>
                <strong>{techContent.contact.email}</strong>
              </a>
              <a href={techContent.contact.github} target="_blank" rel="noreferrer" className="tech-contact-card">
                <span>GitHub</span>
                <strong>github.com/tommitoan</strong>
              </a>
              <a href={techContent.contact.linkedin} target="_blank" rel="noreferrer" className="tech-contact-card">
                <span>LinkedIn</span>
                <strong>linkedin.com/in/tommitoan</strong>
              </a>
              <a href={techContent.contact.resume} target="_blank" rel="noreferrer" className="tech-contact-card">
                <span>External resume</span>
                <strong>toanngo.cv</strong>
              </a>
            </div>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
