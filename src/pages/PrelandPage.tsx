import { prelandFinalCta, prelandSeo } from '@/data/preland';
import { useSeo } from '@/hooks/useSeo';
import { PrelandHeader } from '@/components/preland/PrelandHeader';
import { ArticleHead } from '@/components/preland/ArticleHead';
import { ArticleBody } from '@/components/preland/ArticleBody';
import { ArticleCta } from '@/components/preland/ArticleCta';
import { Comments } from '@/components/preland/Comments';
import { RelatedArticles } from '@/components/preland/RelatedArticles';
import { Sidebar } from '@/components/preland/Sidebar';
import { PrelandFooter } from '@/components/preland/PrelandFooter';

/**
 * PRELAND — новостная страница-подводка.
 * Layout: широкая центральная колонка + sidebar справа (на мобильном — снизу).
 */
export default function PrelandPage() {
  useSeo(prelandSeo);

  return (
    <div className="min-h-screen bg-paper-alt">
      <a href="#article" className="skip-link">
        Skip to content
      </a>

      <PrelandHeader />

      <main id="article" className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <article className="min-w-0">
            <ArticleHead />
            <ArticleBody />

            <ArticleCta
              eyebrow={prelandFinalCta.eyebrow || undefined}
              title={prelandFinalCta.title}
              text={prelandFinalCta.text}
              button={prelandFinalCta.button}
              note={prelandFinalCta.note || undefined}
              placement="article-final"
              variant={prelandFinalCta.variant ?? 'final'}
            />

            <Comments />
            <RelatedArticles />
          </article>

          {/* На мобильном sidebar оказывается под статьёй благодаря порядку в DOM */}
          <div className="min-w-0 lg:sticky lg:top-40 lg:self-start">
            <Sidebar />
          </div>
        </div>
      </main>

      <PrelandFooter />
    </div>
  );
}
