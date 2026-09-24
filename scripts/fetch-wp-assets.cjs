// Downloads the Elementor / theme stylesheets the live site uses into src/wp/css, plus the fonts they reference.
// The Hello theme base styles are scoped to `.wp-content` so they only affect imported Elementor content.
// Usage: node scripts/fetch-wp-assets.cjs [postId ...]   (post ids = per-page Elementor CSS to fetch)
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const SITE = 'https://thatso-germany.de';
const OUT = path.join(__dirname, '..', 'src', 'wp', 'css');

// [url, local file, scope?]
const BASE = [
  ['/wp-content/themes/hello-elementor/style.min.css', 'hello-style.css', true],
  ['/wp-content/themes/hello-elementor/theme.min.css', 'hello-theme.css', true],
  ['/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css', 'eicons/css/elementor-icons.css'],
  ['/wp-content/plugins/elementor/assets/css/frontend-legacy.min.css', 'elementor-frontend-legacy.css'],
  ['/wp-content/plugins/elementor/assets/css/frontend.min.css', 'elementor-frontend.css'],
  ['/wp-content/plugins/elementor-pro/assets/css/frontend.min.css', 'elementor-pro-frontend.css'],
  ['/wp-content/plugins/elementor/assets/lib/font-awesome/css/all.min.css', 'font-awesome/css/all.css'],
  ['/wp-content/plugins/elementor/assets/lib/font-awesome/css/v4-shims.min.css', 'font-awesome/css/v4-shims.css'],
  ['/wp-content/plugins/elementor/assets/lib/animations/animations.min.css', 'animations.css'],
  ['/wp-content/plugins/ele-custom-skin/assets/css/ecs-style.css', 'ecs-style.css'],
  ['/wp-content/uploads/elementor/css/global.css', 'global.css'],
  ['/wp-content/uploads/elementor/css/post-9.css', 'post-9.css'],
];

async function get(url, binary = false) {
  const res = await fetch(url.startsWith('http') ? url : SITE + url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
}

// Prefix every selector with :where(.wp-content) (html/body become the wrapper itself); :where() keeps the
// original specificity so Elementor's own rules still win exactly as on the live site.
function scope(css) {
  const root = postcss.parse(css);
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === 'atrule' && /keyframes/i.test(rule.parent.name)) return;
    rule.selectors = rule.selectors.map((s) => {
      if (/^(html|body)$/.test(s.trim())) return ':where(.wp-content)';
      if (/^(html|body)\b/.test(s.trim())) return s.trim().replace(/^(html|body)/, ':where(.wp-content)');
      return `:where(.wp-content) ${s}`;
    });
  });
  return root.toString();
}

// Download fonts referenced with relative url(...) next to the css file (keeps the relative layout).
async function fetchUrls(css, remoteCssUrl, localCssFile) {
  const urls = [...css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((m) => m[2]).filter((u) => !u.startsWith('data:') && !u.startsWith('http'));
  for (const u of new Set(urls)) {
    const clean = u.split(/[?#]/)[0];
    const remote = new URL(u, SITE + remoteCssUrl).href;
    const local = path.join(path.dirname(localCssFile), clean);
    if (fs.existsSync(local)) continue;
    fs.mkdirSync(path.dirname(local), { recursive: true });
    try {
      fs.writeFileSync(local, await get(remote, true));
      console.log('  font', path.relative(OUT, local));
    } catch (e) {
      console.log('  skip', remote, e.message);
    }
  }
}

(async () => {
  const ids = process.argv.slice(2);
  const list = [...BASE, ...ids.map((id) => [`/wp-content/uploads/elementor/css/post-${id}.css`, `post-${id}.css`])];
  for (const [url, file, scoped] of list) {
    const local = path.join(OUT, file);
    fs.mkdirSync(path.dirname(local), { recursive: true });
    let css;
    try {
      css = await get(url);
    } catch (e) {
      console.log('missing', url, e.message);
      continue;
    }
    await fetchUrls(css, url, local);
    if (scoped) css = scope(css);
    fs.writeFileSync(local, `/* Source: ${SITE}${url} */\n${css}`);
    console.log('saved', file, css.length);
  }
})();
