import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import WpPage from '../components/WpPage';
import manifest from '../wp/pages/manifest.json';
import NotFound from './NotFound';
import { manifestKey } from '../components/RouteMeta';

// Pages rendered from the exact Elementor HTML of the live site (see scripts/fetch-wp-pages.cjs).
// Each page's HTML is its own chunk, loaded when the page is opened.
const files = import.meta.glob('../wp/pages/*.html', { query: '?raw', import: 'default' });

export default function ImportedPage() {
  const { pathname } = useLocation();
  const entry = manifest[manifestKey(pathname)];
  const load = entry?.file && files[`../wp/pages/${entry.file}`];
  const [page, setPage] = useState({ file: null, html: null });

  useEffect(() => {
    let cancelled = false;
    if (load) load().then((html) => !cancelled && setPage({ file: entry.file, html }));
    return () => {
      cancelled = true;
    };
  }, [load, entry?.file]);

  if (!load) return <NotFound />;
  // keep the space while the chunk loads so the footer doesn't jump up
  if (page.file !== entry.file) return <div className="min-h-screen" />;
  return <WpPage html={page.html} bodyClass={`elementor-page-${entry.postId}`} share={entry.share} />;
}
