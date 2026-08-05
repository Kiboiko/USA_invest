import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { routes } from '@/config/site';
import { mostRead, newsletterCard, sidebarPromo } from '@/data/preland';
import { useLinkWithQuery } from '@/hooks/useUtm';
import { trackEvent } from '@/components/common/Analytics';

/**
 * Боковая колонка: Most Read, рекламный промо-блок с CTA и подписка.
 * На мобильном колонка переносится под статью (см. PrelandPage).
 */
export function Sidebar() {
  const linkTo = useLinkWithQuery();

  return (
    <aside className="space-y-8" aria-label="Sidebar">
      {/* Most read */}
      <section aria-labelledby="most-read-title">
        <h2
          id="most-read-title"
          className="border-b-2 border-news-ink pb-2 text-sm font-bold tracking-[0.14em] text-news-ink uppercase"
        >
          {mostRead.title}
        </h2>
        <ol className="mt-4 space-y-4">
          {mostRead.items.map((item, index) => (
            <li key={item} className="flex gap-3 border-b border-news-line pb-4 last:border-b-0">
              <span
                className="font-serif text-2xl leading-none font-bold text-news-line"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <a
                href="#"
                className="font-serif text-[15px] leading-snug font-semibold text-news-ink hover:text-news-accent"
              >
                {item}
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Промо с CTA на landing */}
      <section
        aria-labelledby="sidebar-promo-title"
        className="rounded-lg border border-news-line bg-paper-alt p-5"
      >
        <p className="text-[11px] font-bold tracking-[0.16em] text-news-accent uppercase">
          {sidebarPromo.eyebrow}
        </p>
        <h2
          id="sidebar-promo-title"
          className="mt-2 font-serif text-xl leading-snug font-bold text-news-ink"
        >
          {sidebarPromo.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-news-muted">{sidebarPromo.text}</p>
        <Link
          to={linkTo(routes.landing)}
          onClick={() => trackEvent('preland_cta_click', { placement: 'sidebar' })}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-news-ink px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          {sidebarPromo.button}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <p className="mt-3 text-[11px] text-news-muted">{sidebarPromo.note}</p>
      </section>

      {/* Подписка (демо, без backend) */}
      <section
        id="newsletter"
        aria-labelledby="newsletter-title"
        className="rounded-lg border border-news-line p-5"
      >
        <h2 id="newsletter-title" className="font-serif text-xl font-bold text-news-ink">
          {newsletterCard.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-news-muted">{newsletterCard.text}</p>
        <form
          className="mt-4 space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder={newsletterCard.placeholder}
            className="w-full rounded-md border border-news-line bg-paper px-3 py-2.5 text-sm text-news-ink placeholder:text-news-muted"
          />
          <button
            type="submit"
            className="w-full rounded-md border border-news-ink px-4 py-2.5 text-sm font-bold text-news-ink transition hover:bg-news-ink hover:text-white"
          >
            {newsletterCard.button}
          </button>
        </form>
        <p className="mt-3 text-[11px] text-news-muted">{newsletterCard.note}</p>
      </section>
    </aside>
  );
}
