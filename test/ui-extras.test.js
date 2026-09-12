import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import * as extras from '../src/ui-extras/index.js';
import defaultExport from '../src/ui-extras/index.js';
import { grain, grainStyles, grainStylesheet, grainStylesUrl } from '../src/ui-extras/index.js';
import * as client from '../src/ui-extras/client.js';
import * as coreClient from '../src/ui/client.js';
import * as ui from '../src/ui/index.js';

/* ------------------------------------------------------------------ *
 * The entry point
 * ------------------------------------------------------------------ */

test('the extras are their own entry, not part of the core', () => {
  assert.equal(typeof grain, 'function');
  assert.ok(!('grain' in ui), 'grain() is not exported from sitelo/ui');
  assert.ok(!ui.stylesheet({ minify: false }).includes('su-grain'), 'and ui.css carries none of its rules');

  // The runtime the component reaches for is served with the core's, but
  // the page-side calls come from the extras' own client.
  assert.equal(typeof client.setGrain, 'function');
  assert.equal(typeof client.getGrain, 'function');
  assert.ok(!('setGrain' in coreClient), 'setGrain() is not on sitelo/ui/client');
});

test('every export is a function, and on the default export too', () => {
  const names = Object.keys(extras).filter((name) => name !== 'default');

  assert.ok(names.includes('grain'));

  for (const name of names) {
    assert.equal(typeof extras[name], 'function', `${name} is callable`);
    assert.equal(typeof defaultExport[name], 'function', `${name} is on the default export`);
  }
});

/* ------------------------------------------------------------------ *
 * One sheet per component
 * ------------------------------------------------------------------ */

test('grainStyles() links grain.css the way styles() links ui.css', () => {
  assert.match(grainStyles(), /^<link rel="stylesheet" href="\/su\/grain-[0-9a-f]{8}\.css">$/);
  assert.equal(grainStyles(), `<link rel="stylesheet" href="${grainStylesUrl()}">`);
  assert.equal(grainStylesUrl({ hash: false }), '/su/grain.css');
  assert.match(grainStyles({ inline: true }), /^<style data-sitelo-ui-grain="">/);
  assert.match(grainStyles({ nonce: 'abc123' }), /^<link [^>]*nonce="abc123">$/);
});

test('grain.css is complete on its own', () => {
  const css = grainStylesheet({ minify: false });

  // The theme token the texture's opacity reads — light, and dark by
  // attribute and by preference, on the same selectors ui.css uses.
  assert.match(css, /:root \{[^}]*--su-grain-opacity: 0\.16/);
  assert.match(css, /\[data-su-theme='dark'\] \{[^}]*--su-grain-opacity: 0\.1;/);
  assert.match(css, /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme='light'\]\):not\(\[data-su-theme='light'\]\) \{[^}]*--su-grain-opacity: 0\.1;/);

  // And it leans on nothing the core sheet defines.
  for (const token of css.matchAll(/var\((--su-[a-z-]+)\)/g)) {
    assert.ok(css.includes(`${token[1]}:`), `${token[1]} is declared here`);
  }
});

test('grainStylesheet() picks up an edit to grain.css instead of serving a stale copy', async () => {
  const { writeFileSync } = await import('node:fs');
  const cssPath = fileURLToPath(new URL('../src/ui-extras/grain.css', import.meta.url));
  const original = readFileSync(cssPath, 'utf8');
  const before = grainStylesUrl();

  try {
    // A second apart, because the read is cached on the file's mtime.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    writeFileSync(cssPath, `${original}\n.su-canary{color:red}\n`);

    assert.match(grainStylesheet(), /su-canary/, 'the edit is visible to the next call');
    assert.notEqual(grainStylesUrl(), before, 'and the hashed name moves with it');
  } finally {
    writeFileSync(cssPath, original);
  }
});

/* ------------------------------------------------------------------ *
 * Grain
 * ------------------------------------------------------------------ */

test('grain() is decoration over the content, not a layer in it', () => {
  assert.equal(grain('x'), '<div class="su-grain">x</div>');
  assert.match(
    grain({ opacity: 0.4, blend: 'overlay', as: 'section' }, 'x'),
    /^<section class="su-grain" style="--su-grain-opacity: 0.4; --su-grain-blend: overlay">/,
  );

  const css = grainStylesheet({ minify: false });

  // The texture is painted on the wrapper itself, so nothing inside it
  // needs a z-index and no click ever lands on the grain.
  assert.match(css, /\.su-grain::after \{[^}]*pointer-events: none/);
  assert.match(css, /\.su-grain::after \{[^}]*border-radius: inherit/, 'follows a rounded box');
  assert.ok(!grain('x').includes('<span'), 'no element of its own to draw the texture');
});

test('the noise fills the box once, at one unit to the pixel', () => {
  // No viewBox and no size: the browser draws it at the box's own size.
  // A viewBox would make it stretch, and a size would make it tile.
  const svg = /--su-grain-image: url\(&#34;data:image\/svg\+xml,(.+?)&#34;\)/.exec(grain({ seed: 7 }, 'x'))[1];

  assert.match(svg, /^%3Csvg xmlns='http:\/\/www\.w3\.org\/2000\/svg'%3E/);
  assert.ok(!svg.includes('viewBox'));
  assert.ok(!svg.includes('stitchTiles'), 'nothing to stitch when nothing repeats');

  const css = grainStylesheet({ minify: false });

  assert.match(css, /\.su-grain::after \{[^}]*background-size: 100% 100%/);
  assert.match(css, /\.su-grain::after \{[^}]*background-repeat: no-repeat/);
});

test('grain() renders no tile of its own until asked', () => {
  // The stylesheet's tile is one string for the whole page; an inline one
  // is paid for per element. Only a call that changes the turbulence
  // should buy one.
  for (const props of [{}, { opacity: 0.3 }, { blend: 'overlay' }, { seed: 0 }, { color: 'var(--brand)' }]) {
    assert.ok(
      !grain(props, 'x').includes('--su-grain-image'),
      `${JSON.stringify(props)} uses the stylesheet's tile`,
    );
  }

  for (const props of [{ seed: 7 }, { type: 'turbulence' }, { frequency: 0.2 }, { octaves: 5 }, { color: '#f80' }]) {
    assert.match(
      grain(props, 'x'),
      /--su-grain-image: url/,
      `${JSON.stringify(props)} builds its own`,
    );
  }
});

test('the tile grain() builds is the one grain.css carries', () => {
  // One generator, two spellings. Put the single changed attribute back
  // and the inline tile has to be the sheet's, character for character —
  // otherwise passing `seed` would quietly change more than the seed.
  const inline = /--su-grain-image: (url\(&#34;.+?&#34;\))"/
    .exec(grain({ seed: 7 }, 'x'))[1]
    .replaceAll('&#34;', '"')
    .replace("seed='7'", "seed='0'");

  assert.ok(grainStylesheet({ minify: false }).includes(`--su-grain-image: ${inline};`));
});

test('grain() writes the noise props into the filter it builds', () => {
  assert.match(
    grain({ type: 'turbulence', frequency: 0.2, octaves: 5, seed: 3 }, 'x'),
    /type='turbulence' baseFrequency='0.2' numOctaves='5' seed='3'/,
  );
  assert.match(grain({ type: 'nonsense' }, 'x'), /type='fractalNoise'/, 'unknown type falls back');

  // The colour is a coefficient inside the filter, not a CSS value, so it
  // has to be one this can read: #f80 and rgb() are, var() is not.
  const tint = /values='1 0 0 0 0 0\.533 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/;

  assert.match(grain({ color: '#ff8800' }, 'x'), tint);
  assert.match(grain({ color: '#f80' }, 'x'), tint);
  assert.match(grain({ color: 'rgb(255, 136, 0)' }, 'x'), tint);
  assert.equal(grain({ color: 'rebeccapurple' }, 'x'), grain('x'), 'a colour it cannot read is left alone');
  assert.equal(grain({ color: '#fff' }, 'x'), grain('x'), 'white multiplies to nothing, so it is no tint');
  assert.equal(grain({ color: '#ff880000' }, 'x'), grain('x'), 'alpha zero is no tint either');
  assert.equal(grain({ color: '#ffffff80' }, 'x'), grain('x'), 'white at any alpha changes nothing');

  // Alpha is how much of the tint: half way from 1 to each coefficient.
  const half = /values='1 0 0 0 0 0\.766 0 0 0 0 0\.5 0 0 0 0 0 0 0 1 0'/;

  assert.match(grain({ color: 'rgba(255, 136, 0, 0.5)' }, 'x'), half);
  assert.match(grain({ color: 'rgb(255 136 0 / 50%)' }, 'x'), half);
  // 0x80 is 0.502 of 255, so the hex form lands a hair past the half.
  assert.match(grain({ color: '#ff880080' }, 'x'), /values='1 0 0 0 0 0\.766 0 0 0 0 0\.498 /);

  // What the browser half reads back from a tile is what went in.
  const html = grain({ type: 'turbulence', frequency: 0.2, octaves: 5, seed: 42, color: '#ff8800' }, 'x');
  const uri = decodeURIComponent(/--su-grain-image: url\(&#34;(.+?)&#34;\)/.exec(html)[1]);
  const matrices = [...uri.matchAll(/values='([^']+)'/g)].map((m) => m[1].split(' ').map(Number));
  const tinted = matrices.find((m) => m[1] === 0);

  assert.deepEqual([tinted[0], tinted[5], tinted[10]], [1, 0.533, 0], 'rows are five wide');
});
