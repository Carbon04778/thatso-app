import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import CategoryPage from './pages/CategoryPage';
import BeautyEspresso from './pages/BeautyEspresso';
import ImportedPage from './pages/ImportedPage';
import SearchPage from './pages/SearchPage';
import RouteMeta from './components/RouteMeta';
import NotFound from './pages/NotFound';

// WordPress serves search results on the front page URL (/?s=term, /page/2?s=term).
function HomeOrSearch() {
  const { search } = useLocation();
  return new URLSearchParams(search).get('s') ? <SearchPage /> : <ImportedPage />;
}

// WordPress redirects "/page/" to "/page" (301).
function TrailingSlash() {
  const { pathname, search } = useLocation();
  return pathname.length > 1 && pathname.endsWith('/') ? <Navigate replace to={pathname.replace(/\/+$/, '') + search} /> : null;
}

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
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
      <RouteMeta />
      <TrailingSlash />
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomeOrSearch />} />
            <Route path="/page/:page" element={<SearchPage />} />
            <Route path="/produkt/:slug" element={<ImportedPage />} />
            <Route path="/beauty-espresso" element={<BeautyEspresso />} />
            {GRID.map((p) => (
              <Route key={p} path={p} element={<CategoryPage />} />
            ))}
            {IMPORTED.map((p) => (
              <Route key={p} path={p} element={<ImportedPage />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Lightbox />
    </BrowserRouter>
  );
}
