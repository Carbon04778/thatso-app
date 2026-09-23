import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#292929] text-[#bbb] pt-16 pb-6">
      <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <img src="/images/logo-light.png" alt="That'so" className="h-12 w-auto mb-6" />
        </div>
        <div>
          <h4 className="text-white font-semibold tracking-wide mb-4">Kontakt</h4>
          <p>Terra Art GmbH</p>
          <p>Oststr. 87, 32051 Herford</p>
          <p>+49 (0) 5221 69498-0</p>
          <p>team@terraart.de</p>
        </div>
        <div>
          <h4 className="text-white font-semibold tracking-wide mb-4">Rechtliches</h4>
          <div className="flex flex-col gap-2">
            <Link to="/agb" className="hover:text-[#AC8542]">AGB</Link>
            <Link to="/datenschutz" className="hover:text-[#AC8542]">Datenschutz</Link>
            <Link to="/impressum" className="hover:text-[#AC8542]">Impressum</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold tracking-wide mb-4">Social Media</h4>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white text-[#292929] flex items-center justify-center"
            >
              f
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white text-[#292929] flex items-center justify-center"
            >
              ig
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-[1300px] mx-auto px-6 mt-12 pt-6 border-t border-white/10 text-sm text-[#888]">
        2026 © Copyright - That´so
      </div>
    </footer>
  );
}
