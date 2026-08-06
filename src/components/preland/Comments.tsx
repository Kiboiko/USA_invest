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
          <span className="text-base font-normal text-news-muted">({commentsSection.items.length})</span>
        </h2>
        <span className="text-sm text-news-muted">{commentsSection.sortLabel}</span>
      </div>

      {commentsSection.notice ? (
        <p className="mt-2 text-xs text-news-muted">{commentsSection.notice}</p>
      ) : null}

      <ul className="mt-6 space-y-5">
        {commentsSection.items.map((comment) => (
          <li key={comment.author} className="rounded-3xl border border-news-line bg-paper-alt p-5 shadow-sm">
            <div className="flex gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f2f2] text-sm font-bold text-news-ink">
                {comment.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-news-ink">{comment.author}</p>
                  <span className="text-xs uppercase tracking-[0.18em] text-news-muted">{comment.time}</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-news-ink">{comment.text}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-news-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                    {comment.likes} likes
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
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
