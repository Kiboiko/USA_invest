import { Bookmark, Facebook, Link2, Linkedin, Twitter } from 'lucide-react';
import { article } from '@/data/preland';

function formatDate(iso: string): string {
  const date = new Date(iso);

  if (article.dateFormat === 'uppercase') {
    return date
      .toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
      .toUpperCase();
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Шапка статьи: рубрика, заголовок, лид, автор, дата, шеринг, hero-изображение. */
export function ArticleHead() {
  const showMetaRow = article.authorRole || article.readingTime;

  return (
    <>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold tracking-[0.14em] uppercase">
        <span className="text-news-accent">{article.category}</span>
        <span className="text-news-line" aria-hidden="true">
          /
        </span>
        <span className="text-news-muted">{article.subCategory}</span>
      </p>

      <h1 className="mt-3 font-serif text-[28px] leading-[1.15] font-bold tracking-tight text-news-ink sm:text-4xl lg:text-[46px]">
        {article.headline}
      </h1>

      {article.standfirst ? (
        <p className="mt-4 font-serif text-lg leading-relaxed text-news-muted sm:text-xl">
          {article.standfirst}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-news-line py-4">
        <div className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-full bg-paper-alt text-xs font-bold text-news-muted"
            aria-hidden="true"
          >
            {article.author.slice(0, 2).toUpperCase()}
          </span>
          <span className="text-sm leading-tight">
            <span className="block font-semibold text-news-accent">{article.author}</span>
            {showMetaRow ? (
              <span className="block text-news-muted">
                {article.authorRole}
                {article.authorRole && article.readingTime ? ' · ' : ''}
                {article.readingTime}
              </span>
            ) : null}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1 hidden text-xs text-news-muted sm:inline">
            {article.shareLabel}
          </span>
          {[
            { Icon: Twitter, label: 'Share on X' },
            { Icon: Facebook, label: 'Share on Facebook' },
            { Icon: Linkedin, label: 'Share on LinkedIn' },
            { Icon: Link2, label: 'Copy link' },
            { Icon: Bookmark, label: 'Save article' },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="grid h-9 w-9 place-items-center rounded-full border border-news-line text-news-muted transition hover:bg-paper-alt hover:text-news-ink"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm font-bold tracking-[0.08em] text-news-accent uppercase">
        {formatDate(article.publishedAt)}
      </p>

      <figure className="mt-6">
        <img
          src={article.heroImage}
          alt={article.heroImageAlt}
          width={1200}
          height={675}
          loading="eager"
          className="w-full rounded-lg border border-news-line bg-paper-alt"
        />
        {article.heroCaption ? (
          <figcaption className="mt-2 text-xs leading-relaxed text-news-muted">
            {article.heroCaption}
          </figcaption>
        ) : null}
      </figure>
    </>
  );
}
