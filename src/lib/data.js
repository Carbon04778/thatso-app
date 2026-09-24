import products from '../data/gridProducts.json';

// Products in the exact order given (the live site's order), skipping unknown slugs.
export function getProductsBySlugs(slugs) {
  return slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean);
}
