type TechSectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function TechSectionHeading({ eyebrow, title, description }: TechSectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <span className="tech-eyebrow">{eyebrow}</span>
      <h2 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-8 text-white/70 md:text-lg">{description}</p> : null}
    </div>
  );
}
