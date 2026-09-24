import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../wp/wp.css';
import { openLightbox } from './Lightbox';

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
      controls: s.controls === '' ? '0' : '1',
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

export default function WpPage({ html, bodyClass = '' }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = ref.current;
    const timers = [];
    initSlideshows(root, timers);
    initVideos(root);
    const stopAnimations = initAnimations(root, timers);

    const onClick = (e) => {
      const a = e.target.closest('a');
      if (!a || !root.contains(a) || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (a.dataset.elementorOpenLightbox === 'yes' || a.dataset.elementorOpenLightbox === 'default') {
        e.preventDefault();
        const group = a.dataset.elementorLightboxSlideshow;
        const links = group ? [...root.querySelectorAll(`a[data-elementor-lightbox-slideshow="${group}"]`)] : [a];
        openLightbox(
          links.map((l) => ({
            src: l.getAttribute('href'),
            title: l.dataset.elementorLightboxTitle || '',
            hash: l.getAttribute('e-action-hash') || '',
          })),
          links.indexOf(a),
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
    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('click', onClick);
      stopAnimations();
      timers.forEach((t) => {
        clearTimeout(t);
        clearInterval(t);
      });
    };
  }, [html, navigate]);

  return (
    <div
      ref={ref}
      className={`wp-content elementor-kit-9 elementor-default elementor-page ${bodyClass}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
