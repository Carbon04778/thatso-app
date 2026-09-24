import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../wp/wp.css';
import { openLightbox } from './Lightbox';
import { initForms } from './wpForms';

// Renders a page's exact Elementor HTML (saved by scripts/fetch-wp-pages.cjs) and re-creates the bits
// Elementor normally does in JavaScript: background slideshows, YouTube embeds, entrance animations,
// the lightbox and client-side navigation for internal links.

const settingsOf = (el) => {
  try {
    return JSON.parse(el.getAttribute('data-settings') || '{}');
  } catch {
    return {};
  }
};

function initSlideshows(root, timers) {
  root.querySelectorAll('[data-settings*="background_slideshow_gallery"]').forEach((el) => {
    if (el.querySelector(':scope > .elementor-background-slideshow')) return;
    const s = settingsOf(el);
    const gallery = s.background_slideshow_gallery || [];
    if (!gallery.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'elementor-background-slideshow';
    Object.assign(wrap.style, { position: 'absolute', inset: '0', overflow: 'hidden', zIndex: '0' });
    const slides = gallery.map((g, i) => {
      const slide = document.createElement('div');
      slide.className = 'elementor-background-slideshow__slide__image';
      Object.assign(slide.style, {
        position: 'absolute',
        inset: '0',
        // size/position come from Elementor's per-page CSS (like on the live site)
        backgroundImage: `url("${g.url}")`,
        opacity: i === 0 ? '1' : '0',
        transition: `opacity ${s.background_slideshow_transition_duration || 500}ms`,
      });
      wrap.appendChild(slide);
      return slide;
    });
    el.insertBefore(wrap, el.firstChild);
    if (slides.length > 1) {
      let i = 0;
      timers.push(
        setInterval(() => {
          slides[i].style.opacity = '0';
          i = (i + 1) % slides.length;
          slides[i].style.opacity = '1';
        }, s.background_slideshow_slide_duration || 5000),
      );
    }
  });
}

function youtubeId(url = '') {
  return /(?:youtu\.be\/|v=|embed\/)([\w-]{11})/.exec(url)?.[1];
}

function initVideos(root) {
  root.querySelectorAll('.elementor-widget-video').forEach((w) => {
    const s = settingsOf(w);
    const target = w.querySelector('.elementor-video');
    if (!target || target.querySelector('iframe') || (s.video_type && s.video_type !== 'youtube')) return;
    const id = youtubeId(s.youtube_url);
    if (!id) return;
    const params = new URLSearchParams({
      // Elementor passes each switch as 1/0 from data-settings; a switch that isn't saved there is 0.
      controls: s.controls === 'yes' ? '1' : '0',
      rel: '0',
      playsinline: s.play_on_mobile === 'yes' ? '1' : '0',
      modestbranding: '0',
      autoplay: s.autoplay === 'yes' ? '1' : '0',
    });
    if (s.mute === 'yes') params.set('mute', '1');
    if (s.loop === 'yes') {
      params.set('loop', '1');
      params.set('playlist', id);
    }
    const iframe = document.createElement('iframe');
    iframe.className = 'elementor-video';
    iframe.src = `https://www.youtube.com/embed/${id}?${params}`;
    iframe.title = 'YouTube video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.setAttribute('frameborder', '0');
    target.replaceWith(iframe);
  });
}

// Elementor Pro gallery widget (E-Gallery, grid layout): columns/gaps per breakpoint, aspect ratio,
// and the lazy-load "pop in" of each image when it scrolls into view.
const device = () => (window.innerWidth <= 767 ? 'mobile' : window.innerWidth <= 1024 ? 'tablet' : 'desktop');
const pick = (s, key, d) => (d !== 'desktop' && s[`${key}_${d}`] !== undefined && s[`${key}_${d}`] !== '' ? s[`${key}_${d}`] : d === 'mobile' && s[`${key}_tablet`] !== undefined && s[`${key}_tablet`] !== '' ? s[`${key}_tablet`] : s[key]);

function initGalleries(root) {
  const widgets = [...root.querySelectorAll('.elementor-widget-gallery')];
  if (!widgets.length) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      io.unobserve(img);
      const probe = new Image();
      probe.onload = () => {
        img.style.backgroundImage = `url("${img.dataset.thumbnail}")`;
        img.classList.add('e-gallery-image-loaded');
      };
      probe.src = img.dataset.thumbnail;
    });
  });
  const layout = () => {
    widgets.forEach((w) => {
      const s = settingsOf(w);
      const c = w.querySelector('.elementor-gallery__container');
      if (!c) return;
      const d = device();
      const columns = +pick(s, 'columns', d) || 4;
      const gap = pick(s, 'gap', d)?.size ?? 10;
      const [rw, rh] = (s.aspect_ratio || '3:2').split(':').map(Number);
      const items = [...c.querySelectorAll('.e-gallery-item')];
      const rows = Math.ceil(items.length / columns);
      c.classList.add('e-gallery-container', `e-gallery-${s.gallery_layout || 'grid'}`, 'e-gallery--ltr');
      // Hover animations the gallery handler adds at runtime (e.g. image "grow", overlay/content "fade-in").
      const anim = (sel, key) =>
        s[key] && c.querySelectorAll(sel).forEach((el) => el.classList.add(`elementor-animated-item--${s[key]}`));
      anim('.elementor-gallery-item__image', 'image_hover_animation');
      anim('.elementor-gallery-item__overlay', 'background_overlay_hover_animation');
      anim('.elementor-gallery-item__title, .elementor-gallery-item__description', 'content_hover_animation');
      if (s.lazyload === 'yes') c.classList.add('e-gallery--lazyload');
      c.style.setProperty('--hgap', `${gap}px`);
      c.style.setProperty('--vgap', `${gap}px`);
      c.style.setProperty('--animation-duration', '350ms');
      c.style.setProperty('--columns', columns);
      c.style.setProperty('--rows', rows);
      c.style.setProperty('--aspect-ratio', `${(rh / rw) * 100}%`);
      if (s.gallery_layout === 'masonry') {
        // E-Gallery masonry (same algorithm as e-gallery.js): each item goes to column i % columns unless
        // another (non-empty) column is more than 5px shorter; tops/heights are stored as percentages.
        const width = c.clientWidth;
        const colW = (width - gap * (columns - 1)) / columns;
        const heights = new Array(columns).fill(0);
        const counts = new Array(columns).fill(0);
        const tops = [];
        items.forEach((it, i) => {
          const img = it.querySelector('.e-gallery-image');
          const w = +img.dataset.width;
          const h = +img.dataset.height;
          const itemH = colW / (w / h);
          let col = i % columns;
          let cur = heights[col];
          heights.forEach((ch, j) => {
            if (ch && cur > ch + 5) {
              cur = ch;
              col = j;
            }
          });
          tops[i] = heights[col];
          heights[col] += itemH;
          it.style.setProperty('--item-height', `${(h / w) * 100}%`);
          it.style.setProperty('--column', col);
          it.style.setProperty('--items-in-column', counts[col]);
          counts[col]++;
        });
        const max = Math.max(...heights);
        c.style.setProperty('--highest-column-gap-count', counts[heights.indexOf(max)] - 1);
        c.style.paddingBottom = `${(max / width) * 100}%`;
        items.forEach((it, i) => it.style.setProperty('--percent-height', `${tops[i] ? (tops[i] / max) * 100 : 0}%`));
      } else {
        items.forEach((it, i) => {
          it.style.setProperty('--column', i % columns);
          it.style.setProperty('--row', Math.floor(i / columns));
        });
      }
    });
  };
  layout();
  widgets.forEach((w) => w.querySelectorAll('.e-gallery-image[data-thumbnail]').forEach((img) => io.observe(img)));
  window.addEventListener('resize', layout);
  return () => {
    io.disconnect();
    window.removeEventListener('resize', layout);
  };
}

// Elementor Pro slides widget (Swiper, "fade" effect): all slides stacked, cross-fade of transition_speed ms,
// autoplay every autoplay_speed ms (stops for good after the visitor uses the arrows or drags), infinite loop.
function initSlides(root) {
  const cleanups = [];
  root.querySelectorAll('.elementor-widget-slides').forEach((w) => {
    const s = settingsOf(w);
    const container = w.querySelector('.elementor-slides-wrapper');
    const wrapper = w.querySelector('.elementor-slides');
    const slides = [...wrapper.children];
    if (!slides.length) return;
    const speed = +s.transition_speed || 500;
    container.classList.add('swiper-container-fade', 'swiper-container-initialized', 'swiper-container-horizontal');
    container.style.cursor = 'grab';
    let index = 0;
    const paint = (animate) => {
      slides.forEach((sl, i) => {
        sl.style.transform = `translate3d(${-i * 100}%, 0px, 0px)`;
        sl.style.transitionDuration = animate ? `${speed}ms` : '0ms';
        sl.style.opacity = i === index ? '1' : '0';
        sl.style.pointerEvents = i === index ? 'auto' : 'none';
        sl.classList.toggle('swiper-slide-active', i === index);
        sl.classList.toggle('swiper-slide-next', i === (index + 1) % slides.length);
        sl.classList.toggle('swiper-slide-prev', i === (index - 1 + slides.length) % slides.length);
      });
    };
    const go = (d) => {
      index = (index + d + slides.length) % slides.length;
      paint(true);
    };
    paint(false);
    let timer = s.autoplay === 'yes' ? setInterval(() => go(1), (+s.autoplay_speed || 5000) + speed) : null;
    const stopAutoplay = () => {
      if (s.pause_on_interaction === 'yes' && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const next = w.querySelector('.elementor-swiper-button-next');
    const prev = w.querySelector('.elementor-swiper-button-prev');
    const onNext = () => (stopAutoplay(), go(1));
    const onPrev = () => (stopAutoplay(), go(-1));
    next?.addEventListener('click', onNext);
    prev?.addEventListener('click', onPrev);
    let startX = null;
    const down = (e) => (startX = e.clientX);
    const up = (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) {
        stopAutoplay();
        go(dx < 0 ? 1 : -1);
      }
    };
    container.addEventListener('pointerdown', down);
    container.addEventListener('pointerup', up);
    cleanups.push(() => {
      clearInterval(timer);
      next?.removeEventListener('click', onNext);
      prev?.removeEventListener('click', onPrev);
      container.removeEventListener('pointerdown', down);
      container.removeEventListener('pointerup', up);
    });
  });
  return () => cleanups.forEach((f) => f());
}

// Elementor image carousel (Swiper "slide" effect): slides_to_show per breakpoint, image_spacing gap,
// arrows + bullets, infinite loop via cloned slides, optional autoplay, drag/swipe.
function initCarousels(root) {
  const cleanups = [];
  root.querySelectorAll('.elementor-widget-image-carousel').forEach((w) => {
    const s = settingsOf(w);
    const container = w.querySelector('.elementor-image-carousel-wrapper');
    const wrapper = w.querySelector('.swiper-wrapper');
    const originals = [...wrapper.children];
    const n = originals.length;
    if (!n) return;
    const perView = () => +pick(s, 'slides_to_show', device()) || 1;
    const gap = () => (s.image_spacing === 'custom' ? pick(s, 'image_spacing_custom', device())?.size ?? 20 : n > 1 && perView() > 1 ? 10 : 0);
    const loop = s.infinite === 'yes' && n > 1;
    const speed = +s.speed || 500;
    container.classList.add('swiper-container-initialized', 'swiper-container-horizontal');
    container.style.cursor = 'grab';

    // clones for the loop (like Swiper's loopedSlides = slidesPerView)
    const clonesBefore = [];
    const clonesAfter = [];
    if (loop) {
      const k = Math.min(perView(), n);
      for (let i = 0; i < k; i++) {
        const a = originals[n - k + i].cloneNode(true);
        const b = originals[i].cloneNode(true);
        [a, b].forEach((c) => c.classList.add('swiper-slide-duplicate'));
        clonesBefore.push(a);
        clonesAfter.push(b);
      }
      clonesBefore.forEach((c) => wrapper.insertBefore(c, wrapper.firstChild));
      clonesAfter.forEach((c) => wrapper.appendChild(c));
    }
    const all = [...wrapper.children];
    const offset = clonesBefore.length;
    let pos = offset; // index into `all`

    const bullets = w.querySelector('.swiper-pagination');
    if (bullets) {
      bullets.classList.add('swiper-pagination-clickable', 'swiper-pagination-bullets');
      bullets.innerHTML = originals
        .map((_, i) => `<span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide ${i + 1}"></span>`)
        .join('');
    }
    const paint = (animate) => {
      const pv = perView();
      const g = gap();
      const slideW = (container.clientWidth - g * (pv - 1)) / pv;
      all.forEach((sl) => {
        sl.style.width = `${slideW}px`;
        sl.style.marginRight = `${g}px`;
      });
      wrapper.style.transitionDuration = animate ? `${speed}ms` : '0ms';
      wrapper.style.transform = `translate3d(${-pos * (slideW + g)}px, 0px, 0px)`;
      const real = (((pos - offset) % n) + n) % n;
      all.forEach((sl, i) => {
        sl.classList.toggle('swiper-slide-active', i === pos);
        sl.classList.toggle('swiper-slide-next', i === pos + 1);
        sl.classList.toggle('swiper-slide-prev', i === pos - 1);
      });
      bullets?.querySelectorAll('.swiper-pagination-bullet').forEach((b, i) => b.classList.toggle('swiper-pagination-bullet-active', i === real));
    };
    const go = (d) => {
      if (!loop) pos = Math.max(0, Math.min(n - perView(), pos + d));
      else pos += d;
      paint(true);
    };
    const onEnd = () => {
      if (!loop) return;
      if (pos < offset) pos += n;
      else if (pos >= offset + n) pos -= n;
      paint(false);
    };
    wrapper.addEventListener('transitionend', onEnd);
    paint(false);

    let timer = null;
    const startAuto = () => {
      if (s.autoplay === 'yes') timer = setInterval(() => go(1), +s.autoplay_speed || 5000);
    };
    const stopAuto = () => clearInterval(timer);
    startAuto();
    const onHoverIn = () => s.pause_on_hover === 'yes' && stopAuto();
    const onHoverOut = () => s.pause_on_hover === 'yes' && (stopAuto(), startAuto());
    container.addEventListener('mouseenter', onHoverIn);
    container.addEventListener('mouseleave', onHoverOut);

    const next = w.querySelector('.elementor-swiper-button-next');
    const prev = w.querySelector('.elementor-swiper-button-prev');
    const onNext = () => go(1);
    const onPrev = () => go(-1);
    next?.addEventListener('click', onNext);
    prev?.addEventListener('click', onPrev);
    const onBullet = (e) => {
      const b = e.target.closest('.swiper-pagination-bullet');
      if (!b) return;
      pos = offset + [...bullets.children].indexOf(b);
      paint(true);
    };
    bullets?.addEventListener('click', onBullet);

    let startX = null;
    let moved = false;
    const down = (e) => {
      startX = e.clientX;
      moved = false;
    };
    const move = (e) => {
      if (startX !== null && Math.abs(e.clientX - startX) > 5) moved = true;
    };
    const up = (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    };
    // a drag must not also open the lightbox
    const clickGuard = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    container.addEventListener('pointerdown', down);
    container.addEventListener('pointermove', move);
    container.addEventListener('pointerup', up);
    container.addEventListener('click', clickGuard, true);
    const onResize = () => paint(false);
    window.addEventListener('resize', onResize);
    cleanups.push(() => {
      stopAuto();
      window.removeEventListener('resize', onResize);
      wrapper.removeEventListener('transitionend', onEnd);
    });
  });
  return () => cleanups.forEach((f) => f());
}

// Elementor entrance animations: reveal .elementor-invisible elements when they scroll into view.
function initAnimations(root, timers) {
  const els = [...root.querySelectorAll('.elementor-invisible')];
  if (!els.length) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);
        const s = settingsOf(el);
        const animation = s._animation || s.animation;
        const delay = +(s._animation_delay || s.animation_delay || 0);
        timers.push(
          setTimeout(() => {
            el.classList.remove('elementor-invisible');
            if (animation && animation !== 'none') el.classList.add('animated', animation);
          }, delay),
        );
      });
    },
    { rootMargin: '0px', threshold: 0 },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// Elementor share buttons: open the network's share dialog in a 640x480 popup centred on the screen
// (Elementor's ShareLink), with the page URL, the post title and the featured image.
function initShareButtons(root, share) {
  const onClick = (e) => {
    const btn = e.target.closest('.elementor-share-btn');
    if (!btn || !root.contains(btn)) return;
    const network = /elementor-share-btn_(\w+)/.exec(btn.className)?.[1];
    const url = window.location.origin + window.location.pathname;
    const title = share?.title || document.title;
    const image = share?.image || '';
    const links = {
      facebook: `https://www.facebook.com/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text= ${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(title)}&summary=&source=${url}`,
      pinterest: `https://www.pinterest.com/pin/create/button/?url=${url}&media=${image}`,
      whatsapp: `https://api.whatsapp.com/send?text=*${encodeURIComponent(title)}*%0A%0A${url}`,
      xing: `https://www.xing.com/app/user?op=share&url=${url}`,
      telegram: `https://telegram.me/share/url?url=${url}&text=${encodeURIComponent(title)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${url}`,
    };
    if (network === 'print') return window.print();
    const link = links[network];
    if (!link) return;
    if (network === 'email') return void (window.location.href = link);
    const w = 640;
    const h = 480;
    window.open(link, '', `toolbar=0,status=0,width=${w},height=${h},top=${screen.height / 2 - h / 2},left=${screen.width / 2 - w / 2}`);
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}

// Elementor nav-menu widgets inside page content: the burger toggle opens/closes the dropdown menu
// (Elementor's CSS animates it from the .elementor-active class).
function initMenuToggles(root) {
  const onClick = (e) => {
    const t = e.target.closest('.elementor-menu-toggle');
    if (!t || !root.contains(t)) return;
    const active = t.classList.toggle('elementor-active');
    t.setAttribute('aria-expanded', String(active));
    const dd = t.parentElement.querySelector('.elementor-nav-menu--dropdown');
    dd?.setAttribute('aria-hidden', String(!active));
    dd?.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', active ? '0' : '-1'));
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}

export default function WpPage({ html, bodyClass = '', share = null }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = ref.current;
    const timers = [];
    initSlideshows(root, timers);
    initVideos(root);
    const stopAnimations = initAnimations(root, timers);
    const stopGalleries = initGalleries(root);
    initForms(root);
    const stopSlides = initSlides(root);
    const stopCarousels = initCarousels(root);
    const stopShare = initShareButtons(root, share);
    const stopToggles = initMenuToggles(root);

    const onClick = (e) => {
      const a = e.target.closest('a');
      if (!a || !root.contains(a) || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (a.dataset.elementorOpenLightbox === 'yes' || a.dataset.elementorOpenLightbox === 'default') {
        e.preventDefault();
        const group = a.dataset.elementorLightboxSlideshow;
        // carousel clones are not part of the lightbox set
        const links = group
          ? [...root.querySelectorAll(`a[data-elementor-lightbox-slideshow="${group}"]`)].filter((l) => !l.closest(".swiper-slide-duplicate"))
          : [a];
        const current = a.closest(".swiper-slide-duplicate") ? links.find((l) => l.getAttribute("href") === a.getAttribute("href")) : a;
        openLightbox(
          links.map((l) => ({
            src: l.getAttribute('href'),
            title: l.dataset.elementorLightboxTitle || '',
            hash: l.getAttribute('e-action-hash') || '',
          })),
          Math.max(0, links.indexOf(current)),
        );
        return;
      }
      const href = a.getAttribute('href') || '';
      if (href === '#') {
        e.preventDefault();
        return;
      }
      if (href.startsWith('/') && !href.startsWith('//') && a.target !== '_blank') {
        e.preventDefault();
        navigate(href);
      }
    };
    // Elementor search forms submit to WordPress (GET /?s=term): route them to our search page.
    const onSubmit = (e) => {
      const form = e.target.closest('form[role="search"], form.elementor-search-form');
      if (!form) return;
      e.preventDefault();
      const q = new FormData(form).get('s') || '';
      navigate(`/?s=${encodeURIComponent(q).replace(/%20/g, '+')}`);
    };
    root.addEventListener('submit', onSubmit);
    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('submit', onSubmit);
      stopAnimations();
      stopGalleries();
      stopSlides();
      stopCarousels();
      stopShare();
      stopToggles();
      timers.forEach((t) => {
        clearTimeout(t);
        clearInterval(t);
      });
    };
  }, [html, navigate, share]);

  return (
    <div
      ref={ref}
      className={`wp-content elementor-kit-9 elementor-default elementor-page ${bodyClass}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
