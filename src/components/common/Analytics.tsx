import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsConfig } from '@/config/site';

/**
 * Подключает GA4 и Meta Pixel — но ТОЛЬКО если ID заданы в .env.
 * Пустой ID = ни одного внешнего скрипта на странице.
 */
export function Analytics() {
  const { pathname } = useLocation();
  // Путь, для которого PageView уже отправлен. Стартовый PageView шлёт сам
  // инлайн-сниппет пикселя, поэтому первый маршрут здесь считается учтённым.
  const trackedPath = useRef(pathname);

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
    // Несколько пикселей задаются через запятую: VITE_META_PIXEL_ID=111,222
    const pixelIds = metaPixelId.split(',').map((id) => id.trim()).filter(Boolean);
    if (pixelIds.length === 0) return;
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
      ${pixelIds.map((id) => `fbq('init', '${id}');`).join('\n      ')}
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }, []);

  /**
   * Переходы между /preland и /landing происходят внутри роутера, без перезагрузки
   * страницы, поэтому инлайн-сниппет отработает PageView только один раз.
   * Досылаем PageView вручную на каждую последующую смену маршрута.
   */
  useEffect(() => {
    if (trackedPath.current === pathname) return;
    trackedPath.current = pathname;

    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };
    w.fbq?.('track', 'PageView');
    w.gtag?.('event', 'page_view', { page_path: pathname });
  }, [pathname]);

  return null;
}

/**
 * Стандартные события Meta: их нужно слать через fbq('track', …), иначе
 * в Ads Manager они попадут в кастомные и не будут доступны как конверсии.
 */
const metaStandardEvents = new Set([
  'PageView',
  'Lead',
  'CompleteRegistration',
  'Contact',
  'SubmitApplication',
  'Schedule',
  'ViewContent',
  'Search',
  'InitiateCheckout',
  'Purchase',
  'Subscribe',
  'StartTrial',
]);

/** Отправка события в подключённые системы (если они есть). */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  w.gtag?.('event', name, params ?? {});
  w.fbq?.(metaStandardEvents.has(name) ? 'track' : 'trackCustom', name, params ?? {});
}
