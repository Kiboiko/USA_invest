import { hero } from '@/data/landing';
import { Icon } from '@/components/common/Icon';
import { LeadForm } from '@/components/landing/LeadForm';
import { LocalVideo } from '@/components/common/LocalVideo';

const heroVideoSrc = '/videos/finvoryx-landing.mp4';

/**
 * HERO.
 * Desktop: слева заголовок → фичи → плашка входа, справа форма.
 * Mobile: заголовок → иллюстрация → форма → фичи → плашка.
 *
 * Порядок задан сеткой (row-start/col-start), поэтому форма существует
 * в единственном экземпляре — id="lead-form" не дублируется.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-2xl border border-ink-500/70 bg-ink-800"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-ink-800 via-ink-800/55 to-ink-800/85"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 lg:py-16">
        {/* 1. Заголовок */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <h1
            id="hero-title"
            className="text-[32px] leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-[54px]"
          >
            {hero.titleLead} <span className="text-accent-500">{hero.titleAccent}</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
            {hero.subtitle}
          </p>

          <LocalVideo
            src={heroVideoSrc}
            title="Finvoryx Capital platform preview"
            poster="/images/warren-buffett-client.png"
            className="mt-8 w-full max-w-[560px]"
          />
        </div>

        {/* 2. Форма (на desktop — правая колонка, на мобильном — после заголовка) */}
        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <LeadForm />
        </div>

        {/* 3. Фичи и плашка входа */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:max-w-[520px]">
            {hero.features.map((feature) => (
              <li key={feature.label} className="flex flex-col items-center text-center">
                <span
                  className="grid h-14 w-14 place-items-center rounded-full border border-accent-500/40 bg-ink-700/70"
                  aria-hidden="true"
                >
                  <Icon name={feature.icon} className="h-6 w-6 text-accent-500" />
                </span>
                <span className="mt-2.5 text-xs leading-tight font-medium whitespace-pre-line text-fg-muted sm:text-[13px]">
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex max-w-[520px] gap-4 rounded-xl border border-ink-500 bg-ink-700/70 p-5">
            <Icon name={hero.accessNote.icon} className="mt-0.5 h-6 w-6 shrink-0 text-accent-500" />
            <div>
              <h2 className="text-lg font-bold text-white">{hero.accessNote.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">{hero.accessNote.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
