import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Kontakt from './pages/Kontakt';
import LegalPage from './pages/LegalPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/self-tan" element={<CategoryPage />} />
            <Route path="/sun-care" element={<CategoryPage />} />
            <Route path="/self-care" element={<CategoryPage />} />
            <Route path="/professional" element={<CategoryPage />} />
            <Route path="/beauty-espresso" element={<CategoryPage />} />
            <Route path="/geraete" element={<LegalPage />} />
            <Route path="/face-up" element={<LegalPage />} />
            <Route path="/body-up" element={<LegalPage />} />
            <Route path="/sonnenschutz" element={<LegalPage />} />
            <Route path="/anti-aging" element={<LegalPage />} />
            <Route path="/braeunungsspray" element={<LegalPage />} />
            <Route path="/impressum" element={<LegalPage />} />
            <Route path="/datenschutz" element={<LegalPage />} />
            <Route path="/agb" element={<LegalPage />} />
            <Route path="/widerrufsrecht" element={<LegalPage />} />
            <Route path="/versand-und-zahlungsinformationen" element={<LegalPage />} />
            <Route path="/ueber-uns" element={<LegalPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
