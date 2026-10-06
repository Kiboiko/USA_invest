import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, UserRound, X } from 'lucide-react';
import { prelandBrand, routes } from '@/config/site';
import { prelandNav, prelandSubNav, prelandTopBar } from '@/data/preland';
import { useLinkWithQuery } from '@/hooks/useUtm';

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
    <header className="sticky top-0 z-40 bg-white">
      <div className="border-b border-black/70">
        <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="preland-mobile-menu" className="grid h-10 w-10 place-items-center text-black">
              <Menu className="h-8 w-8" aria-hidden="true" />
            </button>
            <button type="button" aria-label={prelandTopBar.searchLabel} className="hidden grid h-10 w-10 place-items-center text-black sm:grid">
              <Search className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>

          <Link to={linkTo(routes.preland)} aria-label={`${prelandBrand.name} — home`} className="flex items-center gap-1">
            {['B', 'B', 'C'].map((letter, index) => <span key={`${letter}-${index}`} className="grid h-11 w-11 place-items-center bg-black text-3xl font-black text-white">{letter}</span>)}
          </Link>

          <button type="button" aria-label="Sign in" className="grid h-10 w-10 place-items-center text-black">
            <UserRound className="h-7 w-7" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="border-b border-news-line bg-[#f4f4f4]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <nav aria-label="Main navigation" className="hidden flex-wrap items-center gap-6 text-sm font-semibold text-news-ink sm:flex">
            {prelandNav.map((item) => <a key={item.label} href={item.href} className="transition hover:text-news-accent">{item.label}</a>)}
          </nav>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-news-muted sm:hidden">BBC News Services</span>
          <button type="button" className="inline-flex items-center gap-2 rounded border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-news-ink transition hover:bg-black hover:text-white sm:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-4 w-4" aria-hidden="true" /> Menu
          </button>
          <span className="hidden text-xs text-news-muted sm:inline">{formatToday()}</span>
        </div>
      </div>

      <div className="hidden border-t border-white/10 bg-[#96030f]/10 text-white/80 sm:block">
        <div className="mx-auto flex flex-wrap gap-4 px-4 py-2 sm:px-6">
          {prelandSubNav.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
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
