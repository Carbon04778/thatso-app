import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Main menu exactly as in WordPress ("main-menu"). Items without `to` are "#" links that only open a submenu.
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
  { label: 'Kabinenkosmetik -Professional' },
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
    children: [
      { label: 'Über uns', to: '/ueber-uns' },
      {
        label: 'Blog',
        children: [
          { label: 'Self Tan', to: '/self-tan-2' },
          { label: 'Spray Tan', to: '/spray-tan' },
          { label: 'Eye Revitalizer Smooth Effect', to: '/eye-revitiliser-smooth-effect' },
          { label: 'THAT’SO – FACE-UP BEAUTY FILTER', to: '/thatso-face-up-beauty-filter-medium-nude-thats-so' },
          { label: 'THAT’SO – FACE-UP BEAUTY FILTER 2', to: '/thatso-face-up-beauty-filter' },
        ],
      },
    ],
  },
];

// Current page path for menu highlighting. Search results live on /?s=… but are not the "Home" page.
function useCurrentPath() {
  const { pathname, search } = useLocation();
  return pathname === '/' && new URLSearchParams(search).get('s') ? '/?s' : pathname;
}

// SmartMenus timings used by Elementor's nav menu.
const SHOW_DELAY = 250;
const HIDE_DELAY = 500;
const FADE_OUT = 200;

function Caret({ dir = 'down' }) {
  return (
    <svg
      viewBox={dir === 'down' ? '0 0 320 512' : '0 0 192 512'}
      className={dir === 'down' ? 'w-[8px] h-[13px]' : 'w-[5px] h-[13px]'}
      fill="currentColor"
      aria-hidden="true"
    >
      {dir === 'down' ? (
        <path d="M31 192h258c18 0 27 22 14 34L174 355c-8 8-20 8-28 0L17 226c-13-12-4-34 14-34z" />
      ) : (
        <path d="M0 384.7V127.3c0-17.8 21.5-26.7 34.1-14.1l128.7 128.7c7.8 7.8 7.8 20.5 0 28.3L34.1 398.8C21.5 411.4 0 402.5 0 384.7z" />
      )}
    </svg>
  );
}

// Opens after SHOW_DELAY on hover, closes after HIDE_DELAY with a FADE_OUT fade (like SmartMenus).
function useHoverMenu() {
  const [state, setState] = useState('closed'); // closed | open | closing
  const timers = useRef([]);
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);
  const enter = () => {
    clear();
    if (state === 'open') return;
    if (state === 'closing') return setState('open');
    timers.current.push(setTimeout(() => setState('open'), SHOW_DELAY));
  };
  const leave = () => {
    clear();
    if (state === 'closed') return;
    timers.current.push(
      setTimeout(() => {
        setState('closing');
        timers.current.push(setTimeout(() => setState('closed'), FADE_OUT));
      }, HIDE_DELAY),
    );
  };
  return { state, enter, leave };
}

function DesktopSubItem({ item, pathname }) {
  const { state, enter, leave } = useHoverMenu();
  const ulRef = useRef(null);
  const [flip, setFlip] = useState(false);
  const open = state !== 'closed';

  // Nested submenus open to the right, or to the left when there is no room (SmartMenus behaviour).
  useLayoutEffect(() => {
    if (!open || !ulRef.current) return;
    const li = ulRef.current.parentElement.getBoundingClientRect();
    setFlip(li.right + ulRef.current.offsetWidth > document.documentElement.clientWidth);
  }, [open]);

  const active = item.to === pathname;
  const cls = `flex items-center whitespace-nowrap border-l-8 border-transparent px-5 py-[13px] text-[13px] leading-[20px] uppercase hover:text-[#f9f9f9] ${
    active || state === 'open' ? 'text-[#f9f9f9]' : 'text-[#6d6d6d]'
  }`;

  if (!item.children) {
    return (
      <li>
        <Link to={item.to} className={cls}>
          {item.label}
        </Link>
      </li>
    );
  }
  return (
    <li className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <a href="#" onClick={(e) => e.preventDefault()} className={cls}>
        {item.label}
        <span className="pl-[10px] flex">
          <Caret dir="right" />
        </span>
      </a>
      {open && (
        <ul
          ref={ulRef}
          className={`absolute top-0 min-w-[130px] bg-[#292929] transition-opacity duration-200 ${
            flip ? 'right-full' : 'left-full'
          } ${state === 'closing' ? 'opacity-0' : 'opacity-100'}`}
        >
          {item.children.map((c) => (
            <li key={c.to}>
              <Link
                to={c.to}
                className={`block whitespace-nowrap border-l-[16px] border-transparent px-5 py-[13px] text-[13px] leading-[20px] uppercase hover:text-[#f9f9f9] ${
                  c.to === pathname ? 'text-[#f9f9f9]' : 'text-[#6d6d6d]'
                }`}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function DesktopItem({ item }) {
  const pathname = useCurrentPath();
  const { state, enter, leave } = useHoverMenu();
  const active = item.to === pathname;
  const highlighted = active || state === 'open';
  return (
    <li className="relative" onMouseEnter={item.children ? enter : undefined} onMouseLeave={item.children ? leave : undefined}>
      <Link
        to={item.to || pathname}
        onClick={item.to ? undefined : (e) => e.preventDefault()}
        className={`px-5 leading-[53px] text-[13px] font-semibold uppercase hover:text-[#f9f9f9] flex items-center ${
          highlighted ? 'text-[#f9f9f9]' : 'text-[#6d6d6d]'
        }`}
      >
        {item.label}
        {item.children && (
          <span className="pl-[10px] flex">
            <Caret />
          </span>
        )}
      </Link>
      {item.children && state !== 'closed' && (
        <ul
          className={`absolute left-0 top-full z-50 min-w-[130px] bg-[#292929] transition-opacity duration-200 ${
            state === 'closing' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {item.children.map((c) => (
            <DesktopSubItem key={c.label} item={c} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  );
}

// Tablet/mobile dropdown item. First tap on an item with a submenu opens it; a second tap follows its link.
function MobileItem({ item, level, pathname, onNavigate }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const active = item.to === pathname;
  const top = level === 0;
  const onClick = (e) => {
    e.preventDefault();
    if (item.children && !open) return setOpen(true);
    if (item.children && !item.to) return setOpen(false);
    if (item.to) {
      navigate(item.to);
      onNavigate();
    }
  };
  return (
    <li>
      <a
        href={item.to || '#'}
        onClick={onClick}
        className={`flex items-center px-5 py-[10px] text-[13px] uppercase ${
          top ? 'leading-[53px]' : 'leading-[20px]'
        } ${level === 1 ? 'border-l-8 border-transparent' : ''} ${level === 2 ? 'border-l-[16px] border-transparent' : ''} ${
          active || open ? 'text-[#f9f9f9]' : 'text-[#6d6d6d]'
        } hover:text-[#f9f9f9]`}
      >
        {item.label}
        {item.children && (
          <span className="pl-[10px] flex">
            <Caret />
          </span>
        )}
      </a>
      {item.children && open && (
        <ul className="bg-[#292929]">
          {item.children.map((c) => (
            <MobileItem key={c.label} item={c} level={level + 1} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useCurrentPath();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="relative z-40 bg-[#292929] px-5 py-5 md:py-[30px] lg:p-0">
      <div className="min-h-[80px] flex items-center">
        {/* Logo column: 14.624% (50% on mobile), logo at 70% of the column, right-aligned */}
        <div className="w-1/2 md:w-[14.624%] flex justify-end">
          <Link to="/" className="block w-[70%]">
            <img src="/images/logo-light.png" alt="That'so" className="w-full h-auto" />
          </Link>
        </div>

        {/* Menu column: 85.042% (35% on mobile) */}
        <div className="w-[35%] md:w-[85.042%] flex items-center justify-end lg:justify-center">
          <nav className="hidden lg:block">
            <ul className="flex items-center">
              {NAV.map((item) => (
                <DesktopItem key={item.label} item={item} />
              ))}
            </ul>
          </nav>

          <button
            type="button"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-[37.5px] h-[37.5px] flex items-center justify-center text-[#f9f9f9]"
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="w-[25px] h-[25px]" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M4 4l16 16M20 4L4 20" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-[25px] h-[25px]" fill="currentColor">
                <rect x="1" y="4" width="22" height="2.4" />
                <rect x="1" y="10.8" width="22" height="2.4" />
                <rect x="1" y="17.6" width="22" height="2.4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Full-width dropdown (tablet/mobile): unfolds from the top in 0.3s */}
      <nav
        className={`lg:hidden absolute left-0 right-0 top-[114px] md:top-[134px] bg-[#292929] origin-top overflow-hidden transition-[max-height,transform] duration-300 ${
          open ? 'scale-y-100 max-h-[8120px]' : 'scale-y-0 max-h-0'
        }`}
        aria-hidden={!open}
      >
        <ul>
          {NAV.map((item) => (
            <MobileItem key={item.label} item={item} level={0} pathname={pathname} onNavigate={() => setOpen(false)} />
          ))}
        </ul>
      </nav>
    </header>
  );
}
