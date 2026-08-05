import { priorities } from '@/data/landing';
import { Icon } from '@/components/common/Icon';
import { Panel } from '@/components/landing/Panel';

/** Четыре приоритета с SVG-иконками и разделителями между колонками. */
export function Priorities() {
  return (
    <Panel id={priorities.id} title={priorities.title}>
      <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {priorities.items.map((item, index) => (
          <li
            key={item.title}
            className={
              index > 0
                ? 'px-2 text-center lg:border-l lg:border-ink-500 lg:px-6'
                : 'px-2 text-center lg:px-6'
            }
          >
            <Icon name={item.icon} className="mx-auto h-11 w-11 text-accent-500" />
            <h3 className="mt-4 text-lg font-bold text-accent-500">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.text}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
