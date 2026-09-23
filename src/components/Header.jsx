import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Geräte', to: '/geraete' },
  {
    label: 'Homekosmetik',
    children: [
      { label: 'Self Tan', to: '/self-tan' },
      { label: 'Self Care', to: '/self-care' },
      { label: 'Sun Care', to: '/sun-care' },
      { label: 'FACE-UP', to: '/face-up' },
      { label: 'BODY-UP', to: '/body-up' },
    ],
  },
  { label: 'Kabinenkosmetik -Professional', to: '/professional' },
  { label: 'Beauty Espresso', to: '/beauty-espresso' },
  { label: 'Professional', to: '/professional' },
  {
    label: 'Beautylinie',
    children: [
      { label: 'Bräunungsspray', to: '/braeunungsspray' },
      { label: 'Anti-Aging', to: '/anti-aging' },
      { label: 'Sonnenschutz', to: '/sonnenschutz' },
    ],
  },
  {
    label: 'Kontakt',
    to: '/kontakt',
    children: [{ label: 'Über uns', to: '/ueber-uns' }],
  },
];

function DesktopItem({ item }) {
  const [hover, setHover] = useState(false);
  const { pathname } = useLocation();
  const active = item.to === pathname || item.children?.some((c) => c.to === pathname);
  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link
        to={item.to || '#'}
        className={`px-5 leading-[53px] text-[13px] font-semibold uppercase hover:text-[#f9f9f9] transition-colors flex items-center gap-1 ${
          active ? 'text-[#f9f9f9]' : 'text-[#6d6d6d]'
        }`}
      >
        {item.label}
        {item.children && <span className="text-[10px]">▾</span>}
      </Link>
      {item.children && hover && (
        <div className="absolute left-0 top-full min-w-[200px] z-50">
          <div className="bg-[#292929] shadow-lg py-2">
            {item.children.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="block px-4 py-2 text-[13px] uppercase text-[#ddd] hover:text-brand hover:bg-black/20"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-[#292929] relative z-40">
        <div className="h-[80px] flex items-center justify-between pl-6 lg:pl-[63px] pr-6 lg:pr-5">
          <Link to="/">
            <img src="/images/logo-light.png" alt="That'so" className="w-[147px] h-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center">
            {NAV.map((item) => (
              <DesktopItem key={item.label} item={item} />
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Menu"
            onClick={() => setOpen(true)}
            className="lg:hidden text-white flex flex-col gap-1.5 w-7"
          >
            <span className="block h-0.5 bg-white" />
            <span className="block h-0.5 bg-white" />
            <span className="block h-0.5 bg-white" />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 bg-[#292929] z-50 overflow-y-auto lg:hidden">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
            <Link to="/" onClick={() => setOpen(false)}>
              <img src="/images/logo-light.png" alt="That'so" className="h-9 w-auto" />
            </Link>
            <button aria-label="Close" onClick={() => setOpen(false)} className="text-white text-3xl leading-none">
              &times;
            </button>
          </div>
          <nav className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col gap-6 text-[#bbb] uppercase tracking-wide">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link to={item.to || '#'} onClick={() => setOpen(false)} className="text-lg hover:text-brand">
                  {item.label}
                </Link>
                {item.children && (
                  <div className="flex flex-col gap-3 mt-3 pl-4 normal-case">
                    {item.children.map((c) => (
                      <Link key={c.to} to={c.to} onClick={() => setOpen(false)} className="hover:text-brand">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
