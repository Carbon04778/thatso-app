import ProductCard from './ProductCard';
import { GRID_IMAGES } from '../data/gridPages';

// Elementor posts widget (custom skin): boxed 1140px section, 10px column padding,
// 4 columns (2 tablet, 1 mobile) with a 30px column gap and 35px row gap; each item has 10px padding.
export default function ProductGrid({ products }) {
  return (
    <section className="max-w-[1140px] mx-auto my-[100px] p-[10px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[30px] gap-y-[35px]">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} image={GRID_IMAGES[p.slug] || { src: p.featured_image }} />
        ))}
      </div>
    </section>
  );
}
