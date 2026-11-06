/*
 * A running stitch (puntada) drawn just inside its parent, like the seam on a sewn patch.
 * The parent must be `relative`. Corner radius should be the parent's radius minus the inset.
 */
export function Stitches({
  className = "inset-3",
  radius = 24,
  animate = false,
}: {
  className?: string;
  radius?: number;
  animate?: boolean;
}) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <svg className="absolute inset-0 size-full overflow-visible">
        <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="9 9"
        className={animate ? "animate-stitch-in" : undefined}
        />
      </svg>
    </span>
  );
}

/*
 * A single straight seam, horizontal by default. Used to thread the order steps together.
 * Position and size it with `className` (e.g. `absolute left-14 right-0 top-7 h-px`).
 */
export function StitchLine({ className = "", vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none ${className}`}>
      <svg className="absolute inset-0 size-full overflow-visible">
        <line
          x1={vertical ? "50%" : "0"}
          y1={vertical ? "0" : "50%"}
          x2={vertical ? "50%" : "100%"}
          y2={vertical ? "100%" : "50%"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="9 9"
        />
      </svg>
    </span>
  );
}
