import { useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ProductGrid from '../components/ProductGrid';
import { getProductsBySlugs } from '../lib/data';
import { GRID_PAGES } from '../data/gridPages';

export default function CategoryPage() {
  const { pathname } = useLocation();
  const page = GRID_PAGES[pathname.replace(/^\//, '')];
  if (!page) return null;

  return (
    <div>
      <PageHero title={page.title} images={page.banner} />
      <ProductGrid products={getProductsBySlugs(page.products)} />
    </div>
  );
}
