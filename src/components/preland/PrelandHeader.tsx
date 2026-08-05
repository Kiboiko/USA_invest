import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { prelandBrand, routes } from '@/config/site';
import { prelandNav, prelandSubNav, prelandTopBar } from '@/data/preland';
import { useLinkWithQuery } from '@/hooks/useUtm';
import { cn } from '@/lib/cn';

function formatToday(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function PrelandHeader() {
  const [open, setOpen] = useState(false);
  const linkTo = useLinkWithQuery();

  // Блокируем прокрутку под открытым мобильным меню
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Esc закрывает меню
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-news-line bg-paper">
      {/* Верхняя служебная полоса — только desktop */}
      <div className="hidden border-b border-news-line md:block">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-2 text-xs text-news-muted">
          <span>{formatToday()}</span>
          <div className="flex items-center gap-5">
            <span>{prelandTopBar.location}</span>
            <a href="#newsletter" className="hover:text-news-ink">
              {prelandTopBar.newsletterLabel}
            </a>
          </div>
        </div>
      </div>

      {/* Основная строка с логотипом */}
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-5">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-news-ink md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="preland-mobile-menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <Link
          to={linkTo(routes.preland)}
          className="flex items-center gap-2.5"
          aria-label={`${prelandBrand.name} — home`}
        >
          <span
            className="grid h-9 w-9 place-items-center bg-news-accent text-sm font-black tracking-tight text-white"
            aria-hidden="true"
          >
            {prelandBrand.monogram}
          </span>
          <span className="leading-none">
            <span className="block font-serif text-lg font-bold tracking-tight text-news-ink sm:text-2xl">
              {prelandBrand.name}
            </span>
            <span className="mt-1 hidden text-[11px] tracking-[0.18em] text-news-muted uppercase sm:block">
              {prelandBrand.tagline}
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full border border-news-line text-news-ink transition hover:bg-paper-alt"
          aria-label={prelandTopBar.searchLabel}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Основная навигация — desktop */}
      <nav aria-label="Main navigation" className="hidden border-t border-news-line md:block">
        <ul className="mx-auto flex max-w-[1200px] items-center gap-6 px-6 text-sm font-semibold">
          {prelandNav.map((item, index) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  'inline-block border-b-[3px] py-3 transition',
                  index === 1
                    ? 'border-news-accent text-news-ink'
                    : 'border-transparent text-news-muted hover:text-news-ink',
                )}
                aria-current={index === 1 ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Подрубрики — desktop */}
      <div className="hidden border-t border-news-line bg-paper-alt md:block">
        <ul className="mx-auto flex max-w-[1200px] items-center gap-5 px-6 py-2 text-xs text-news-muted">
          {prelandSubNav.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="hover:text-news-ink">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="preland-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-paper shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-news-line px-5 py-4">
              <span className="font-serif text-lg font-bold">{prelandBrand.shortName}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-news-line"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-1">
                {prelandNav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-news-line py-3 text-base font-semibold text-news-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 space-y-2">
                {prelandSubNav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-1.5 text-sm text-news-muted"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="border-t border-news-line px-5 py-4 text-xs text-news-muted">
              {formatToday()}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
