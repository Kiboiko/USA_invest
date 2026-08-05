import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { routes } from '@/config/site';
import { useLinkWithQuery } from '@/hooks/useUtm';
import { trackEvent } from '@/components/common/Analytics';
import { cn } from '@/lib/cn';

interface ArticleCtaProps {
  title: string;
  text: string;
  button: string;
  /** Метка для аналитики, чтобы различать CTA в статье */
  placement: string;
  note?: string;
  eyebrow?: string;
  features?: string[];
  variant?: 'inline' | 'banner' | 'prominent' | 'final';
}

/**
 * CTA-блок внутри статьи. Ведёт на landing и сохраняет query-параметры (UTM).
 */
export function ArticleCta({
  title,
  text,
  button,
  placement,
  note,
  eyebrow,
  features,
  variant = 'inline',
}: ArticleCtaProps) {
  const linkTo = useLinkWithQuery();

  if (variant === 'prominent') {
    return (
      <aside className="my-8 flex justify-center">
        <Link
          to={linkTo(routes.landing)}
          onClick={() => trackEvent('preland_cta_click', { placement })}
          className="inline-flex items-center justify-center rounded-full bg-[#e02020] px-10 py-4 text-lg font-bold text-white shadow-md transition hover:bg-[#c91a1a]"
        >
          {button}
        </Link>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'my-8 rounded-lg border p-5 sm:p-6',
        variant === 'banner'
          ? 'border-ink-900/20 bg-[#1a1a1a] text-white'
          : variant === 'final'
            ? 'border-news-ink/15 bg-news-ink text-white'
            : 'border-news-line bg-paper-alt',
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-2 text-[11px] font-bold tracking-[0.16em] uppercase',
            variant === 'final' || variant === 'banner'
              ? 'text-accent-500'
              : 'text-news-accent',
          )}
        >
          {eyebrow}
        </p>
      )}
      {title ? (
        <h3
          className={cn(
            'font-serif text-xl leading-snug font-bold sm:text-2xl',
            variant === 'banner' || variant === 'final' ? 'text-white' : 'text-news-ink',
          )}
        >
          {title}
        </h3>
      ) : null}
      {text ? (
        <p
          className={cn(
            'mt-2 text-[15px] leading-relaxed',
            variant === 'banner' || variant === 'final' ? 'text-white/75' : 'text-news-muted',
          )}
        >
          {text}
        </p>
      ) : null}
      {features && features.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-white/90">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        to={linkTo(routes.landing)}
        onClick={() => trackEvent('preland_cta_click', { placement })}
        className={cn(
          'mt-4 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition',
          variant === 'banner'
            ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
            : variant === 'final'
              ? 'bg-accent-500 text-ink-900 hover:bg-accent-400'
              : 'bg-news-ink text-white hover:opacity-90',
        )}
      >
        {button}
        {variant !== 'banner' ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Link>
      {note && (
        <p
          className={cn(
            'mt-3 text-xs',
            variant === 'banner'
              ? 'text-[#22c55e]'
              : variant === 'final'
                ? 'text-white/50'
                : 'text-news-muted',
          )}
        >
          {note}
        </p>
      )}
    </aside>
  );
}
