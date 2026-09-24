import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Elementor footer template (#105): boxed 1140px, four 25% columns (10px padding), 10px between widgets.

function ColumnHeading({ as: Tag = 'h2', children }) {
  return (
    <>
      <Tag className="text-center text-[12px] leading-[24px] font-bold text-[#f9f9f9]">{children}</Tag>
      {/* Divider widget: 1px line with 2px gap above and below */}
      <div className="py-[2px]">
        <span className="block border-t border-[#6d6d6d]" />
      </div>
    </>
  );
}

const LEGAL = [
  { label: 'AGB', to: '/agb' },
  { label: 'Datenschutz', to: '/datenschutz' },
  { label: 'Impressum', to: '/impressum' },
];

// Footer "Rechtliches" menu: a vertical list on desktop; on tablet/mobile Elementor turns it into
// a hamburger bar with a white dropdown that unfolds in 0.3s (the active page is highlighted).
function LegalMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <>
      <nav className="hidden lg:flex flex-col gap-[10px]">
        {LEGAL.map((l) => (
          <NavLink key={l.to} to={l.to} className={navClass}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="w-full h-[33px] flex items-center justify-center rounded-[3px] bg-black/5 text-[#494c4f]"
        >
          <span className="sr-only">Menü</span>
          {open ? (
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="currentColor">
              <rect x="2" y="5" width="20" height="2.2" />
              <rect x="2" y="10.9" width="20" height="2.2" />
              <rect x="2" y="16.8" width="20" height="2.2" />
            </svg>
          )}
        </button>
        <nav
          className={`mt-[10px] bg-white origin-top overflow-hidden transition-[max-height,transform] duration-300 ${
            open ? 'scale-y-100 max-h-[1000px]' : 'scale-y-0 max-h-0'
          }`}
          aria-hidden={!open}
        >
          {LEGAL.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block px-5 py-[10px] text-[13px] leading-[24px] hover:bg-[#55595c] hover:text-white ${
                  isActive ? 'bg-[#55595c] text-white' : 'text-[#494c4f]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

const textClass = 'text-[13px] leading-[24px] text-[#f9f9f9]';
const navClass = ({ isActive }) =>
  `block text-[13px] leading-[24px] transition-colors hover:text-[#6d6d6d] ${isActive ? 'text-[#6d6d6d]' : 'text-[#f9f9f9]'}`;

export default function Footer() {
  return (
    <footer className="bg-[#292929]">
      <div className="py-[50px]">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row">
          <div className="md:w-1/4 p-[10px] flex items-center justify-center">
            <img src="/images/logo-light.png" alt="That'so" className="max-w-full h-auto" />
          </div>
          <div className="md:w-1/4 p-[10px] flex flex-col gap-[10px]">
            <ColumnHeading as="h6">Kontakt</ColumnHeading>
            <ul className={textClass}>
              <li className="pb-[5px]">Terra Art GmbH</li>
              <li className="mt-[5px] pb-[5px]">Oststr. 87, 32051 Herford</li>
              <li className="mt-[5px] pb-[5px]">
                <a href="tel:+49 (0) 5221 – 6949820" className="inline-block">+49 (0) 5221 69498-0</a>
              </li>
              <li className="mt-[5px]">
                <a href="mailto:team@terraart.de" className="inline-block">team@terraart.de</a>
              </li>
            </ul>
          </div>
          <div className="md:w-1/4 p-[10px] flex flex-col gap-[10px]">
            <ColumnHeading>Rechtliches</ColumnHeading>
            <LegalMenu />
          </div>
          <div className="md:w-1/4 p-[10px] flex flex-col gap-[10px]">
            <ColumnHeading>Social Media</ColumnHeading>
            <div className="flex justify-center">
              <a
                href="https://de-de.facebook.com/pg/Terra-Art-GmbH-100458356688404/posts/?ref=page_internal"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-[50px] h-[50px] flex items-center justify-center bg-[#292929] text-[#f9f9f9] hover:opacity-90"
              >
                <span className="sr-only">Facebook</span>
                <svg viewBox="0 0 512 512" className="w-[25px] h-[25px]" fill="currentColor">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/terraart_gmbh/?hl=de"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-[50px] h-[50px] flex items-center justify-center bg-[#292929] text-[#f9f9f9] hover:opacity-90"
              >
                <span className="sr-only">Instagram</span>
                <svg viewBox="0 0 448 512" className="w-[22px] h-[25px]" fill="currentColor">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="py-[10px]">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row">
          <div className="md:w-1/2 p-[10px] text-[12px] leading-[24px] font-bold text-[#6d6d6d]">2026 © Copyright - That´so</div>
          {/* Second column only holds an empty heading/image in Elementor; it still adds its padding when stacked */}
          <div className="md:w-1/2 p-[10px]" />
        </div>
      </div>
    </footer>
  );
}
