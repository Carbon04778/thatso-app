import { Link } from 'react-router-dom';

function ColumnHeading({ children }) {
  return (
    <>
      <h2 className="text-center text-[12px] leading-[24px] font-bold text-[#f9f9f9]">{children}</h2>
      <span className="block mt-3 mb-3 border-t border-[#6d6d6d]" />
    </>
  );
}

const linkClass = 'block text-[13px] leading-[24px] text-[#f9f9f9] hover:text-brand transition-colors';

export default function Footer() {
  return (
    <footer className="bg-[#292929]">
      <div className="max-w-[1120px] mx-auto px-6 md:px-0 pt-[58px] pb-[40px] grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-5">
        <div className="flex justify-center md:pt-[55px]">
          <img src="/images/logo-light.png" alt="That'so" className="w-[265px] max-w-full h-auto" />
        </div>
        <div>
          <ColumnHeading>Kontakt</ColumnHeading>
          <ul className="space-y-[10px] text-[13px] leading-[24px] text-[#f9f9f9]">
            <li>Terra Art GmbH</li>
            <li>Oststr. 87, 32051 Herford</li>
            <li>
              <a href="tel:+495221694980" className={linkClass}>+49 (0) 5221 69498-0</a>
            </li>
            <li>
              <a href="mailto:team@terraart.de" className={linkClass}>team@terraart.de</a>
            </li>
          </ul>
        </div>
        <div>
          <ColumnHeading>Rechtliches</ColumnHeading>
          <div className="space-y-[10px]">
            <Link to="/agb" className={linkClass}>AGB</Link>
            <Link to="/datenschutz" className={linkClass}>Datenschutz</Link>
            <Link to="/impressum" className={linkClass}>Impressum</Link>
          </div>
        </div>
        <div>
          <ColumnHeading>Social Media</ColumnHeading>
          <div className="flex justify-center">
            <a
              href="https://de-de.facebook.com/pg/Terra-Art-GmbH-100458356688404/posts/?ref=page_internal"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-[50px] h-[50px] flex items-center justify-center text-[#f9f9f9] hover:text-brand"
            >
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
                <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/terraart_gmbh/?hl=de"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-[50px] h-[50px] flex items-center justify-center text-[#f9f9f9] hover:text-brand"
            >
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-[1120px] mx-auto px-6 md:px-0 h-[64px] flex items-center text-[12px] text-[#6d6d6d]">
        2026 © Copyright - That´so
      </div>
    </footer>
  );
}
