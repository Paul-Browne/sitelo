import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync, readFileSync } from 'node:fs';

import * as ui from '../src/ui/index.js';
import { presetNames, sheetNamed } from '../src/ui/sheet.js';
import { composite, contrast, parseColor, readTokens } from './helpers/tokens.js';

const presets = presetNames();

/** A preset's sheet, readable. */
const presetCss = (name) => sheetNamed(name).stylesheet({ minify: false });

/* ------------------------------------------------------------------ *
 * Choosing one
 * ------------------------------------------------------------------ */

test('there are presets to choose from', () => {
  assert.ok(presets.includes('neumorphism'), presets.join(', '));
});

test('styles({ preset }) links the core sheet and then the preset, from one base', () => {
  const html = ui.styles({ preset: 'neumorphism' });
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

  assert.equal(hrefs.length, 2);
  assert.equal(hrefs[0], ui.stylesUrl(), 'the core sheet comes first');
  assert.match(hrefs[1], /^\/su\/neumorphism-[0-9a-f]{8}\.css$/, 'the preset after it, so it wins');

  assert.deepEqual(
    [...ui.styles({ preset: 'neumorphism', base: '/x/', hash: false }).matchAll(/href="([^"]+)"/g)].map((m) => m[1]),
    ['/x/ui.css', '/x/neumorphism.css'],
    'and every option reaches both links',
  );
});

test('an inlined preset carries a marker of its own', () => {
  const html = ui.styles({ preset: 'neumorphism', inline: true, nonce: 'n' });

  // The plugin finds each inlined sheet by its marker to prune it, and
  // passes by a name that is not a sheet — so the name has to be exact.
  assert.match(html, /^<style data-sitelo-ui="" nonce="n">[\s\S]*<\/style><style data-sitelo-ui-neumorphism="" nonce="n">/);
  assert.ok(html.includes(sheetNamed('neumorphism').stylesheet()));
});

test('no preset is the plain sheet', () => {
  assert.equal(ui.styles({ preset: undefined }), ui.styles());
  assert.equal(ui.stylesheet({ preset: undefined }), ui.stylesheet());
});

test('stylesheet({ preset }) is the two sheets in link order', () => {
  assert.equal(
    ui.stylesheet({ preset: 'neumorphism' }),
    ui.stylesheet() + sheetNamed('neumorphism').stylesheet(),
  );

  const raw = ui.stylesheet({ preset: 'neumorphism', minify: false });

  assert.ok(raw.startsWith(ui.stylesheet({ minify: false })));
  assert.ok(raw.endsWith(presetCss('neumorphism')));
});

test('an unknown preset is an error that lists the real ones', () => {
  for (const preset of ['glass', 'ui', 'grain', '../ui', '', 42]) {
    assert.throws(
      () => ui.styles({ preset }),
      (error) => error instanceof TypeError && error.message.includes("'neumorphism'"),
      `preset: ${JSON.stringify(preset)}`,
    );
  }

  assert.throws(() => ui.stylesheet({ preset: 'glass' }), TypeError);
});

/* ------------------------------------------------------------------ *
 * What a preset has to be
 * ------------------------------------------------------------------ */

test('the Preset type names every preset, and nothing else', () => {
  const types = readFileSync(new URL('../src/ui/index.d.ts', import.meta.url), 'utf8');
  const declared = /export type Preset =([^\n]+)/.exec(types);

  assert.ok(declared, 'index.d.ts declares Preset');
  assert.deepEqual([...declared[1].matchAll(/'([^']+)'/g)].map((m) => m[1]).sort(), presets);
});

test('a preset and an extra never share a name', () => {
  // Both are resolved from one namespace — `/su/<name>-<hash>.css` — and
  // the extras are looked in first, so a clash would serve the wrong one.
  const extras = readdirSync(new URL('../src/ui-extras/', import.meta.url))
    .filter((file) => file.endsWith('.css'))
    .map((file) => file.slice(0, -'.css'.length));

  for (const name of presets) {
    assert.ok(!extras.includes(name), `${name} is both`);
    assert.notEqual(name, 'ui');
  }
});

for (const name of presets) {
  test(`${name}: the two dark blocks stay in step with each other`, () => {
    const css = presetCss(name);
    const attrStart = css.indexOf("\n[data-theme='dark']");
    const mediaStart = css.indexOf('@media (prefers-color-scheme: dark)');

    assert.ok(attrStart > 0 && mediaStart > 0, 'both blocks are there');
    assert.deepEqual(
      readTokens(css.slice(attrStart, css.indexOf('\n}', attrStart))),
      readTokens(css.slice(mediaStart, css.indexOf('\n  }', mediaStart))),
    );
  });

  test(`${name}: restates the shadows for dark, where the core's outrank :root`, () => {
    // The core's dark selectors are more specific than `:root`, so a
    // shadow set only there would lose to the core's in dark mode.
    const css = presetCss(name);
    const media = css.slice(css.indexOf('@media (prefers-color-scheme: dark)'));

    for (const token of ['--su-shadow-sm', '--su-shadow-md', '--su-shadow-lg']) {
      assert.ok(token in readTokens(media), `${token} is in the dark block`);
    }
  });

  test(`${name}: an input inside a group stays clear in every state it repaints`, () => {
    /*
     * With an adornment, the group is the well and the input sits in it
     * with no ground of its own. A preset that repaints a bare input in
     * some state — `:hover:not([disabled])` is (0,3,0) — outranks the
     * group's plain `.su-input-group .su-input`, and the input covers
     * the well the moment it is pointed at. So every such state has to
     * be cleared again under the group, by name.
     */
    const rules = [...presetCss(name).replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .map(([, selectors, body]) => ({
        selectors: selectors.split(/,(?![^(]*\))/).map((selector) => selector.trim()),
        body,
      }));
    const background = /background(?:-color)?\s*:\s*([^;]+)/;
    const states = rules
      .filter(({ body }) => background.test(body) && background.exec(body)[1].trim() !== 'transparent')
      .flatMap(({ selectors }) => selectors)
      .filter((selector) => /^\.su-input:/.test(selector));
    const cleared = new Set(
      rules
        .filter(({ body }) => background.exec(body)?.[1].trim() === 'transparent')
        .flatMap(({ selectors }) => selectors),
    );

    assert.ok(states.length > 0, 'the preset repaints the input in some state');

    for (const state of states) {
      assert.ok(cleared.has(`.su-input-group ${state}`), `${state} is not cleared inside .su-input-group`);
    }
  });

  test(`${name}: overrides every core rule that rounds an accordion header`, () => {
    /*
     * The core rounds a header only where it meets the accordion's
     * corners, with selectors that outrank a plain `summary`. A preset
     * that shapes its items differently has to name each one, or the
     * core's corners win on the headers they pick out.
     */
    const headers = (css) =>
      [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)]
        .filter(([, , body]) => /border-[a-z-]*radius/.test(body))
        .flatMap(([, selectors]) => selectors.split(/,(?![^(]*\))/).map((selector) => selector.trim()))
        .filter((selector) => /^\.su-accordion-item\b.*> summary$/.test(selector));
    const core = headers(ui.stylesheet({ minify: false }));
    const own = new Set(headers(presetCss(name)));

    if (!own.size) return;

    assert.ok(core.length > 0, 'the core rounds some headers');

    for (const selector of core) {
      assert.ok(own.has(selector), `${selector} is not restated`);
    }
  });

  test(`${name}: every palette still clears WCAG AA`, () => {
    /*
     * The preset's tokens laid over the core's, the way the cascade
     * resolves them, then held to the core's own contrast bar. A preset
     * that restyles surfaces moves every foreground's background with it.
     */
    const core = ui.stylesheet({ minify: false });
    const own = presetCss(name);
    const block = (css, start) => readTokens(css.slice(start, css.indexOf('\n}', start)));
    const media = (css) => readTokens(css.slice(css.indexOf('@media (prefers-color-scheme: dark)')));

    const light = { ...block(core, core.indexOf(':root {')), ...block(own, own.indexOf(':root {')) };
    const dark = { ...light, ...media(core), ...media(own) };

    for (const [theme, tokens] of [['light', light], ['dark', dark]]) {
      /*
       * What a background can show as. An opaque one is itself. A
       * translucent one — a glass pane, a tint — is whatever is under it
       * showing through, so it is measured laid over each colour of the
       * ground: the page's own, and any `-ground-N` a preset paints it
       * with. And over a pane on the ground, since a tint sits on one as
       * often as on the page. A blur only ever averages those colours,
       * so the worst of them is the worst the text will meet.
       */
      const grounds = [
        tokens['--su-bg'],
        ...Object.keys(tokens).filter((token) => /-ground-\d+$/.test(token)).map((token) => tokens[token]),
      ].map(parseColor);
      const pane = parseColor(tokens['--su-surface']);
      const under = [...grounds, ...grounds.map((ground) => composite(pane, ground))];
      const shows = (token) => {
        const color = parseColor(tokens[token]);

        assert.ok(color, `${theme} ${token} is a colour this test can read: ${tokens[token]}`);

        return color[3] === 1 ? [color] : under.map((ground) => composite(color, ground));
      };
      const worst = (foreground, background) => {
        const text = parseColor(tokens[foreground]);

        assert.equal(text?.[3], 1, `${theme} ${foreground} is an opaque colour: ${tokens[foreground]}`);

        return Math.min(...shows(background).map((color) => contrast(text, color)));
      };

      for (const foreground of ['--su-text', '--su-text-muted', '--su-text-subtle']) {
        for (const background of ['--su-surface', '--su-surface-2', '--su-bg']) {
          const ratio = worst(foreground, background);

          assert.ok(ratio >= 4.5, `${theme} ${foreground} on ${background} is ${ratio.toFixed(2)}:1`);
        }
      }

      for (const color of ['primary', 'neutral', 'success', 'warning', 'danger']) {
        for (const [foreground, background] of [
          [`--su-${color}-fg`, `--su-${color}`],
          // The solid fill runs from the base to this.
          [`--su-${color}-fg`, `--su-${color}-active`],
          [`--su-${color}-soft-fg`, `--su-${color}-soft`],
          [`--su-${color}-soft-fg`, '--su-surface'],
          [`--su-${color}`, '--su-surface'],
        ]) {
          const ratio = worst(foreground, background);

          assert.ok(
            ratio >= 4.5,
            `${theme} ${foreground} on ${background}: ${tokens[foreground]} on ${tokens[background]} is ${ratio.toFixed(2)}:1`,
          );
        }
      }
    }
  });
}
