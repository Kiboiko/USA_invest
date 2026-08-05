import { highlightBand } from '@/data/landing';

/**
 * Светлая плашка под hero.
 * Цифры и текст берутся из data/landing.ts — обещаний доходности здесь быть не должно.
 */
export function HighlightBand() {
  return (
    <section
      aria-label="Access conditions"
      className="rounded-2xl bg-linear-to-b from-white to-[#eaf7ec] px-4 py-8 text-center sm:px-8 sm:py-10"
    >
      <p className="text-2xl font-extrabold tracking-tight text-accent-700 sm:text-4xl lg:text-[42px]">
        {highlightBand.primary}
      </p>
      <p className="mt-2 text-lg font-bold text-accent-600 sm:text-2xl">
        {highlightBand.secondary}
      </p>
      {highlightBand.riskNote && (
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-ink-700/70">
          {highlightBand.riskNote}
        </p>
      )}
    </section>
  );
}
