import { elementColor } from "./elements";

type Props = {
  han: string;
  label: string;
  className?: string;
};

/** One pillar of a chart: a label over its stem and branch, each tinted by its element. */
export function PillarCard({ han, label, className }: Props) {
  const [stem, branch] = han.split("");
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
