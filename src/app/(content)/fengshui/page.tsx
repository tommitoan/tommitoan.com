import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { RouteIntro } from "@/components/sections/route-intro";
import { fengshuiContent } from "@/content/fengshui-content";

export const metadata = createMetadata({
  title: "Feng Shui",
  description: fengshuiContent.description,
  path: "/fengshui/",
});

export default function FengShuiPage() {
  return (
    <PageShell className="space-y-8 pb-20 pt-10 md:space-y-10 md:pb-28 md:pt-14">
      <RouteIntro
        eyebrow={fengshuiContent.eyebrow}
        title={fengshuiContent.title}
        description={fengshuiContent.description}
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-route-panel rounded-[2rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Overview</p>
          <div className="mt-4 space-y-5 text-base leading-8 text-white/72">
            {fengshuiContent.intro.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={fengshuiContent.links.demo} target="_blank" rel="noreferrer" className="tech-button-primary">
              Open live demo
            </Link>
            <Link href={fengshuiContent.links.repo} target="_blank" rel="noreferrer" className="tech-button-secondary">
              View repository
            </Link>
          </div>
        </div>

        <div className="space-route-panel overflow-hidden rounded-[2rem] p-3">
          <div className="overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#10120d]">
            <Image
              src="/projects/bazica/preview.png"
              alt="Bazica preview"
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {fengshuiContent.pillars.map((item) => (
          <article key={item.title} className="space-route-panel rounded-[1.75rem] p-6">
            <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/68">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-route-panel rounded-[2rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Growth lanes</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {fengshuiContent.lanes.map((lane) => (
              <article key={lane.title} className="rounded-[1.45rem] border border-white/8 bg-white/[0.03] p-5">
                <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                  {lane.title}
                </h3>
                <ul className="mt-4 grid gap-2 text-sm leading-7 text-white/68">
                  {lane.items.map((item) => (
                    <li key={item} className="rounded-[1rem] border border-white/6 bg-black/12 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="space-route-panel rounded-[2rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Guiding principles</p>
          <div className="mt-6 grid gap-3">
            {fengshuiContent.principles.map((item, index) => (
              <div key={item} className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Principle {index + 1}</p>
                <p className="mt-2 text-base leading-7 text-white/72">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
