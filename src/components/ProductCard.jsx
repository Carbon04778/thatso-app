import { Link } from 'react-router-dom';

// Elementor "custom skin" product loop item: rounded image that grows on hover (0.3s),
// bold 12px title below.
export default function ProductCard({ product, image = { src: product.featured_image } }) {
  const to = `/produkt/${product.slug}`;
  return (
    <div className="p-[10px]">
      <Link to={to} className="block">
        {image.src && (
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            width={image.width}
            height={image.height}
            alt={product.title}
            className="w-full h-auto rounded-[3px] transition-transform duration-300 hover:scale-110"
          />
        )}
      </Link>
      <h3 className="mt-5 text-center text-[12px] leading-[24px] font-bold text-[#292929]">
        <Link to={to}>{product.title}</Link>
      </h3>
    </div>
  );
}
