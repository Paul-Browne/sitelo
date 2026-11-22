import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  enhancementsUsed,
  missingEnhancementMessage,
  registeredEnhancements,
} from '../src/enhance-plugin.js';

const read = (source, file = 'src/enhance.ts') => registeredEnhancements(source, file);

test('reads the keys of an object literal passed to mountEnhancements', () => {
  const found = read(`
    import { mountEnhancements } from 'sitelo/enhance/client'

    mountEnhancements({
      counter: () => import('./client/counter.ts'),
      'copy-link': () => import('./client/copy.ts'),
      ['tabs']: async () => { return import('./client/tabs.ts') },
    }, { rootMargin: '400px' })
  `);

  assert.deepEqual(found, { names: ['counter', 'copy-link', 'tabs'], calls: 1, readable: true });
});

test('follows an alias, a namespace import, and a const map in the same file', () => {
  assert.deepEqual(
    read(`
      import { mountEnhancements as mount } from 'sitelo/enhance/client'
      export const modules = { a: () => import('./a.js') } satisfies Record<string, unknown>
      mount(modules)
    `).names,
    ['a'],
  );

  assert.deepEqual(
    read(`
      import * as enhance from 'sitelo/enhance/client'
      enhance.mountEnhancements({ b: () => import('./b.js') })
    `).names,
    ['b'],
  );
});

test('adds up several calls in one file', () => {
  const found = read(`
    import { mountEnhancements } from 'sitelo/enhance/client'
    mountEnhancements({ a: () => import('./a.js') })
    mountEnhancements({ b: () => import('./b.js') }, { root: document.querySelector('main') })
  `);

  assert.deepEqual(found.names, ['a', 'b']);
  assert.equal(found.calls, 2);
});

test('gives up on anything only known at runtime', () => {
  const unreadable = [
    // A spread.
    `import { mountEnhancements } from 'sitelo/enhance/client'
     mountEnhancements({ ...more, a: () => import('./a.js') })`,
    // A map from somewhere else.
    `import { mountEnhancements } from 'sitelo/enhance/client'
     import { modules } from './modules.js'
     mountEnhancements(modules)`,
    // A computed key.
    `import { mountEnhancements } from 'sitelo/enhance/client'
     mountEnhancements({ [name]: () => import('./a.js') })`,
    // The function handed to someone else.
    `import { mountEnhancements } from 'sitelo/enhance/client'
     setup(mountEnhancements)`,
    // Re-exported for another module to call.
    `export { mountEnhancements } from 'sitelo/enhance/client'`,
    // The client imported at runtime.
    `const { mountEnhancements } = await import('sitelo/enhance/client')
     mountEnhancements({ a: () => import('./a.js') })`,
    // Not valid code at all.
    `import { mountEnhancements } from 'sitelo/enhance/client'
     mountEnhancements({ a: `,
  ];

  for (const source of unreadable) {
    assert.equal(read(source).readable, false, source);
  }
});

test('ignores modules that do not use the client', () => {
  assert.deepEqual(read(`mountEnhancements({ a: 1 })`), { names: [], calls: 0, readable: true });
  assert.deepEqual(
    read(`import type { Enhancer } from 'sitelo/enhance/client'\nconst x: Enhancer = () => {}`),
    { names: [], calls: 0, readable: true },
  );
});

test('finds names on real elements only, not in escaped code samples', () => {
  const html = `
    <div data-sitelo-enhance="counter" data-sitelo-props="{&quot;a&quot;:1}"></div>
    <form action="/s" data-sitelo-enhance="search"></form>
    <div data-sitelo-enhance="counter"></div>
    <pre><code>&lt;div data-sitelo-enhance="sample"&gt;</code></pre>
    <button onclick="x('>')" data-sitelo-enhance="after-a-quoted-gt"></button>
  `;

  assert.deepEqual(enhancementsUsed(html), ['counter', 'search', 'after-a-quoted-gt']);
});

test('the message suggests the closest registered name, or how to register it', () => {
  const registry = { names: new Set(['counter', 'clock']), calls: 1 };

  assert.equal(
    missingEnhancementMessage('index.html', ['countr'], registry, 'src'),
    '[sitelo] index.html uses enhancement "countr", which no mountEnhancements() call registers. ' +
      'Did you mean "counter"? Registered: clock, counter.',
  );

  assert.match(
    missingEnhancementMessage('index.html', ['chart'], registry, 'src'),
    /Register it in a script the page links: mountEnhancements\(\{ 'chart': \(\) => import\('\.\/…'\) \}\)\. Registered: clock, counter\.$/,
  );

  assert.match(
    missingEnhancementMessage('index.html', ['countr', 'clok'], registry, 'src'),
    /Did you mean "counter" for "countr", "clock" for "clok"\?/,
  );

  assert.match(
    missingEnhancementMessage('about/index.html', ['counter'], { names: new Set(), calls: 0 }, 'site'),
    /about\/index\.html uses enhancement "counter", but nothing under site\/ calls mountEnhancements\(\) from sitelo\/enhance\/client, so it never loads\./,
  );
});
