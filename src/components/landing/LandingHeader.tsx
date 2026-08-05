import { useEffect, useState } from 'react';
import { Lock, Menu, X } from 'lucide-react';
import { landingBrand } from '@/config/site';
import { landingNav } from '@/data/landing';
import { scrollToForm } from '@/lib/scrollToForm';
import { trackEvent } from '@/components/common/Analytics';

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleCta = () => {
    setOpen(false);
    trackEvent('landing_cta_click', { placement: 'header' });
    scrollToForm();
  };

  return (
    <header className="relative z-30">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <a href="#top" className="flex items-center gap-3" aria-label={`${landingBrand.name} — top`}>
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 border-accent-500 text-xl font-black text-white"
            aria-hidden="true"
          >
            {landingBrand.monogram}
          </span>
          <span className="leading-none">
            <span className="block text-lg font-extrabold tracking-[0.14em] text-white sm:text-2xl">
              {landingBrand.shortName.toUpperCase()}
            </span>
            <span className="mt-1 block text-[10px] tracking-[0.34em] text-fg-muted sm:text-xs">
              CAPITAL
            </span>
          </span>
        </a>

        {/* Desktop-навигация */}
        <nav aria-label="Section navigation" className="hidden items-center gap-7 lg:flex">
          {landingNav.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-fg-muted transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <p className="hidden items-center gap-2 text-right sm:flex">
            <Lock className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
            <span className="leading-tight">
              <span className="block text-xs font-bold text-white">{landingNav.secure.title}</span>
              <span className="block text-[11px] text-fg-muted">{landingNav.secure.subtitle}</span>
            </span>
          </p>

          <button
            type="button"
            onClick={handleCta}
            className="hidden rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-bold text-ink-900 transition hover:bg-accent-400 lg:inline-flex"
          >
            {landingNav.cta}
          </button>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="landing-mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink-500 text-white lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="landing-mobile-menu"
          className="mx-4 rounded-xl border border-ink-500 bg-ink-700 p-4 shadow-xl lg:hidden"
        >
          <nav aria-label="Mobile section navigation">
            <ul className="space-y-1">
              {landingNav.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-semibold text-white hover:bg-ink-600"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={handleCta}
            className="mt-3 w-full rounded-lg bg-accent-500 px-4 py-3 text-sm font-bold text-ink-900"
          >
            {landingNav.cta}
          </button>
        </div>
      )}
    </header>
  );
}
