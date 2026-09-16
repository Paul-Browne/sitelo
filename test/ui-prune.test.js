import assert from 'node:assert/strict';
import { test } from 'node:test';

import { classesIn, pruneCss } from '../src/ui/prune.js';
import { minifyCss } from '../src/ui/sheet.js';
import { stylesheet } from '../src/ui/styles.js';

/** A predicate over exactly these class names. */
const only = (...names) => (className) => names.includes(className);

test('a rule whose class no page carries is dropped', () => {
  const css = '.su-a{color:red}.su-b{color:blue}';

  assert.equal(pruneCss(css, only('su-a')), '.su-a{color:red}');
});

test('a rule with no su- class is always kept', () => {
  // Tokens, resets and element rules are not the library's to gate.
  const css = ':root{--x:1}body{margin:0}[data-theme]{color:red}.other{a:b}';

  assert.equal(pruneCss(css, () => false), css);
});

test('a compound selector needs every class it names', () => {
  const css = '.su-card .su-btn{color:red}';

  assert.equal(pruneCss(css, only('su-card')), '');
  assert.equal(pruneCss(css, only('su-card', 'su-btn')), css);
});

test('a selector list keeps the selectors that can match', () => {
  assert.equal(
    pruneCss('.su-a,.su-b,.su-c{x:y}', only('su-b')),
    '.su-b{x:y}',
  );
  // And the readable sheet's separator, when that is what it used.
  assert.equal(
    pruneCss('.su-a,\n.su-b,\n.su-c {\n  x: y;\n}\n', only('su-a', 'su-c')),
    '.su-a,\n.su-c {\n  x: y;\n}\n',
  );
});

test(':not() does not ask for its class to be present', () => {
  const css = '.su-a:not(.su-b){x:y}';

  assert.equal(pruneCss(css, only('su-a')), css);
  assert.equal(pruneCss(css, only('su-b')), '');
});

test(':has() and :is() need one of their arguments to match', () => {
  assert.equal(pruneCss('html:has(.su-a){x:y}', only('su-b')), '');
  assert.equal(pruneCss('html:has(.su-a){x:y}', only('su-a')), 'html:has(.su-a){x:y}');
  assert.equal(pruneCss('.su-a:is(.su-b,.su-c){x:y}', only('su-a', 'su-c')), '.su-a:is(.su-b,.su-c){x:y}');
  assert.equal(pruneCss('.su-a:is(.su-b,.su-c){x:y}', only('su-a')), '');
  // Nested, with the combinator the tabs use.
  assert.equal(pruneCss('.su-a:not(:has(> .su-b:target)){x:y}', only('su-a')), '.su-a:not(:has(> .su-b:target)){x:y}');
});

test('a class inside a string is not a class', () => {
  const css = "[class*='.su-a']{x:y}.su-b::after{content:'.su-c'}";

  assert.equal(pruneCss(css, only('su-b')), css);
});

test('a media query goes when nothing is left inside it', () => {
  const css = '@media (min-width:1px){.su-a{x:y}.su-b{x:y}}@media print{.su-b{x:y}}';

  assert.equal(pruneCss(css, only('su-a')), '@media (min-width:1px){.su-a{x:y}}');
  assert.equal(pruneCss(css, only('su-b')), '@media (min-width:1px){.su-b{x:y}}@media print{.su-b{x:y}}');
});

test('@keyframes stays while a surviving rule names it', () => {
  const css = '@keyframes su-spin{to{rotate:1turn}}.su-a{animation:su-spin 1s}.su-b{animation:su-spinner 1s}';

  assert.equal(pruneCss(css, only('su-a')), '@keyframes su-spin{to{rotate:1turn}}.su-a{animation:su-spin 1s}');
  // `su-spinner` is not `su-spin`.
  assert.equal(pruneCss(css, only('su-b')), '.su-b{animation:su-spinner 1s}');
});

test('a comment leaves with its rule, and stays with a kept one', () => {
  const css = '/* header */\n\n/* a */\n.su-a {\n  x: y;\n}\n\n/* b */\n.su-b {\n  x: y;\n}\n';

  assert.equal(pruneCss(css, only('su-b')), '\n\n/* b */\n.su-b {\n  x: y;\n}\n');
  assert.equal(pruneCss(css, only('su-a')), '/* header */\n\n/* a */\n.su-a {\n  x: y;\n}\n');
});

test('statements and opaque at-rules pass through', () => {
  const css = '@charset "utf-8";@font-face{font-family:x}@layer a{.su-a{x:y}}';

  assert.equal(pruneCss(css, () => false), '@charset "utf-8";@font-face{font-family:x}');
});

test('the whole sheet survives a site that uses everything', () => {
  for (const css of [stylesheet(), stylesheet({ minify: false })]) {
    assert.equal(pruneCss(css, () => true), css);
  }
});

test('the real sheet is parsed the way the minifier reads it', () => {
  // Pruning nothing from the readable sheet, then minifying, should be
  // the minified sheet: a parse that lost or moved a byte would show here.
  const pruned = pruneCss(stylesheet({ minify: false }), () => true);

  assert.equal(minifyCss(pruned), stylesheet());
});

test('a site that uses nothing keeps the tokens and the base', () => {
  const css = pruneCss(stylesheet(), () => false);

  assert.match(css, /^:root\{--su-space-unit/);
  assert.match(css, /\[data-su-theme='dark'\]/);
  assert.doesNotMatch(css, /\.su-btn/);
  assert.doesNotMatch(css, /@keyframes/);
  assert.ok(css.length < stylesheet().length / 5, 'most of the sheet is gone');
});

/* ------------------------------------------------------------------ *
 * classesIn
 * ------------------------------------------------------------------ */

test('classesIn finds a class wherever it sits', () => {
  const has = classesIn([
    '<div class="su-card su-card--flat">',
    "el.className = 'su-alert'",
  ]);

  for (const name of ['su-card', 'su-card--flat', 'su-alert']) assert.ok(has(name), name);
  assert.ok(!has('su-btn'));
  assert.ok(!has('su-car'), 'a token is whole');
});

test('a template prefix stands for every class starting with it', () => {
  // What the toast and steps runtimes build: `su-c-${color}`.
  const has = classesIn(['node.className = `su-alert su-c-${color}`']);

  assert.ok(has('su-c-primary'));
  assert.ok(has('su-c-danger'));
  assert.ok(has('su-alert'));
  assert.ok(!has('su-cta'), 'a prefix is a prefix, not a stem');
});

test('keep names classes the scan cannot see', () => {
  const has = classesIn([''], ['su-card', 'su-btn*']);

  assert.ok(has('su-card'));
  assert.ok(has('su-btn--soft'));
  assert.ok(!has('su-card-body'));
});
