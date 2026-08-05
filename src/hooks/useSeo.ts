import { useEffect } from 'react';

export interface SeoOptions {
  title: string;
  description: string;
  ogImage?: string;
  canonicalPath?: string;
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/** Проставляет title, description, Open Graph и canonical для текущей страницы. */
export function useSeo({ title, description, ogImage, canonicalPath }: SeoOptions): void {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    const origin = window.location.origin;

    if (ogImage) {
      const absolute = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`;
      setMeta('meta[property="og:image"]', 'property', 'og:image', absolute);
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absolute);
    }

    if (canonicalPath) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = `${origin}${canonicalPath}`;
      setMeta('meta[property="og:url"]', 'property', 'og:url', link.href);
    }
  }, [title, description, ogImage, canonicalPath]);
}
