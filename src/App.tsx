import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { routes } from '@/config/site';
import { Analytics } from '@/components/common/Analytics';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import PrelandPage from '@/pages/PrelandPage';
import LandingPage from '@/pages/LandingPage';
import NotFoundPage from '@/pages/NotFoundPage';

/** Редирект, сохраняющий query string (UTM не теряются на "/"). */
function RedirectToPreland() {
  const { search } = useLocation();
  return <Navigate to={`${routes.preland}${search}`} replace />;
}

export default function App() {
  return (
    <>
      <Analytics />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RedirectToPreland />} />
        <Route path={routes.preland} element={<PrelandPage />} />
        <Route path={routes.landing} element={<LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
