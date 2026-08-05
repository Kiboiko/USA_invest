import { ArrowRight } from 'lucide-react';
import { howItWorks } from '@/data/landing';
import { Icon } from '@/components/common/Icon';
import { Panel } from '@/components/landing/Panel';

/** Три шага: на desktop в ряд со стрелками между карточками, на мобильном — колонкой. */
export function HowItWorks() {
  const lastIndex = howItWorks.steps.length - 1;

  return (
    <Panel id={howItWorks.id} title={howItWorks.title}>
      <ol className="mt-8 flex flex-col gap-5 md:flex-row md:items-stretch md:gap-0">
        {howItWorks.steps.map((step, index) => (
          <li key={step.title} className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative min-w-0 flex-1 self-stretch rounded-xl border border-ink-500 bg-ink-600/50 px-5 py-8 text-center">
              <span className="absolute top-4 left-4 grid h-8 w-8 place-items-center rounded-full bg-accent-500 text-sm font-bold text-ink-900">
                {index + 1}
              </span>
              <Icon name={step.icon} className="mx-auto h-10 w-10 text-accent-500" />
              <h3 className="mt-4 text-xl font-bold text-accent-500">{step.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{step.text}</p>
            </div>

            {index < lastIndex && (
              <ArrowRight
                className="hidden h-6 w-6 shrink-0 text-accent-500 md:block"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </Panel>
  );
}
