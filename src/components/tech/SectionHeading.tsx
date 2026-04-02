import { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string | ReactNode;
  description?: string | ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center"
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div className={isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="cv-eyebrow">{eyebrow}</span>
      <h2 className="cv-section-title mt-4">{title}</h2>
      {description && (
        <p className={`cv-section-copy mt-4 ${isCentered ? "" : "!mx-0"}`}>{description}</p>
      )}
    </div>
  );
}
