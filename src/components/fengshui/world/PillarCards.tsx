import { elementColor } from "./elements";

type Props = {
  han: string;
  label: string;
  className?: string;
  /** Show these words in place of the stem and branch characters, for a card that stands for any pillar. */
  generic?: { stem: string; branch: string };
};

/** One pillar of a chart: a label over its stem and branch, each tinted by its element. */
export function PillarCard({ han, label, className, generic }: Props) {
  const [stem, branch] = han.split("");
  if (generic) {
    return (
      <div className={`fs-pillar fs-pillar-generic ${className ?? ""}`}>
        <small>{label}</small>
        <b>
          <span>{generic.stem}</span>
          <span>{generic.branch}</span>
        </b>
      </div>
    );
  }
  return (
    <div className={`fs-pillar ${className ?? ""}`}>
      <small>{label}</small>
      <b className="fs-han" aria-label={han}>
        <span style={{ color: elementColor(stem) }}>{stem}</span>
        <span style={{ color: elementColor(branch) }}>{branch}</span>
      </b>
    </div>
  );
}
