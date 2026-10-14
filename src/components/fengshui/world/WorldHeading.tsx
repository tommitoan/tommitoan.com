import { RevealHeading } from "./RevealHeading";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

/** Eyebrow, a heading the kit reveals word by word, and an optional description. */
export function WorldHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="fs-heading">
      <span className="fs-eyebrow">{eyebrow}</span>
      <RevealHeading className="fs-title">{title}</RevealHeading>
      {description ? <p className="fs-copy">{description}</p> : null}
    </div>
  );
}
