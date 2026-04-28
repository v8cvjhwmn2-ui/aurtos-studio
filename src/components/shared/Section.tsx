import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'surface' | 'gradient';
}

export function Section({ children, className, id, variant = 'default' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 md:py-28 overflow-hidden',
        variant === 'surface' && 'bg-surface',
        variant === 'gradient' &&
          'bg-gradient-to-br from-primary/10 via-background to-secondary/10',
        className
      )}
    >
      {children}
    </section>
  );
}
