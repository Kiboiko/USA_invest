import { about } from '@/data/landing';
import { Panel } from '@/components/landing/Panel';

/** Секция About: изображение слева, текст справа (на мобильном — друг под другом). */
export function About() {
  return (
    <Panel id={about.id} title={about.title}>
      <div className="mt-8 grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <figure className="m-0">
          <img
            src={about.image}
            alt={about.imageAlt}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
            className="w-full max-w-[280px] rounded-xl border border-ink-500 bg-ink-600 md:max-w-none"
          />
          <figcaption className="mt-2 text-[11px] text-fg-muted/70">
            {about.imageCaption}
          </figcaption>
        </figure>

        <div className="min-w-0">
          <p className="text-lg font-bold text-white sm:text-xl">{about.lead}</p>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-[15px] leading-relaxed text-fg-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Panel>
  );
}
