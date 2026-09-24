import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import WpPage from '../components/WpPage';

// Site search, reproducing WordPress's search (WP_Query) on pages + products and the Hello theme's
// search results template. The index is built by scripts/fetch-wp-search-index.cjs and loaded on demand.

const PER_PAGE = 10;
const SITE = 'https://thatso-germany.de';

// WordPress de_DE search stopwords (from the live site's de_DE.mo: "Comma-separated list of search stopwords").
const STOPWORDS = new Set(
  'ein,eine,einer,der,die,das,und,oder,doch,sind,ist,war,für,von,in,an,zu,über,mit,dies,diese,diesen,dieser,wer,wo,wie,was,www,nicht'.split(','),
);

// MySQL utf8mb4_unicode_ci: case- and accent-insensitive LIKE '%term%'.
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').toLowerCase();
const like = (hay, needle) => hay.includes(needle);

function parseTerms(s) {
  const raw = s.match(/".*?("|$)|((?<=[\t ",+])|^)[^\t ",+]+/g) || [];
  const terms = [];
  for (let t of raw) {
    const quoted = /^".+"$/.test(t);
    t = quoted ? t.slice(1, -1) : t.replace(/^"|"$/g, '').trim();
    if (!t || (t.length === 1 && /^[a-z-]$/i.test(t))) continue;
    if (STOPWORDS.has(t.toLowerCase())) continue;
    terms.push(t);
  }
  return { count: raw.length, terms };
}

function search(index, s) {
  const { count, terms: parsed } = parseTerms(s);
  const terms = !parsed.length || parsed.length > 9 ? [s] : parsed;
  const include = [];
  const exclude = [];
  terms.forEach((t) => (t.startsWith('-') && t.length > 1 && count > 0 ? exclude.push(fold(t.slice(1))) : include.push(fold(t))));
  const rows = index
    .map((p) => ({ p, title: fold(p.title), excerpt: fold(p.excerptRaw), content: fold(p.content) }))
    .filter((r) => include.every((t) => like(r.title, t) || like(r.excerpt, t) || like(r.content, t)))
    .filter((r) => exclude.every((t) => !like(r.title, t) && !like(r.excerpt, t) && !like(r.content, t)));

  let rank;
  if (count > 1) {
    const sentence = /(?:\s|^)-/.test(s) ? null : fold(s);
    rank = (r) => {
      if (sentence && like(r.title, sentence)) return 1;
      if (include.length < 7 && include.every((t) => like(r.title, t))) return 2;
      if (include.length < 7 && include.length > 1 && include.some((t) => like(r.title, t))) return 3;
      if (sentence && like(r.excerpt, sentence)) return 4;
      if (sentence && like(r.content, sentence)) return 5;
      return 6;
    };
  } else {
    rank = (r) => (like(r.title, include[0] ?? '') ? 0 : 1);
  }
  return rows
    .map((r) => ({ ...r, rank: rank(r) }))
    .sort((a, b) => a.rank - b.rank || b.p.date.localeCompare(a.p.date))
    .map((r) => r.p);
}

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
const rel = (url) => url.replace(SITE, '') || '/';
const pageUrl = (n, s) => `${n > 1 ? `/page/${n}` : '/'}?s=${encodeURIComponent(s).replace(/%20/g, '+')}`;

function render(results, s, page) {
  const pages = Math.ceil(results.length / PER_PAGE);
  const items = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const body = items.length
    ? items
        .map((p) => {
          const thumb = p.thumb ? p.thumb.replace(/^<img\b/i, '<img loading="lazy"') : '';
          return `<h2><a href="${rel(p.link)}">${p.titleHtml}</a></h2>${thumb}${p.excerpt}`;
        })
        .join(' ')
    : '<p>Es wurden keine gesuchten Inhalte gefunden.</p>';
  const nav =
    pages > 1
      ? ` <nav class="pagination" role="navigation"> <div class="nav-previous">${
          page < pages ? `<a href="${pageUrl(page + 1, s)}" ><span class="meta-nav">&larr;</span> Zurück</a>` : ''
        }</div> <div class="nav-next">${
          page > 1 ? `<a href="${pageUrl(page - 1, s)}" >Weiter <span class="meta-nav">&rarr;</span></a>` : ''
        }</div> </nav>`
      : '';
  return `<main id="content" class="site-main" role="main"> <header class="page-header"> <h1 class="entry-title"> Suchergebnisse für: <span>${esc(s)}</span> </h1> </header> <div class="page-content"> ${body} </div>${nav} </main>`;
}

export default function SearchPage() {
  const { search: qs } = useLocation();
  const { page: pageParam } = useParams();
  const s = new URLSearchParams(qs).get('s') || '';
  const page = Math.max(1, +pageParam || 1);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    import('../wp/search-index.json').then((m) => setIndex(m.default));
  }, []);
  const pages = index ? Math.ceil(search(index, s).length / PER_PAGE) : 1;
  useEffect(() => {
    document.title = `Du hast nach ${s} gesucht${page > 1 ? ` - Seite ${page} von ${pages}` : ''} - TerraArt - Thats-so`;
  }, [s, page, pages]);

  if (!index) return <div className="min-h-[60vh]" />;
  return <WpPage html={render(search(index, s), s, page)} bodyClass="search search-results" />;
}
