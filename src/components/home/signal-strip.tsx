import { siteContent } from "@/content/site-content";

export function SignalStrip() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="deck-frame rounded-[1.9rem] p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">Routing Layer</p>
        <p className="mt-4 max-w-3xl font-[var(--font-display)] text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">
          {siteContent.home.supportLine}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {siteContent.home.metrics.map((metric) => (
          <div key={metric.label} className="telemetry-cell rounded-[1.3rem] px-5 py-5">
            <p className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-white">{metric.value}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/42">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
