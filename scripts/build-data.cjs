const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', 'thatso-migration', 'export');
const OUT = path.join(__dirname, '..', 'src', 'data');
fs.mkdirSync(OUT, { recursive: true });

const products = JSON.parse(fs.readFileSync(path.join(SRC, 'products.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(SRC, 'pages.json'), 'utf8'));

// Split the flat product text into Beschreibung / Anwendung / Info sections.
function splitSections(text) {
  const headings = ['Beschreibung', 'Anwendung', 'Info'];
  const result = { description: '', usage: '', info: '' };
  const lines = text.split('\n');
  let current = 'description';
  const map = { Beschreibung: 'description', Anwendung: 'usage', Info: 'info' };
  for (const line of lines) {
    if (headings.includes(line.trim())) {
      current = map[line.trim()];
      continue;
    }
    result[current] += (result[current] ? '\n' : '') + line;
  }
  return result;
}

function slugToTitleCategory(cats) {
  return cats.filter((c) => !['Icon'].includes(c));
}

const cleanProducts = products.map((p) => {
  const sections = splitSections(p.text);
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    categories: slugToTitleCategory(p.categories),
    description: sections.description.replace(/^•\s*/, '').trim(),
    usage: sections.usage.replace(/^•\s*/, '').trim(),
    info: sections.info.replace(/^•\s*/, '').trim(),
    featured_image: p.featured_image,
    images: p.images,
  };
});

fs.writeFileSync(path.join(OUT, 'products.json'), JSON.stringify(cleanProducts, null, 2));

// Keep the handful of real, linked pages (skip WP drafts/orphans not in the live nav).
const KEEP_SLUGS = [
  'startseite', 'impressum', 'datenschutz', 'agb', 'widerrufsrecht',
  'versand-und-zahlungsinformationen', 'ueber-uns', 'kontakt',
  'self-tan', 'sun-care', 'self-care', 'professional', 'beauty-espresso',
  'geraete', 'mediengalerie', 'video', 'sonnenschutz', 'anti-aging',
  'braeunungsspray', 'face-up', 'body-up',
];
const cleanPages = pages
  .filter((p) => KEEP_SLUGS.includes(p.slug))
  .map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    text: p.text,
    featured_image: p.featured_image,
  }));

fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(cleanPages, null, 2));

console.log('Products written:', cleanProducts.length);
console.log('Pages written:', cleanPages.length, cleanPages.map((p) => p.slug));
