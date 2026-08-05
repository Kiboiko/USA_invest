import { Link } from 'react-router-dom';
import { routes } from '@/config/site';
import { useLinkWithQuery } from '@/hooks/useUtm';
import { useSeo } from '@/hooks/useSeo';

export default function NotFoundPage() {
  const linkTo = useLinkWithQuery();
  useSeo({ title: 'Page not found', description: 'The page you requested does not exist.' });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold tracking-widest text-news-accent uppercase">Error 404</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="max-w-md text-news-muted">
        The page you requested does not exist or has been moved.
      </p>
      <Link
        to={linkTo(routes.preland)}
        className="mt-2 rounded-md bg-news-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Go to the homepage
      </Link>
    </main>
  );
}
