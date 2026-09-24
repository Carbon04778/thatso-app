// Saves the exact Elementor content HTML of live pages into src/wp/pages/<slug>.html.
// - lazy-loaded images are replaced by the real <img> from their <noscript> fallback (+ loading="lazy")
// - internal links become relative so the React router handles them
// Also records each page's <title>, SEO meta tags (Yoast) and Elementor post data (share title/image).
// Usage: node scripts/fetch-wp-pages.cjs [--meta-only] slug1 slug2 ...   ("home" = front page, "produkt/<slug>" for products)
//   --meta-only: only record the metadata (for pages built as React components)
const fs = require('fs');
const path = require('path');

const SITE = 'https://thatso-germany.de';
const OUT = path.join(__dirname, '..', 'src', 'wp', 'pages');

// Returns the outer HTML of the first element whose start tag matches `startRe`, balancing nested <tag>s.
function extractDiv(html, startRe, tag = 'div') {
  const m = startRe.exec(html);
  if (!m) return null;
  const start = m.index;
  const tagRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  tagRe.lastIndex = start;
  let depth = 0;
  let t;
  while ((t = tagRe.exec(html))) {
    depth += t[0][1] === '/' ? -1 : 1;
    if (depth === 0) return html.slice(start, tagRe.lastIndex);
  }
  return null;
}

const decodeEntities = (t) =>
  t
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&');

// SEO tags from <head>: description, Open Graph, Twitter, canonical.
function headMeta(html) {
  const head = html.slice(0, html.indexOf('</head>'));
  const meta = [...head.matchAll(/<meta\s+(name|property)="((?:description|robots|og:[\w:]+|article:[\w:]+|twitter:[\w:]+))"\s+content="([^"]*)"\s*\/?>/g)].map(
    ([, attr, key, content]) => ({ attr, key, content: decodeEntities(content) }),
  );
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(head)?.[1];
  return { meta, canonical };
}

function clean(html) {
  return html
    // lazy <img ... lazyload> followed by <noscript><img real></noscript>  ->  real img
    .replace(/<img\b[^>]*\blazyload\b[^>]*>\s*<noscript>\s*(<img\b[^>]*>)\s*<\/noscript>/gi, (_, real) => real.replace(/^<img\b/i, '<img loading="lazy"'))
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, '')
    // lazy images without a <noscript> fallback (e.g. repeated images) and lazy iframes (Google Maps):
    // promote data-* attributes
    .replace(/<(?:img|iframe)\b[^>]*\blazyload\b[^>]*>/gi, (tag) =>
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
  const metaOnly = process.argv.includes('--meta-only');
  for (const slug of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
    const res = await fetch(slug === 'home' ? `${SITE}/` : `${SITE}/${slug}`);
    const html = await res.text();
    const body = /<body[^>]*class="([^"]*)"/.exec(html)?.[1] || '';
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] || '';
    // Pages on the theme's default template also show the theme's page title: keep the whole <main>.
    const fullWidth = /elementor_header_footer|elementor-template-full-width|elementor_canvas/.test(body);
    const content =
      (!fullWidth && extractDiv(html, /<main\b[^>]*>/, 'main')) ||
      extractDiv(html, /<div data-elementor-type="(?:wp-page|wp-post|single-post|single|product)"[^>]*>/) ||
      extractDiv(html, /<main\b[^>]*>/) ||
      extractDiv(html, /<div class="page-content"[^>]*>/);
    if (!content && !metaOnly) {
      console.log('NO CONTENT', slug);
      continue;
    }
    const file = metaOnly ? null : slug.replace(/\//g, '__') + '.html';
    if (file) fs.writeFileSync(path.join(OUT, file), clean(content));
    const post = /"post":(\{"id":\d+[^}]*\})/.exec(html)?.[1];
    const postCfg = post ? JSON.parse(post) : null;
    manifest[slug] = {
      file,
      title: decodeEntities(title),
      postId: /page-id-(\d+)|postid-(\d+)/.exec(body)?.slice(1).find(Boolean),
      ...headMeta(html),
      // what Elementor's share buttons use
      share: postCfg ? { title: decodeURIComponent(postCfg.title), image: postCfg.featuredImage || '' } : null,
    };
    console.log('saved', slug, metaOnly ? '(meta)' : content.length);
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
})();
