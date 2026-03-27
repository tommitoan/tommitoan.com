import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { RouteIntro } from "@/components/sections/route-intro";
import { siteContent } from "@/content/site-content";

export const metadata = createMetadata({
  title: "Discover",
  description: siteContent.discover.intro,
  path: "/discover/",
});

export default function DiscoverPage() {
  return (
    <PageShell className="space-y-8 pb-20 pt-10 md:space-y-10 md:pb-28 md:pt-14">
      <RouteIntro
        eyebrow="Discover"
        title={siteContent.discover.heading}
        description={siteContent.discover.intro}
      />

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="foundation-panel rounded-[1.85rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">
            {siteContent.discover.now.heading}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/74">
            {siteContent.discover.now.body}
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {siteContent.discover.now.highlights.map((item) => (
            <div key={item} className="foundation-panel rounded-[1.5rem] p-5 text-white/76">
              <p className="text-sm uppercase tracking-[0.2em] text-white/42">Current layer</p>
              <p className="mt-3 text-base leading-7">{item}</p>
            </div>
          ))}
        </section>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="foundation-panel overflow-hidden rounded-[2rem] p-3">
          <div className="overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#07101b]">
            <Image
              src={siteContent.discover.homelab.image}
              alt={siteContent.discover.homelab.imageAlt}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="foundation-panel rounded-[2rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">Homelab</p>
          <h2 className="mt-4 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-white md:text-4xl">
            {siteContent.discover.homelab.heading}
          </h2>
          <p className="mt-4 text-base leading-8 text-white/72">{siteContent.discover.homelab.body}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {siteContent.discover.homelab.stack.map((item) => (
              <span
                key={item}
                className="inline-flex rounded-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white/68"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {siteContent.discover.homelab.flow.map((step, index) => (
              <div key={step} className="rounded-[1.35rem] border border-white/8 bg-white/3 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/42">Step {index + 1}</p>
                <p className="mt-2 text-sm leading-7 text-white/74">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="foundation-panel rounded-[1.9rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">What I Run</p>
          <div className="mt-5 grid gap-4">
            {siteContent.discover.services.map((group) => (
              <div key={group.title} className="rounded-[1.45rem] border border-white/8 bg-white/3 p-5">
                <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-white/66">{group.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-full border border-white/8 bg-[#0a1422] px-3 py-2 text-sm text-white/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="foundation-panel rounded-[1.9rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">Why It Matters</p>
            <div className="mt-5 grid gap-3">
              {siteContent.discover.experiments.map((item) => (
                <div key={item.title} className="rounded-[1.45rem] border border-white/8 bg-white/3 p-5">
                  <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="foundation-panel rounded-[1.9rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">Channels</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {siteContent.discover.channels.map((channel) => (
                <Link
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.35rem] border border-white/8 bg-white/3 p-5 transition hover:border-white/16 hover:bg-white/5"
                >
                  <p className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                    {channel.name}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{channel.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="foundation-panel rounded-[1.8rem] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">Next Route</p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <p className="max-w-2xl text-lg leading-8 text-white/74">
            If Discover shows the operating system behind the brand, Fengshui is where a more symbolic and product-shaped branch starts to become tangible.
          </p>
          <Link
            href="/fengshui"
            className="inline-flex rounded-full border border-white/12 bg-white/4 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8"
          >
            Go to Fengshui
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
