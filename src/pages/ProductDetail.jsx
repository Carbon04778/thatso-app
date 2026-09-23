import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../lib/data';
import FormattedText from '../components/FormattedText';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const [imgIndex, setImgIndex] = useState(0);

  if (!product) {
    return <div className="max-w-[900px] mx-auto px-6 py-24">Produkt nicht gefunden.</div>;
  }

  const images = product.images.length ? product.images : [product.featured_image].filter(Boolean);

  return (
    <div>
      <div
        className="relative flex items-center min-h-[220px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(180,180,180,.7),rgba(180,180,180,.7)), url(${
            product.featured_image || ''
          })`,
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white px-6 md:px-16 max-w-[1300px] mx-auto w-full">
          {product.title}
        </h1>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 py-14 grid md:grid-cols-[220px_1fr_320px] gap-10">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="font-semibold text-sm uppercase tracking-wide">That'so | Products</div>
          <nav className="flex flex-col gap-3 text-sm text-gray-600">
            <Link to="/self-tan" className="hover:text-[#AC8542]">Self Tan</Link>
            <Link to="/sun-care" className="hover:text-[#AC8542]">Sun Care</Link>
            <Link to="/self-care" className="hover:text-[#AC8542]">Self Care</Link>
            <Link to="/professional" className="hover:text-[#AC8542]">Professional</Link>
          </nav>
        </aside>

        {/* Image carousel */}
        <div className="flex items-center justify-center bg-white">
          {images.length > 0 && (
            <div className="relative w-full max-w-[360px]">
              <img src={images[imgIndex]} alt={product.title} className="w-full object-contain" />
              {images.length > 1 && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    className="text-gray-500 hover:text-[#AC8542]"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    className="text-gray-500 hover:text-[#AC8542]"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Title / CTA / meta */}
        <div>
          <h2 className="text-2xl font-bold border-b-2 border-[#AC8542] inline-block pb-2 mb-6">
            {product.title}
          </h2>
          <Link
            to="/kontakt"
            className="inline-block bg-[#AC8542] text-white px-8 py-3 uppercase tracking-wide font-semibold hover:bg-[#8f6d35] transition-colors mb-8"
          >
            Jetzt Anfragen
          </Link>
          <p className="text-sm text-gray-500 mb-1">Kategorie:</p>
          <p className="font-semibold mb-8">{product.categories.join(', ') || '—'}</p>
          <p className="text-sm text-gray-500 mb-3">Diesen Artikel teilen:</p>
          <div className="flex gap-3">
            {['f', 't', 'in', 'p', 'w'].map((s) => (
              <span
                key={s}
                className="w-9 h-9 rounded flex items-center justify-center bg-gray-200 text-gray-600 text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 pb-20 grid md:grid-cols-[220px_1fr] gap-10">
        <div />
        <div>
          {product.description && (
            <>
              <h2 className="text-2xl font-semibold border-b-2 border-[#AC8542] inline-block pb-2 mb-6">
                Beschreibung
              </h2>
              <FormattedText text={product.description} />
            </>
          )}
          {product.usage && (
            <>
              <h3 className="text-xl font-semibold mb-4 mt-8">Anwendung</h3>
              <FormattedText text={product.usage} />
            </>
          )}
          {product.info && (
            <>
              <h2 className="text-2xl font-semibold mb-4 mt-8">Info</h2>
              <FormattedText text={product.info} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
