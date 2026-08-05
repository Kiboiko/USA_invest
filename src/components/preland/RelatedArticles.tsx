import { relatedArticles } from '@/data/preland';

/** Карточки других материалов под статьёй. */
export function RelatedArticles() {
  return (
    <section aria-labelledby="related-title" className="mt-12 border-t border-news-line pt-8">
      <h2
        id="related-title"
        className="border-b-2 border-news-ink pb-2 text-sm font-bold tracking-[0.14em] text-news-ink uppercase"
      >
        More from this section
      </h2>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedArticles.map((item) => (
          <li key={item.title}>
            <a href="#" className="group block">
              <img
                src={item.image}
                alt={item.imageAlt}
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
                className="aspect-video w-full rounded-md border border-news-line bg-paper-alt object-cover"
              />
              <p className="mt-3 text-[11px] font-bold tracking-[0.14em] text-news-accent uppercase">
                {item.category}
              </p>
              <h3 className="mt-1.5 font-serif text-lg leading-snug font-bold text-news-ink group-hover:underline">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs text-news-muted">{item.meta}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
