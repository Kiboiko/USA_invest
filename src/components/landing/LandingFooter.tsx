import { landingBrand } from '@/config/site';
import { landingFooter } from '@/data/landing';

export function LandingFooter() {
  return (
    <footer className="mt-12 border-t border-ink-500/70 bg-ink-900">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="grid h-9 w-9 place-items-center rounded-md border-2 border-accent-500 text-lg font-black text-white"
                aria-hidden="true"
              >
                {landingBrand.monogram}
              </span>
              <span className="text-lg font-extrabold tracking-[0.14em] text-white">
                {landingBrand.shortName.toUpperCase()}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted">
              {landingFooter.about}
            </p>
            <a
              href={`mailto:${landingBrand.supportEmail}`}
              className="mt-3 inline-block text-sm font-semibold text-accent-500 hover:text-accent-400"
            >
              {landingBrand.supportEmail}
            </a>
          </div>

          {landingFooter.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-bold text-white">{column.title}</h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-fg-muted transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-10 border-t border-ink-500/70 pt-6 text-xs leading-relaxed text-fg-muted/70">
          {landingFooter.disclaimer}
        </p>
        <p className="mt-3 text-xs text-fg-muted/70">{landingFooter.copyright}</p>
      </div>
    </footer>
  );
}
