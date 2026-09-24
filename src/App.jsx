import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import BeautyEspresso from './pages/BeautyEspresso';
import ImportedPage from './pages/ImportedPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Product-grid pages (built in React from the product data).
const GRID = ['/geraete', '/self-tan', '/self-care', '/sun-care', '/face-up', '/body-up', '/professional'];

// Pages rendered from the live site's exact Elementor HTML.
const IMPORTED = [
  '/braeunungsspray',
  '/anti-aging',
  '/sonnenschutz',
  '/kontakt',
  '/ueber-uns',
  '/mediengalerie',
  '/video',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/widerrufsrecht',
  '/versand-und-zahlungsinformationen',
  '/spray-tan',
  '/self-tan-2',
  '/eye-revitiliser-smooth-effect',
  '/thatso-face-up-beauty-filter-medium-nude-thats-so',
  '/thatso-face-up-beauty-filter',
  '/uv-freie-braeune',
  '/face-up-beauty-filter-thatso',
  '/del',
];

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produkt/:slug" element={<ProductDetail />} />
            <Route path="/beauty-espresso" element={<BeautyEspresso />} />
            {GRID.map((p) => (
              <Route key={p} path={p} element={<CategoryPage />} />
            ))}
            {IMPORTED.map((p) => (
              <Route key={p} path={p} element={<ImportedPage />} />
            ))}
          </Routes>
        </main>
        <Footer />
      </div>
      <Lightbox />
    </BrowserRouter>
  );
}
