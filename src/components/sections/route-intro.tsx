import { ReactNode } from "react";

type RouteIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function RouteIntro({ eyebrow, title, description, children }: RouteIntroProps) {
  return (
    <div className="max-w-3xl space-y-5">
      <span className="inline-flex rounded-full border border-white/12 bg-white/4 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
        {eyebrow}
      </span>
      <div className="space-y-3">
        <h1 className="font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-8 text-white/72 md:text-lg">{description}</p>
      </div>
      {children}
    </div>
  );
}
