import { Check } from 'lucide-react';
import { articleBody, articleDisclaimer, type ArticleBlock } from '@/data/preland';
import { ArticleCta } from '@/components/preland/ArticleCta';
import { ArticleInlineText } from '@/components/preland/ArticleInlineText';

/** Рендер одного блока статьи. Типы блоков описаны в data/preland.ts */
function Block({ block, index }: { block: ArticleBlock; index: number }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="mt-9 mb-3 font-serif text-2xl leading-snug font-bold text-news-ink sm:text-[28px]">
          {block.text}
        </h2>
      );

    case 'paragraph':
      return (
        <p className="mb-5 font-serif text-[17px] leading-[1.75] text-news-ink sm:text-[19px]">
          {block.text ? <ArticleInlineText text={block.text} /> : null}
        </p>
      );

    case 'emphasis':
      return (
        <p className="mb-5 font-serif text-[17px] leading-[1.75] text-news-ink italic sm:text-[19px]">
          {block.text ? <ArticleInlineText text={block.text} /> : null}
        </p>
      );

    case 'quote':
      return (
        <figure className="my-8 border-l-4 border-news-accent pl-5">
          <blockquote className="font-serif text-xl leading-snug font-semibold text-news-ink sm:text-2xl">
            “{block.text}”
          </blockquote>
          {block.attribution && (
            <figcaption className="mt-3 text-sm text-news-muted">{block.attribution}</figcaption>
          )}
        </figure>
      );

    case 'list':
      return (
        <ul className="mb-6 space-y-3">
          {block.items?.map((item) => (
            <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-news-ink">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-news-accent"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'keyPoints':
      return (
        <aside className="my-7 rounded-lg bg-paper-alt p-5">
          <h2 className="mb-3 text-xs font-bold tracking-[0.16em] text-news-ink uppercase">
            {block.title}
          </h2>
          <ul className="space-y-2.5">
            {block.items?.map((item) => (
              <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-news-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-news-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      );

    case 'cta':
      return block.cta ? (
        <ArticleCta
          title={block.cta.title}
          text={block.cta.text}
          button={block.cta.button}
          note={block.cta.note}
          features={block.cta.features}
          placement={`article-inline-${index}`}
          eyebrow={block.cta.variant === 'banner' ? undefined : 'Sponsored'}
          variant={block.cta.variant ?? 'inline'}
        />
      ) : null;

    default:
      return null;
  }
}

export function ArticleBody() {
  return (
    <div className="mt-8">
      {articleBody.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} index={index} />
      ))}

      {articleDisclaimer ? (
        <p className="mt-8 border-t border-news-line pt-5 text-xs leading-relaxed text-news-muted">
          {articleDisclaimer}
        </p>
      ) : null}
    </div>
  );
}
