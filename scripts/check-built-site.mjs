import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('dist');
if (!existsSync(root)) throw new Error('dist is missing; run npm run build first');

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(root).filter((path) => path.endsWith('.html'));
const failures = [];
const requiredRoutes = ['/zh/','/zh-tw/','/en/','/zh/start/','/zh/teachings/','/zh/practice/','/zh/articles/','/zh/search/','/zh/about/'];
const routeFile = (href) => {
  const clean = decodeURI(href.split(/[?#]/)[0]);
  if (!clean.startsWith('/')) return null;
  if (/\.[a-z0-9]+$/i.test(clean)) return join(root, clean);
  return join(root, clean, 'index.html');
};

for (const route of requiredRoutes) {
  if (!existsSync(routeFile(route))) failures.push(`Missing required route: ${route}`);
}

for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  for (const [, href] of html.matchAll(/href=["']([^"']+)["']/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = routeFile(href);
    if (target && !existsSync(target)) failures.push(`${path.replace(root,'dist')} -> ${href}`);
  }
  if (/\/((zh|zh-tw|en)\/)/.test(path) && !html.includes('data-language-menu')) failures.push(`${path.replace(root,'dist')} is missing the language menu`);
}

if (failures.length) throw new Error(`Built-site audit failed:\n${failures.join('\n')}`);
console.log(`Built-site audit passed: ${htmlFiles.length} HTML files and ${requiredRoutes.length} required routes checked.`);
