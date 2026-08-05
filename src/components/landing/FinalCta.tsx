import { ArrowRight } from 'lucide-react';
import { finalCta } from '@/data/landing';
import { scrollToForm } from '@/lib/scrollToForm';
import { trackEvent } from '@/components/common/Analytics';

/** Финальный CTA: кнопка прокручивает страницу к форме в hero. */
export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="rounded-2xl border border-accent-500/30 bg-linear-to-b from-ink-700/80 to-ink-800 px-4 py-10 text-center sm:px-8 sm:py-14"
    >
      <h2
        id="final-cta-title"
        className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl"
      >
        {finalCta.title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-fg-muted sm:text-base">
        {finalCta.text}
      </p>
      <button
        type="button"
        onClick={() => {
          trackEvent('landing_cta_click', { placement: 'final' });
          scrollToForm();
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-7 py-4 text-sm font-extrabold tracking-wide text-ink-900 uppercase transition hover:bg-accent-400 sm:text-base"
      >
        {finalCta.button}
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="mt-4 text-xs text-fg-muted/70">{finalCta.note}</p>
    </section>
  );
}
