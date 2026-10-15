/**
 * A scroll cue: a small mouse whose wheel runs down and three chevrons that fall after it. It is drawn with CSS only and
 * hidden from assistive technology, because it only tells a sighted visitor that the page continues below.
 */
export function ScrollCue({ className }: { className?: string }) {
  return (
    <div className={`fs-cue ${className ?? ""}`.trim()} aria-hidden="true">
      <span className="fs-cue-mouse">
        <i />
      </span>
      <span className="fs-cue-chevrons">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
