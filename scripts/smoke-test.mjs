import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const routes = ['/', '/tutoring/', '/web-development/', '/private-chef/'];
const titles = new Set();

function outputPath(urlPath) {
  return path.join(dist, urlPath.endsWith('/') ? `${urlPath}index.html` : urlPath);
}

for (const route of routes) {
  const html = await readFile(outputPath(route), 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: one main heading`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title, `${route}: page title`);
  titles.add(title);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${route}: description`);

  const nav = html.match(/<nav aria-label="Main navigation">([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav, `${route}: shared navigation`);
  for (const destination of routes) assert.ok(nav.includes(`href="${destination}"`), `${route}: link to ${destination}`);
  assert.equal((nav.match(/aria-current="page"/g) ?? []).length, 1, `${route}: one current-page indicator`);
  const currentLink = nav.match(/<a\b[^>]*aria-current="page"[^>]*>/)?.[0];
  assert.ok(currentLink?.includes(`href="${route}"`), `${route}: correct current-page indicator`);

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${route}: unique element IDs`);

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const target = new URL(href, `https://local.example${route}`);
    await access(outputPath(target.pathname));
    if (target.hash) {
      const targetHtml = target.pathname === route ? html : await readFile(outputPath(target.pathname), 'utf8');
      assert.ok(targetHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${route}: anchor ${href}`);
    }
  }

  if (route !== '/') {
    const service = route.slice(1, -1);
    const form = html.match(/<form\b[^>]*>[\s\S]*?<\/form>/)?.[0];
    assert.ok(form, `${route}: inquiry form`);
    assert.ok(form.includes(`name="${service}-inquiry"`), `${route}: unique form name`);
    assert.ok(form.includes('data-netlify="true"'), `${route}: Netlify detection`);
    assert.ok(form.includes('name="form-name"'), `${route}: Netlify form identifier`);
    assert.ok(form.includes('netlify-honeypot="bot-field"'), `${route}: spam trap`);
    assert.ok(form.includes('data-local-preview="false"'), `${route}: production form mode`);
    for (const field of ['name', 'email', 'message']) {
      const input = form.match(new RegExp(`<(?:input|textarea)\\b[^>]*name="${field}"[^>]*>`))?.[0];
      assert.ok(input?.includes('required'), `${route}: required ${field}`);
    }
  }
}

assert.equal(titles.size, routes.length, 'Each page has a distinct title.');
console.log('Passed: four static pages, navigation, current-page states, titles, local links/assets/anchors, and Netlify form markup.');
