// Builds src/wp/search-index.json for the site search (a copy of WordPress's search on pages + products).
// READ-ONLY: logs in with the credentials in .env.local only to read the raw post content (what WordPress
// searches in) through the REST API with context=edit. It never sends a write request.
// Usage: node scripts/fetch-wp-search-index.cjs
const fs = require('fs');
const path = require('path');

const SITE = 'https://thatso-germany.de';
const env = Object.fromEntries(
  fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split(/\r?\n/).filter((l) => /^WP_/.test(l))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);

const jar = new Map();
const cookieHeader = () => [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
function store(res) {
  for (const c of res.headers.getSetCookie?.() || []) {
    const [kv] = c.split(';');
    const i = kv.indexOf('=');
    jar.set(kv.slice(0, i), kv.slice(i + 1));
  }
}
async function get(url, headers = {}) {
  const res = await fetch(url.startsWith('http') ? url : SITE + url, { headers: { cookie: cookieHeader(), ...headers }, redirect: 'manual' });
  store(res);
  return res;
}

async function login() {
  await get('/wp-login.php');
  jar.set('wordpress_test_cookie', 'WP%20Cookie%20check');
  const body = new URLSearchParams({ log: env.WP_USER, pwd: env.WP_PASS, 'wp-submit': 'Anmelden', redirect_to: `${SITE}/wp-admin/`, testcookie: '1' });
  const res = await fetch(`${SITE}/wp-login.php`, {
    method: 'POST',
    headers: { cookie: cookieHeader(), 'content-type': 'application/x-www-form-urlencoded' },
    body,
    redirect: 'manual',
  });
  store(res);
  if (![...jar.keys()].some((k) => k.startsWith('wordpress_logged_in'))) throw new Error('login failed');
  const nonce = await (await get('/wp-admin/admin-ajax.php?action=rest-nonce')).text();
  if (!/^[a-f0-9]{10}$/.test(nonce.trim())) throw new Error('no REST nonce: ' + nonce.slice(0, 80));
  return nonce.trim();
}

async function all(type, nonce) {
  const out = [];
  for (let page = 1; page < 20; page++) {
    const res = await get(
      `/wp-json/wp/v2/${type}?context=edit&status=publish&per_page=100&page=${page}&_fields=id,slug,link,date,title,excerpt,content,featured_media`,
      { 'X-WP-Nonce': nonce },
    );
    if (!res.ok) break;
    const items = await res.json();
    out.push(...items);
    if (items.length < 100) break;
  }
  return out;
}

// Thumbnails exactly as the live search page prints them (real <img> from the <noscript> fallback).
async function thumbnails() {
  const map = {};
  for (const q of ['e', 'a', 'i', 'o', 'u']) {
    for (let page = 1; page < 30; page++) {
      const url = page === 1 ? `/?s=${q}` : `/page/${page}?s=${q}`;
      const html = await (await get(url)).text();
      const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
      const blocks = main.split('<h2>').slice(1);
      if (!blocks.length) break;
      for (const b of blocks) {
        const link = /<a href="([^"]+)"/.exec(b)?.[1];
        const img = /<noscript>(<img\b[^>]*>)<\/noscript>/.exec(b)?.[1];
        if (link && !(link in map)) map[link] = img || null;
      }
      if (!/nav-previous"><a/.test(html)) break;
    }
  }
  return map;
}

(async () => {
  const nonce = await login();
  const [pages, products, thumbs] = await Promise.all([all('pages', nonce), all('produkt', nonce), thumbnails()]);
  const rel = (link) => link.replace(SITE, '').replace(/\/$/, '') || '/';
  const index = [...pages.map((p) => ['page', p]), ...products.map((p) => ['produkt', p])].map(([type, p]) => ({
    type,
    path: rel(p.link),
    link: p.link.replace(/\/$/, ''),
    title: p.title.raw ?? p.title.rendered,
    // displayed title, as WordPress prints it (typographic dashes/quotes)
    titleHtml: p.title.rendered,
    date: p.date,
    // raw fields WordPress's search compares against (post_title / post_excerpt / post_content)
    excerptRaw: p.excerpt.raw || '',
    content: p.content.raw || '',
    excerpt: p.excerpt.rendered,
    thumb: thumbs[p.link.replace(/\/$/, '')] ?? thumbs[p.link] ?? null,
  }));
  const out = path.join(__dirname, '..', 'src', 'wp', 'search-index.json');
  fs.writeFileSync(out, JSON.stringify(index));
  console.log('indexed', index.length, 'posts;', index.filter((i) => i.thumb).length, 'with thumbnail;', (fs.statSync(out).size / 1024).toFixed(0), 'KB');
})();
