import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AurtosMark } from './AurtosMark';

interface BrandLogoProps {
  href?: string;
  ariaLabel?: string;
  /** Pixel height of the A-mark icon. Text scales relative to this. */
  iconSize?: number;
  priority?: boolean;
  /** Show the "WEB · APP · MARKETING" tagline below text. */
  showTagline?: boolean;
  linkClassName?: string;
  /** @deprecated kept for backwards compatibility */
  imageClassName?: string;
  /** @deprecated kept for backwards compatibility */
  textClassName?: string;
  /** @deprecated kept for backwards compatibility */
  width?: number;
  height?: number;
}

export function BrandLogo({
  href,
  ariaLabel = 'Aurtos Studio',
  iconSize = 36,
  showTagline = false,
  linkClassName,
}: BrandLogoProps) {
  const content = (
    <span className="flex items-center gap-2.5 leading-none">
      <AurtosMark size={iconSize} title="Aurtos Studio" idSuffix={`-${iconSize}`} />
      <span className="flex flex-col">
        <span
          className="font-[family-name:var(--font-heading)] font-extrabold tracking-tight leading-none"
          style={{ fontSize: iconSize * 0.62 }}
        >
          <span className="bg-gradient-to-r from-primary via-[#7C5CFF] to-[#3B82F6] bg-clip-text text-transparent">
            Aurtos
          </span>{' '}
          <span className="text-foreground">Studio</span>
        </span>
        {showTagline && (
          <span
            className="mt-1 text-muted/70 uppercase tracking-[0.22em] font-medium"
            style={{ fontSize: iconSize * 0.22 }}
          >
            Web · App · Marketing
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center', linkClassName)}
      aria-label={ariaLabel}
    >
      {content}
    </Link>
  );
}
