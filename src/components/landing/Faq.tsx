import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { landingBrand } from '@/config/site';
import { faq } from '@/data/landing';
import { Panel } from '@/components/landing/Panel';
import { cn } from '@/lib/cn';

/**
 * FAQ-аккордеон.
 * Можно держать открытыми несколько пунктов одновременно.
 * Доступность: кнопка + aria-expanded + aria-controls, анимация на CSS-грид.
 */
export function Faq() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <Panel id={faq.id} title={faq.title}>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
        <ul className="min-w-0">
          {faq.items.map((item, index) => {
            const open = openItems.has(index);
            return (
              <li key={item.question} className="border-b border-ink-500 last:border-b-0">
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left transition"
                  >
                    <span
                      className={cn(
                        'text-[15px] font-medium transition',
                        open ? 'text-accent-500' : 'text-white',
                      )}
                    >
                      {item.question}
                    </span>
                    <span className="shrink-0 text-accent-500" aria-hidden="true">
                      {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  className="faq-panel"
                  data-open={open}
                >
                  <div>
                    <p className="pb-4 text-sm leading-relaxed text-fg-muted">{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="flex min-w-0 flex-col justify-center rounded-xl border border-ink-500 bg-ink-600/40 p-6 sm:p-8">
          <h3 className="text-2xl font-extrabold text-white">{faq.sideCard.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{faq.sideCard.text}</p>
          <a
            href={`mailto:${landingBrand.supportEmail}`}
            className="mt-5 inline-flex items-center justify-center rounded-lg border-2 border-accent-500 px-6 py-3.5 text-sm font-extrabold tracking-wide text-accent-500 uppercase transition hover:bg-accent-500 hover:text-ink-900"
          >
            {faq.sideCard.button}
          </a>
        </aside>
      </div>
    </Panel>
  );
}
