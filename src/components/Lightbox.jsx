import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Elementor Pro lightbox, rebuilt with Elementor's own markup/classes so its stylesheet styles it exactly:
// zoomIn opening animation, looping slide transition (0.3s, 100px gap), counter, share/zoom/fullscreen
// toolbar, title footer, Esc/arrow keys and swipe. Opened with openLightbox(slides, index).

const listeners = new Set();
export function openLightbox(slides, index = 0) {
  listeners.forEach((fn) => fn({ slides, index }));
}

// The lightbox is appended to <body> on WordPress, so it uses the Hello theme's body font.
const BODY_FONT =
  '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';

const GAP = 100;
const SPEED = 300;

function shareLinks(slide) {
  const pageUrl = window.location.origin + window.location.pathname + (slide.hash || '');
  const u = encodeURIComponent(pageUrl);
  const media = encodeURIComponent(slide.src);
  return [
    { href: `https://www.facebook.com/sharer.php?u=${u}`, icon: 'eicon-facebook', label: 'Auf Facebook teilen' },
    { href: `https://twitter.com/intent/tweet?text= ${u}`, icon: 'eicon-twitter', label: 'Auf Twitter teilen' },
    { href: `https://www.pinterest.com/pin/create/button/?url=&media=${media}`, icon: 'eicon-pinterest', label: 'Anheften' },
  ];
}

export default function Lightbox() {
  const [state, setState] = useState(null); // { slides, index }
  const [pos, setPos] = useState(1); // position in the looped track (0 and n+1 are clones)
  const [animate, setAnimate] = useState(false);
  const [mode, setMode] = useState({ share: false, zoom: false, full: false });
  const [width, setWidth] = useState(() => window.innerWidth);
  const rootRef = useRef(null);
  const drag = useRef(null);
  const [dragX, setDragX] = useState(0);

  useEffect(() => {
    const open = (s) => {
      setState(s);
      setPos(s.index + 1);
      setAnimate(false);
      setMode({ share: false, zoom: false, full: false });
    };
    listeners.add(open);
    return () => listeners.delete(open);
  }, []);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setState(null);
  }, []);

  const go = useCallback((d) => {
    setMode((m) => ({ ...m, share: false, zoom: false }));
    setAnimate(true);
    setPos((p) => p + d);
  }, []);

  useEffect(() => {
    if (!state) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    const onFs = () => setMode((m) => ({ ...m, full: !!document.fullscreenElement }));
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, [state, close, go]);

  if (!state) return null;
  const { slides } = state;
  const n = slides.length;
  const track = n > 1 ? [slides[n - 1], ...slides, slides[0]] : slides;
  const offset = n > 1 ? pos : 0;
  const current = n > 1 ? (((pos - 1) % n) + n) % n : 0;
  const slide = slides[current];

  // After animating onto a clone, jump (without animation) to the real slide.
  const onTransitionEnd = () => {
    if (pos === 0 || pos === n + 1) {
      setAnimate(false);
      setPos(pos === 0 ? n : 1);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else rootRef.current?.requestFullscreen?.().catch(() => {});
  };

  const onPointerDown = (e) => {
    if (n < 2 || mode.zoom || e.target.closest('.elementor-lightbox-prevent-close:not(.swiper-zoom-container):not(.elementor-lightbox-image)')) return;
    drag.current = { x: e.clientX, moved: false };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    setAnimate(false);
    setDragX(dx);
  };
  const onPointerUp = (e) => {
    if (!drag.current) return;
    const { moved } = drag.current;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    setDragX(0);
    if (moved && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    else {
      setAnimate(true);
      // A plain click outside the image/controls closes the lightbox (Elementor behaviour).
      if (!moved && !e.target.closest('.elementor-lightbox-prevent-close')) close();
    }
  };

  const swiperClass = [
    'swiper-container swiper-container-initialized swiper-container-horizontal',
    mode.share && 'elementor-slideshow--share-mode',
    mode.zoom && 'elementor-slideshow--zoom-mode',
    mode.full && 'elementor-slideshow--fullscreen-mode',
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <div
      ref={rootRef}
      className="dialog-widget dialog-lightbox-widget dialog-type-buttons dialog-type-lightbox elementor-lightbox"
      style={{ display: 'block', fontFamily: BODY_FONT, lineHeight: 1.5, color: '#333' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="dialog-widget-content dialog-lightbox-widget-content elementor-aspect-ratio-169" style={{ top: 0, left: 0 }}>
        <div tabIndex={0} role="button" aria-label="Schließen (Esc)" className="dialog-close-button dialog-lightbox-close-button" onClick={close}>
          <i className="eicon-close" />
        </div>
        <div className="dialog-header dialog-lightbox-header" />
        <div className="dialog-message dialog-lightbox-message animated zoomIn">
          <div
            className={swiperClass}
            style={{ cursor: n > 1 ? 'grab' : undefined, touchAction: 'pan-y' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <header className="elementor-slideshow__header elementor-lightbox-prevent-close">
              <i
                className="eicon-share-arrow"
                role="button"
                aria-label="Teilen"
                aria-expanded={mode.share}
                tabIndex={0}
                onClick={() => setMode((m) => ({ ...m, share: !m.share }))}
              >
                <span />
              </i>
              <div className="elementor-slideshow__share-menu">
                {mode.share ? (
                  <div className="elementor-slideshow__share-links">
                    {shareLinks(slide).map((l) => (
                      <a key={l.icon} href={l.href} target="_blank" rel="noreferrer">
                        <i className={l.icon} />
                        {l.label}
                      </a>
                    ))}
                    <a href={slide.src} download="">
                      <i className="eicon-download-bold" aria-label="Download" />
                      Bild downloaden
                    </a>
                  </div>
                ) : (
                  <div />
                )}
              </div>
              <i
                role="switch"
                aria-checked={mode.zoom}
                aria-label="Zoom"
                className={mode.zoom ? 'eicon-zoom-out-bold' : 'eicon-zoom-in-bold'}
                onClick={() => setMode((m) => ({ ...m, zoom: !m.zoom, share: false }))}
              />
              <i
                role="switch"
                aria-checked={mode.full}
                aria-label="Vollbild"
                className={mode.full ? 'eicon-frame-minimize' : 'eicon-frame-expand'}
                onClick={toggleFullscreen}
              >
                <span />
                <span />
              </i>
              {n > 1 && (
                <span className="elementor-slideshow__counter swiper-pagination-fraction">
                  <span className="swiper-pagination-current">{current + 1}</span> /{' '}
                  <span className="swiper-pagination-total">{n}</span>
                </span>
              )}
            </header>
            <div
              className="swiper-wrapper"
              onTransitionEnd={onTransitionEnd}
              style={{
                transitionDuration: `${animate ? SPEED : 0}ms`,
                transform: `translate3d(${-offset * (width + GAP) + dragX}px, 0px, 0px)`,
              }}
            >
              {track.map((s, i) => (
                <div
                  key={`${i}-${s.src}`}
                  className={`swiper-slide elementor-lightbox-item${i === offset ? ' swiper-slide-active' : ''}`}
                  style={{ width: `${width}px`, marginRight: `${GAP}px` }}
                >
                  <div
                    className="swiper-zoom-container"
                    style={{ transform: i === offset && mode.zoom ? 'scale(3)' : 'none', transitionDuration: '300ms' }}
                  >
                    <img
                      className="elementor-lightbox-image elementor-lightbox-prevent-close swiper-lazy swiper-lazy-loaded"
                      data-title={s.title}
                      alt={s.title}
                      src={s.src}
                      draggable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
            {n > 1 && (
              <>
                <div
                  className="elementor-swiper-button elementor-swiper-button-next elementor-lightbox-prevent-close"
                  aria-label="Next slide"
                  tabIndex={0}
                  role="button"
                  onClick={() => go(1)}
                >
                  <i className="eicon-chevron-right" />
                </div>
                <div
                  className="elementor-swiper-button elementor-swiper-button-prev elementor-lightbox-prevent-close"
                  aria-label="Previous slide"
                  tabIndex={0}
                  role="button"
                  onClick={() => go(-1)}
                >
                  <i className="eicon-chevron-left" />
                </div>
              </>
            )}
            <footer className="elementor-slideshow__footer elementor-lightbox-prevent-close">
              <div className="elementor-slideshow__title">{slide.title}</div>
              <div className="elementor-slideshow__description" />
            </footer>
          </div>
        </div>
        <div className="dialog-buttons-wrapper dialog-lightbox-buttons-wrapper" />
      </div>
    </div>,
    document.body,
  );
}
