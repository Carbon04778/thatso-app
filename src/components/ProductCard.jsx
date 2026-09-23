import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/produkt/${product.slug}`} className="block group">
      <div className="aspect-square bg-[#efe6da] flex items-center justify-center overflow-hidden">
        {product.featured_image && (
          <img
            src={product.featured_image}
            alt={product.title}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <p className="text-center mt-4 font-semibold text-[15px]">{product.title}</p>
    </Link>
  );
}
