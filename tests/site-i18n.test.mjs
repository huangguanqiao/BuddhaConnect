import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCALES, LOCALE_NAMES, PRIMARY_NAV, localizedPath, stripMarkdown, translationLinksFor } from '../src/lib/site-i18n.mjs';

test('all supported locales have compact language-menu labels', () => {
  assert.deepEqual(LOCALES.map((locale) => LOCALE_NAMES[locale]), ['简体中文','繁體中文','English']);
});

test('primary navigation contains only implemented sections', () => {
  assert.deepEqual(PRIMARY_NAV, ['home','start','teachings','practice','articles','about']);
  assert.equal(PRIMARY_NAV.includes('scriptures'), false);
  assert.equal(PRIMARY_NAV.includes('tools'), false);
});

test('static translation links preserve the equivalent section', () => {
  assert.deepEqual(translationLinksFor('practice').map((item) => item.url), ['/zh/practice/','/zh-tw/practice/','/en/practice/']);
  assert.equal(localizedPath('en','search'), '/en/search/');
});

test('markdown is reduced to searchable text', () => {
  assert.equal(stripMarkdown('## Heading\nA **calm** [link](/x).'), 'Heading A calm link.');
});
