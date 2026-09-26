const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const canonical = 'https://datecube.in/';
const meta = (key) => html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]+)"`))?.[1];
assert(html.includes(`<link rel="canonical" href="${canonical}">`));
assert.equal(meta('og:url'), canonical);
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert(meta('description').includes('perpetual desk calendar'));
assert(meta('robots').includes('index, follow'));
assert(!/\bnoindex\b|\bnosnippet\b/.test(meta('robots')));
assert.equal(meta('twitter:card'), 'summary_large_image');
assert.equal(meta('og:image'), meta('twitter:image'));

const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(schema['@context'], 'https://schema.org');
const ids = new Set(schema['@graph'].map(entity => entity['@id']));
function checkReferences(value) {
  if (!value || typeof value !== 'object') return;
  if (value['@id'] && !value['@type']) assert(ids.has(value['@id']), `Unresolved entity: ${value['@id']}`);
  for (const child of Object.values(value)) checkReferences(child);
}
checkReferences(schema);
const webpage = schema['@graph'].find(entity => entity['@type'] === 'WebPage');
assert.equal(webpage.description, meta('description'));
assert.equal(webpage.name, html.match(/<title>(.*?)<\/title>/)[1]);
const organization = schema['@graph'].find(entity => entity['@type'] === 'Organization');
for (const url of organization.sameAs) assert(html.includes(`href="${url}"`));
assert(html.includes(`href="mailto:${organization.email}"`));

for (const [, attribute] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (attribute.startsWith('#')) {
    if (attribute.length > 1) assert(html.includes(`id="${attribute.slice(1)}"`), `Missing anchor: ${attribute}`);
  } else if (!/^(https?:|mailto:)/.test(attribute)) {
    const local = attribute.split('?')[0].replace(/^\//, '');
    assert(fs.existsSync(path.join(root, local)), `Missing local asset: ${local}`);
  }
}
for (const url of [meta('og:image'), organization.logo]) {
  assert(url.startsWith(canonical));
  assert(fs.existsSync(path.join(root, url.slice(canonical.length))));
}
const robots = read('robots.txt');
assert(/User-agent: \*\s+Allow: \//.test(robots));
assert(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
assert(!/^Disallow:\s*\//m.test(robots));
const locations = [...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(locations, [canonical]);
assert(read('llms.txt').includes('have not been announced'));
assert(html.includes('DateCube is a 3×3 twistable perpetual desk calendar.'));
console.log('SEO checks passed: metadata, JSON-LD, linked assets, anchors, sitemap and crawl permission.');
