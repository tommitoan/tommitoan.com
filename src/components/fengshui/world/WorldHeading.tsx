import type { FengShuiArt } from "@/content/fengshui-art";
import { RevealHeading } from "./RevealHeading";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  /** A wide picture drawn under the heading (src/content/fengshui-art.ts). */
  art?: FengShuiArt;
};

/** A wide picture of a band: decorative (the heading says it all), fetched when it comes near, with its size so the page does not jump. */
export function ArtFigure({ art }: { art: FengShuiArt }) {
  return (
    <figure className="fs-art">
      {/* eslint-disable-next-line @next/next/no-img-element -- watercolour of the band, the export has no image optimiser */}
      <img src={art.src} alt="" width={art.width} height={art.height} loading="lazy" decoding="async" />
    </figure>
  );
}

/** Eyebrow, a heading the kit reveals word by word, an optional description and an optional picture. */
export function WorldHeading({ eyebrow, title, description, art }: Props) {
  return (
    <div className="fs-heading">
      <span className="fs-eyebrow">{eyebrow}</span>
      <RevealHeading className="fs-title">{title}</RevealHeading>
      {description ? <p className="fs-copy">{description}</p> : null}
      {art ? <ArtFigure art={art} /> : null}
    </div>
  );
}
