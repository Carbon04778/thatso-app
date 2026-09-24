import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import manifest from '../wp/pages/manifest.json';

// Applies the live page's <title>, Yoast SEO meta tags (description / Open Graph / Twitter) and canonical link.
// The data comes from scripts/fetch-wp-pages.cjs (manifest.json). Search pages set their own title.
// WordPress matches page slugs case-insensitively.
export const manifestKey = (pathname) => decodeURIComponent(pathname).toLowerCase().replace(/^\/|\/$/g, '') || 'home';

export default function RouteMeta() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (new URLSearchParams(search).get('s') || pathname.startsWith('/page/')) return;
    const entry = manifest[manifestKey(pathname)];
    if (!entry) return;
    document.title = entry.title;
    document.head.querySelectorAll('meta[data-wp-meta]').forEach((m) => m.remove());
    (entry.meta || []).forEach(({ attr, key, content }) => {
      const m = document.createElement('meta');
      m.setAttribute(attr, key);
      m.setAttribute('content', content);
      m.setAttribute('data-wp-meta', '');
      document.head.appendChild(m);
    });
    let link = document.head.querySelector('link[rel="canonical"]');
    if (entry.canonical) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = entry.canonical;
    } else link?.remove();
  }, [pathname, search]);

  return null;
}
