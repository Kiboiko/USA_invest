import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { routes } from '@/config/site';
import { topStories, moreToExplore, newsletterCard, sidebarPromo } from '@/data/preland';
import { useLinkWithQuery } from '@/hooks/useUtm';
import { trackEvent } from '@/components/common/Analytics';

/**
 * Боковая колонка: top stories, more to explore, CTA и подписка.
 * На мобильном колонка переносится под статьёй (см. PrelandPage).
 */
export function Sidebar() {
  const linkTo = useLinkWithQuery();

  return (
    <aside className="space-y-8" aria-label="Sidebar">
      <section aria-labelledby="top-stories-title">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="top-stories-title"
            className="text-lg font-bold uppercase tracking-[0.2em] text-news-ink"
          >
            Top stories
          </h2>
        </div>
        <div className="mt-4 space-y-4 rounded-xl border border-news-line bg-paper-alt p-4">
          {topStories.map((story, index) => (
            <article key={story.title} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9292f] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#007d79]">Live</p>
                  <h3 className="mt-1 text-sm font-semibold text-news-ink">{story.title}</h3>
                  <p className="mt-2 text-xs text-news-muted">{story.meta}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="more-explore-title">
        <h2
          id="more-explore-title"
          className="text-lg font-bold uppercase tracking-[0.2em] text-news-ink"
        >
          More to explore
        </h2>
        <div className="mt-4 grid gap-4">
          {moreToExplore.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-xl border border-news-line bg-white shadow-sm">
              <img src={item.image} alt={item.imageAlt} className="h-24 w-full object-cover" />
              <div className="p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-news-accent">{item.category}</p>
                <h3 className="mt-2 text-sm font-semibold text-news-ink">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

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
