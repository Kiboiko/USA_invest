import { Flag, MessageSquare, ThumbsUp } from 'lucide-react';
import { commentsSection } from '@/data/preland';

/**
 * Статический блок комментариев (по референсу).
 * Ни авторизации, ни отправки — только визуальный слой.
 */
export function Comments() {
  return (
    <section aria-labelledby="comments-title" className="mt-12 border-t border-news-line pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="comments-title"
          className="flex items-center gap-2 font-serif text-2xl font-bold text-news-ink"
        >
          <MessageSquare className="h-5 w-5 text-news-muted" aria-hidden="true" />
          {commentsSection.title}
          <span className="text-base font-normal text-news-muted">
            ({commentsSection.items.length})
          </span>
        </h2>
        <span className="text-sm text-news-muted">{commentsSection.sortLabel}</span>
      </div>

      {commentsSection.notice ? (
        <p className="mt-2 text-xs text-news-muted">{commentsSection.notice}</p>
      ) : null}

      <ul className="mt-6 space-y-5">
        {commentsSection.items.map((comment) => (
          <li key={comment.author} className="border-b border-news-line pb-5 last:border-b-0">
            <div className="flex gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper-alt text-xs font-bold text-news-muted"
                aria-hidden="true"
              >
                {comment.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                  <span className="font-semibold text-news-ink">{comment.author}</span>
                  <span className="text-news-muted">{comment.time}</span>
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-news-ink">{comment.text}</p>
                <p className="mt-2.5 flex items-center gap-5 text-xs text-news-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                    {comment.likes}
                  </span>
                  {comment.replies ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                      {comment.replies} replies
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5">
                    <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                    Report
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
