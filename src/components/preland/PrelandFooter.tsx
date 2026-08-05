import { prelandBrand } from '@/config/site';
import { prelandFooter } from '@/data/preland';

export function PrelandFooter() {
  return (
    <footer className="mt-14 border-t border-news-line bg-paper-alt">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 place-items-center bg-news-accent text-xs font-black text-white"
                aria-hidden="true"
              >
                {prelandBrand.monogram}
              </span>
              <span className="font-serif text-lg font-bold text-news-ink">
                {prelandBrand.name}
              </span>
            </div>
            <p className="mt-3 text-xs tracking-[0.12em] text-news-muted uppercase">
              {prelandBrand.tagline}
            </p>
          </div>

          {prelandFooter.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-bold tracking-[0.14em] text-news-ink uppercase">
                {column.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-news-muted hover:text-news-ink">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-10 border-t border-news-line pt-6 text-xs leading-relaxed text-news-muted">
          {prelandFooter.disclaimer}
        </p>
        <p className="mt-3 text-xs text-news-muted">{prelandFooter.copyright}</p>
      </div>
    </footer>
  );
}
