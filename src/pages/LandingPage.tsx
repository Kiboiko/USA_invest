import { landingSeo } from '@/data/landing';
import { useSeo } from '@/hooks/useSeo';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Hero } from '@/components/landing/Hero';
import { HighlightBand } from '@/components/landing/HighlightBand';
import { About } from '@/components/landing/About';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Priorities } from '@/components/landing/Priorities';
import { Testimonials } from '@/components/landing/Testimonials';
import { Faq } from '@/components/landing/Faq';
import { FinalCta } from '@/components/landing/FinalCta';
import { LandingFooter } from '@/components/landing/LandingFooter';

/**
 * LANDING — основная страница финансового сервиса.
 * Порядок секций соответствует референсам.
 */
export default function LandingPage() {
  useSeo(landingSeo);

  return (
    <div className="min-h-screen bg-ink-900 text-fg">
      <a href="#lead-form" className="skip-link">
        Skip to the form
      </a>

      <div className="mx-auto max-w-[1240px] px-2 sm:px-4">
        <LandingHeader />

        <main className="space-y-4 pb-6 sm:space-y-6">
          <Hero />
          <HighlightBand />
          <About />
          <HowItWorks />
          <Priorities />
          <Testimonials />
          <Faq />
          <FinalCta />
        </main>
      </div>

      <LandingFooter />
    </div>
  );
}
