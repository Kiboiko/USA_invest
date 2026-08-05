import { Quote, Star } from 'lucide-react';
import { testimonials } from '@/data/landing';
import { Panel } from '@/components/landing/Panel';

/**
 * Отзывы. Контент — PLACEHOLDER (см. data/landing.ts).
 * Подпись под секцией явно сообщает, что тексты подлежат замене.
 */
export function Testimonials() {
  return (
    <Panel id="testimonials" title={testimonials.title}>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {testimonials.items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex flex-col rounded-xl bg-white p-6 text-ink-800"
          >
            <Quote className="h-6 w-6 text-accent-700" aria-hidden="true" />
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-800/85">{item.text}</p>

            <p className="mt-4 flex items-center gap-1" aria-label={`Rating: ${item.rating} of 5`}>
              {Array.from({ length: item.rating }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  className="h-4 w-4 fill-accent-700 text-accent-700"
                  aria-hidden="true"
                />
              ))}
            </p>

            <p className="mt-3 flex items-baseline justify-between gap-3">
              <span className="text-sm font-bold text-ink-900">{item.name}</span>
              <span className="text-xs font-semibold text-ink-800/70">
                {item.location} <span className="text-[10px]">{item.countryCode}</span>
              </span>
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-center text-[11px] text-fg-muted/70">
        {testimonials.placeholderNotice}
      </p>
    </Panel>
  );
}
