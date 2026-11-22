import assert from 'node:assert/strict';
import { test } from 'node:test';

import { enhance } from '../src/enhance.js';
import { configureIslands } from '../src/islands.js';

test('enhance() wraps the markup and escapes props', () => {
  const html = enhance('counter', { label: '"<b>"', start: 2 }, '<button>+1</button>');

  assert.equal(
    html,
    '<div data-sitelo-enhance="counter" data-sitelo-props="{&quot;label&quot;:&quot;\\&quot;&lt;b&gt;\\&quot;&quot;,&quot;start&quot;:2}"><button>+1</button></div>',
  );
});

test('enhance() leaves out the props attribute when there are none', () => {
  assert.equal(enhance('copy'), '<div data-sitelo-enhance="copy"></div>');
  assert.equal(enhance('copy', {}, 'x'), '<div data-sitelo-enhance="copy">x</div>');
  assert.equal(enhance('copy', null, 'x'), '<div data-sitelo-enhance="copy">x</div>');
});

test('enhance() writes when, and rootMargin only for visible', () => {
  assert.match(enhance('a', {}, '', { when: 'idle' }), /data-sitelo-when="idle"/);
  assert.doesNotMatch(enhance('a', {}, '', { when: 'load' }), /data-sitelo-when/);

  const visible = enhance('a', {}, '', { when: 'visible', rootMargin: '400px' });
  assert.match(visible, /data-sitelo-when="visible"/);
  assert.match(visible, /data-sitelo-root-margin="400px"/);

  assert.doesNotMatch(
    enhance('a', {}, '', { when: 'idle', rootMargin: '400px' }),
    /root-margin/,
  );
});

test('enhance() rejects unsafe names, strategies and margins', () => {
  for (const name of ['', '../x', 'a b', '-x', '"><script>', 42]) {
    assert.throws(() => enhance(/** @type {any} */ (name)), /Invalid enhancement name/);
  }

  assert.throws(
    () => enhance('a', {}, '', /** @type {any} */ ({ when: 'soon' })),
    /Invalid enhancement loading strategy "soon"/,
  );
  assert.throws(
    () => enhance('a', {}, '', /** @type {any} */ ({ when: 'visible', rootMargin: 400 })),
    /rootMargin must be a string/,
  );
});

test('enhance() never signs props, even with an islands secret set', (t) => {
  configureIslands({ secret: 'shh' });
  t.after(() => configureIslands({ secret: null }));

  assert.doesNotMatch(enhance('a', { id: 1 }), /data-sitelo-sig/);
});

test('enhanceAttributes() is an object of attributes, and attribute text in a template literal', async () => {
  const { enhanceAttributes } = await import('../src/enhance.js');
  const attributes = enhanceAttributes('search', { q: 'a"b<c' }, { when: 'idle' });

  assert.deepEqual({ ...attributes }, {
    'data-sitelo-enhance': 'search',
    'data-sitelo-props': '{"q":"a\\"b<c"}',
    'data-sitelo-when': 'idle',
  });

  assert.equal(
    `<form action="/s" ${attributes}>`,
    '<form action="/s" data-sitelo-enhance="search" data-sitelo-props="{&quot;q&quot;:&quot;a\\&quot;b&lt;c&quot;}" data-sitelo-when="idle">',
  );
});

test('enhanceAttributes() works as javascript-to-html attributes', async () => {
  const { enhanceAttributes } = await import('../src/enhance.js');
  const { form, input } = await import('javascript-to-html');

  assert.equal(
    form({ action: '/s' }, enhanceAttributes('search', { min: 2 }), input({ name: 'q' })),
    '<form action="/s" data-sitelo-enhance="search" data-sitelo-props="{&#34;min&#34;:2}"><input name="q"></form>',
  );
});

test('enhance() is enhanceAttributes() on a <div>', async () => {
  const { enhanceAttributes } = await import('../src/enhance.js');

  assert.equal(
    enhance('a', { x: 1 }, '<p>hi</p>', { when: 'visible', rootMargin: '1px' }),
    `<div ${enhanceAttributes('a', { x: 1 }, { when: 'visible', rootMargin: '1px' })}><p>hi</p></div>`,
  );
  assert.throws(() => enhanceAttributes('no spaces'), /Invalid enhancement name/);
});
