import { useEffect } from 'react';
import { analyticsConfig } from '@/config/site';

/**
 * Подключает GA4 и Meta Pixel — но ТОЛЬКО если ID заданы в .env.
 * Пустой ID = ни одного внешнего скрипта на странице.
 */
export function Analytics() {
  useEffect(() => {
    const { gaMeasurementId } = analyticsConfig;
    if (!gaMeasurementId) return;
    if (document.getElementById('ga4-loader')) return;

    const loader = document.createElement('script');
    loader.id = 'ga4-loader';
    loader.async = true;
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(loader);

    const inline = document.createElement('script');
    inline.id = 'ga4-init';
    inline.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaMeasurementId}');
    `;
    document.head.appendChild(inline);
  }, []);

  useEffect(() => {
    const { metaPixelId } = analyticsConfig;
    if (!metaPixelId) return;
    if (document.getElementById('meta-pixel')) return;

    const script = document.createElement('script');
    script.id = 'meta-pixel';
    script.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }, []);

  return null;
}

/** Отправка кастомного события в подключённые системы (если они есть). */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  w.gtag?.('event', name, params ?? {});
  w.fbq?.('trackCustom', name, params ?? {});
}
