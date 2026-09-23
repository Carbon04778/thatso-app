import { useLocation } from 'react-router-dom';
import { getProductsByCategory, getPageBySlug } from '../lib/data';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';

const CATEGORY_BY_SLUG = {
  'self-tan': 'SELF-TAN',
  'sun-care': 'SUN-CARE',
  'self-care': 'SELF-CARE',
  professional: 'PROFESSIONAL',
  'beauty-espresso': 'Equipment',
};

const TITLE_BY_SLUG = {
  'self-tan': 'Self Tan',
  'sun-care': 'Sun Care',
  'self-care': 'Self Care',
  professional: 'Professional',
  'beauty-espresso': 'Beauty Espresso',
};

export default function CategoryPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const page = getPageBySlug(slug);
  const categoryKey = CATEGORY_BY_SLUG[slug];
  const products = categoryKey ? getProductsByCategory(categoryKey) : [];
  const title = TITLE_BY_SLUG[slug] || page?.title || slug;

  return (
    <div>
      <PageHero title={title} image={page?.featured_image} />
      <div className="max-w-[1300px] mx-auto px-6 py-16">
        {products.length === 0 ? (
          <p className="text-gray-500">Keine Produkte in dieser Kategorie gefunden.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
