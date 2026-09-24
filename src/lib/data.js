import products from '../data/products.json';
import pages from '../data/pages.json';

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryName) {
  return products.filter((p) => p.categories.includes(categoryName));
}

export function getPageBySlug(slug) {
  return pages.find((p) => p.slug === slug);
}

// Products in the exact order given (the live site's order), skipping unknown slugs.
export function getProductsBySlugs(slugs) {
  return slugs.map((s) => getProductBySlug(s)).filter(Boolean);
}
