import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PanelProps {
  id?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

/**
 * Крупная секция-карточка тёмной темы: скруглённые углы + тонкая рамка.
 * Такой контейнер повторяется на всём landing (см. референсы).
 */
export function Panel({ id, title, children, className, labelledBy }: PanelProps) {
  const headingId = id ? `${id}-title` : labelledBy;

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : labelledBy}
      className={cn(
        'rounded-2xl border border-ink-500/70 bg-ink-700/60 px-4 py-8 sm:px-8 sm:py-10 lg:px-10',
        className,
      )}
    >
      {title && (
        <h2
          id={headingId}
          className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-[34px]"
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
