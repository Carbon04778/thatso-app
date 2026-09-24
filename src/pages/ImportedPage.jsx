import { useLocation } from 'react-router-dom';
import WpPage from '../components/WpPage';
import manifest from '../wp/pages/manifest.json';

// Pages rendered from the exact Elementor HTML of the live site (see scripts/fetch-wp-pages.cjs).
const files = import.meta.glob('../wp/pages/*.html', { query: '?raw', import: 'default', eager: true });

export default function ImportedPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/|\/$/g, '');
  const entry = manifest[slug];
  const html = entry && files[`../wp/pages/${entry.file}`];
  if (!html) return null;
  return <WpPage html={html} bodyClass={`elementor-page-${entry.postId}`} />;
}
