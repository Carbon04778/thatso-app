// Saves the exact Elementor content HTML of live pages into src/wp/pages/<slug>.html.
// - lazy-loaded images are replaced by the real <img> from their <noscript> fallback (+ loading="lazy")
// - internal links become relative so the React router handles them
// Usage: node scripts/fetch-wp-pages.cjs slug1 slug2 ...   (use "produkt/<slug>" for products)
const fs = require('fs');
const path = require('path');

const SITE = 'https://thatso-germany.de';
const OUT = path.join(__dirname, '..', 'src', 'wp', 'pages');

// Returns the outer HTML of the first element whose start tag matches `startRe`, balancing nested <div>s.
function extractDiv(html, startRe) {
  const m = startRe.exec(html);
  if (!m) return null;
  const start = m.index;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let depth = 0;
  let t;
  while ((t = tagRe.exec(html))) {
    depth += t[0][1] === '/' ? -1 : 1;
    if (depth === 0) return html.slice(start, tagRe.lastIndex);
  }
  return null;
}

function clean(html) {
  return html
    // lazy <img ... lazyload> followed by <noscript><img real></noscript>  ->  real img
    .replace(/<img\b[^>]*\blazyload\b[^>]*>\s*<noscript>\s*(<img\b[^>]*>)\s*<\/noscript>/gi, (_, real) => real.replace(/^<img\b/i, '<img loading="lazy"'))
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, '')
    // lazy images without a <noscript> fallback (e.g. repeated images): promote data-* attributes
    .replace(/<img\b[^>]*\blazyload\b[^>]*>/gi, (tag) =>
      tag
        .replace(/\ssrc="data:[^"]*"/i, '')
        .replace(/\sdata-(src|srcset|sizes)=/gi, ' $1=')
        .replace(/\s?\blazyload\b/, '')
        .replace(/^<img\b/i, '<img loading="lazy"'))
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    // internal page links -> relative (uploads and other wp paths stay absolute)
    .replace(/href="https?:\/\/(?:www\.)?thatso-germany\.de(\/(?!wp-)[^"]*)?"/gi, (_, p = '/') => `href="${p.replace(/\/$/, '') || '/'}"`)
    .replace(/\n\s*\n/g, '\n');
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = fs.existsSync(path.join(OUT, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8')) : {};
  for (const slug of process.argv.slice(2)) {
    const res = await fetch(`${SITE}/${slug}`);
    const html = await res.text();
    const body = /<body[^>]*class="([^"]*)"/.exec(html)?.[1] || '';
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] || '';
    const content =
      extractDiv(html, /<div data-elementor-type="(?:wp-page|single-post|single|product)"[^>]*>/) ||
      extractDiv(html, /<main\b[^>]*>/) ||
      extractDiv(html, /<div class="page-content"[^>]*>/);
    if (!content) {
      console.log('NO CONTENT', slug);
      continue;
    }
    const file = slug.replace(/\//g, '__') + '.html';
    fs.writeFileSync(path.join(OUT, file), clean(content));
    manifest[slug] = {
      file,
      title: title.replace(/&#8211;/g, '–').replace(/&amp;/g, '&'),
      postId: /page-id-(\d+)|postid-(\d+)/.exec(body)?.slice(1).find(Boolean),
      bodyClass: body,
    };
    console.log('saved', slug, content.length);
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
})();
