/**
 * Aurtos "A" mark — inline SVG.
 * Renders pixel-perfect at any size on any background.
 * Gradient mirrors brand: indigo → violet → blue.
 */
type Props = {
  className?: string;
  size?: number | string;
  /** Force a unique gradient id when multiple Marks share a page (rare). */
  idSuffix?: string;
  title?: string;
};

export function AurtosMark({
  className,
  size = 40,
  idSuffix = '',
  title = 'Aurtos',
}: Props) {
  const id = `aurtos-grad${idSuffix}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="14"
          y1="20"
          x2="106"
          y2="108"
        >
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="55%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        fillRule="evenodd"
        d="
          M 60 10
          L 112 110
          L 86 110
          L 76 90
          L 44 90
          L 34 110
          L 8 110
          Z
          M 52 72
          L 68 72
          L 60 52
          Z
        "
      />
    </svg>
  );
}
