import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/config/site';
import { useLinkWithQuery } from '@/hooks/useUtm';

const LINK_PATTERN = /\[\[(.+?)]]/g;
const BOLD_PATTERN = /\*\*(.+?)\*\*/g;

function parseSegment(segment: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  BOLD_PATTERN.lastIndex = 0;
  while ((match = BOLD_PATTERN.exec(segment)) !== null) {
    if (match.index > lastIndex) {
      parts.push(segment.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`${keyPrefix}-bold-${match.index}`} className="font-bold">
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < segment.length) {
    parts.push(segment.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [segment];
}

/** Разметка из data/preland: [[ссылки]] и **жирный** */
export function ArticleInlineText({ text }: { text: string }) {
  const linkTo = useLinkWithQuery();
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        ...parseSegment(text.slice(lastIndex, match.index), `pre-${match.index}`),
      );
    }

    nodes.push(
      <Link
        key={`link-${match.index}`}
        to={linkTo(routes.landing)}
        className="text-[#6a3d9a] underline decoration-[#6a3d9a]/40 underline-offset-2 hover:decoration-[#6a3d9a]"
      >
        {match[1]}
      </Link>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(...parseSegment(text.slice(lastIndex), `post-${lastIndex}`));
  }

  return (
    <>
      {nodes.map((node, index) => (
        <Fragment key={`node-${index}`}>{node}</Fragment>
      ))}
    </>
  );
}
