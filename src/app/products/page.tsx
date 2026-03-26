import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { RouteIntro } from "@/components/sections/route-intro";
import { siteContent } from "@/content/site-content";

export const metadata = createMetadata({
  title: "Products",
  description: siteContent.products.intro,
  path: "/products/",
});

export default function ProductsPage() {
  const featured = siteContent.products.featured;

  return (
    <PageShell className="space-y-8 pb-20 md:space-y-10 md:pb-28">
      <RouteIntro eyebrow="Products" title={siteContent.products.heading} description={siteContent.products.intro} />

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="foundation-panel overflow-hidden rounded-[2rem] p-3">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#07101b]">
            <Image
              src={featured.image!}
              alt="Bazica live demo preview"
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="foundation-panel rounded-[2rem] p-6 md:p-8">
          <div className="inline-flex rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/82">
            Featured product · {featured.status}
          </div>
          <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
            {featured.name}
          </h2>
          <p className="mt-4 text-base leading-8 text-white/72">{featured.summary}</p>
          <p className="mt-4 text-sm leading-7 text-white/58">{featured.note}</p>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {featured.stats?.map((stat) => (
              <div key={stat.label} className="rounded-[1.35rem] border border-white/8 bg-white/3 px-4 py-4">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-white">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/44">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={featured.href!}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-amber-300/18 bg-amber-300/10 px-5 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-300/16"
            >
              {featured.cta}
            </Link>
            <Link
              href="https://github.com/tommitoan/bazica"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-white/12 bg-white/4 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8"
            >
              View repository
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {siteContent.products.cards.map((card) => {
          const content = (
            <div className="foundation-panel h-full rounded-[1.75rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/82">
                  {card.status}
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-white/36">{card.kind}</span>
              </div>
              <h2 className="mt-5 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-white">
                {card.name}
              </h2>
              <p className="mt-3 text-base leading-7 text-white/70">{card.summary}</p>
              <p className="mt-4 text-sm leading-7 text-white/54">{card.note}</p>
            </div>
          );

          if (!("href" in card) || !card.href) {
            return <div key={card.name}>{content}</div>;
          }

          return (
            <Link key={card.name} href={card.href} target="_blank" rel="noreferrer">
              {content}
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="foundation-panel rounded-[1.9rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">Product Lanes</p>
          <div className="mt-5 grid gap-4">
            {siteContent.products.lanes.map((lane) => (
              <div key={lane.title} className="rounded-[1.5rem] border border-white/8 bg-white/3 p-5">
                <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white">
                  {lane.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-white/64">{lane.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {lane.items.map((item) => (
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

        <div className="foundation-panel rounded-[1.9rem] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">Guardrail</p>
          <p className="mt-5 text-lg leading-8 text-white/74">{siteContent.products.guardrail}</p>

          <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-white/3 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Status logic</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-white">Live</p>
                <p className="mt-1 text-sm leading-7 text-white/58">Open and usable right now.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Preview</p>
                <p className="mt-1 text-sm leading-7 text-white/58">Visible direction, not fully public yet.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Planned</p>
                <p className="mt-1 text-sm leading-7 text-white/58">Intent is clear, build is not public yet.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Private</p>
                <p className="mt-1 text-sm leading-7 text-white/58">Exists for operations or personal use, not for public surfacing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="foundation-panel rounded-[1.8rem] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/72">Context</p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <p className="max-w-2xl text-lg leading-8 text-white/74">
            The public product hub is deliberately narrower than the total system. Discover shows the ecosystem. Products shows only the surfaces that are ready to represent it.
          </p>
          <Link
            href="/discover"
            className="inline-flex rounded-full border border-white/12 bg-white/4 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8"
          >
            Back to Discover
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
