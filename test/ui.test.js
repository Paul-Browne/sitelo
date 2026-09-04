import assert from 'node:assert/strict';
import { test } from 'node:test';

import * as ui from '../src/ui/index.js';
import defaultExport from '../src/ui/index.js';
import { attrs, parseArgs, space } from '../src/ui/internal.js';

/* ------------------------------------------------------------------ *
 * Calling convention
 * ------------------------------------------------------------------ */

test('parseArgs() merges props objects and flattens children', () => {
  const { props, children } = parseArgs([
    { a: 1 },
    'x',
    ['y', ['z']],
    { b: 2, a: 3 },
  ]);

  assert.deepEqual(props, { a: 3, b: 2 });
  assert.deepEqual(children, ['x', 'y', 'z']);
});

test('attrs() puts component classes first and appends caller styles', () => {
  assert.deepEqual(
    attrs({ class: 'mine', style: 'color: red', id: 'x' }, {
      class: 'su-btn',
      style: { gap: '1rem' },
    }),
    { id: 'x', class: 'su-btn mine', style: 'gap: 1rem; color: red' },
  );
});

test('space() maps tokens, numbers and raw lengths', () => {
  assert.equal(space('md'), 'var(--su-space-md)');
  assert.equal(space(3), 'calc(var(--su-space-unit) * 3)');
  assert.equal(space('3.5rem'), '3.5rem');
  assert.equal(space(undefined), undefined);
});

test('unknown props fall through to the element as attributes', () => {
  const html = ui.button({ 'data-testid': 'save', 'aria-keyshortcuts': 'Meta+S' }, 'Save');

  assert.match(html, /data-testid="save"/);
  assert.match(html, /aria-keyshortcuts="Meta\+S"/);
});

test('an unknown variant falls back instead of throwing', () => {
  assert.match(ui.button({ variant: 'nonsense' }, 'x'), /su-btn--solid/);
  assert.match(ui.button({ color: 'chartreuse' }, 'x'), /su-c-primary/);
});

/* ------------------------------------------------------------------ *
 * Button
 * ------------------------------------------------------------------ */

test('button() renders a <button> that does not submit by default', () => {
  assert.match(ui.button('Go'), /^<button type="button"/);
  assert.match(ui.button({ type: 'submit' }, 'Go'), /^<button type="submit"/);
});

test('button({ href }) renders an anchor, and disables it accessibly', () => {
  const html = ui.button({ href: '/docs', disabled: true }, 'Docs');

  assert.match(html, /^<a href="\/docs"/);
  assert.match(html, /aria-disabled="true"/);
  // `disabled` is not a valid attribute on an anchor.
  assert.ok(!/ disabled/.test(html));
});

test('button({ loading }) marks itself busy and shows a spinner', () => {
  const html = ui.button({ loading: true }, 'Saving');

  assert.match(html, /aria-busy="true"/);
  assert.match(html, /su-btn--loading/);
  assert.match(html, /su-spinner/);
});

test('iconButton() carries an accessible name', () => {
  const html = ui.iconButton({ label: 'Close', icon: '<svg></svg>' });

  assert.match(html, /aria-label="Close"/);
  assert.match(html, /su-icon-btn/);
});

/* ------------------------------------------------------------------ *
 * Forms
 * ------------------------------------------------------------------ */

test('textField() wires label, control, help and error together', () => {
  const html = ui.textField({
    label: 'Email',
    name: 'email',
    type: 'email',
    help: 'Never shared.',
    error: 'Required',
  });

  assert.match(html, /<label class="su-label" for="su-email"/);
  assert.match(html, /id="su-email"/);
  assert.match(html, /aria-describedby="su-email-help su-email-error"/);
  assert.match(html, /id="su-email-help"/);
  assert.match(html, /id="su-email-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /su-field--invalid/);
});

test('field ids are derived from the name, not a counter', () => {
  const first = ui.textField({ label: 'Email', name: 'email' });

  ui.textField({ label: 'Other', name: 'other' });

  assert.equal(ui.textField({ label: 'Email', name: 'email' }), first);
});

test('an explicit id wins over the derived one', () => {
  assert.match(ui.textField({ label: 'Email', name: 'email', id: 'custom' }), /for="custom"/);
});

test('select() renders options, optgroups, selection and a placeholder', () => {
  const html = ui.select({
    options: ['a', { value: 'b', label: 'Bee' }, { label: 'Group', options: ['c'] }],
    value: 'b',
    placeholder: 'Pick one',
  });

  assert.match(html, /<option value="" disabled>Pick one<\/option>/);
  assert.match(html, /<option value="b" selected>Bee<\/option>/);
  assert.match(html, /<optgroup label="Group"><option value="c">c<\/option><\/optgroup>/);
});

test('textarea() puts its value in the element content, not an attribute', () => {
  const html = ui.textarea({ value: 'hello' });

  assert.match(html, /<textarea[^>]*>hello<\/textarea>/);
  assert.ok(!/value="hello"/.test(html));
});

test('checkbox and toggle place the input before the styled box', () => {
  assert.match(ui.checkbox({ label: 'Ship', checked: true }), /<input type="checkbox" checked[^>]*><span class="su-check-box"/);
  assert.match(ui.toggle({ label: 'Dark' }), /role="switch"[^>]*><span class="su-switch-track"/);
});

test('choiceGroup() checks the selected option', () => {
  const html = ui.choiceGroup({ name: 'plan', options: ['free', 'pro'], value: 'pro' });

  assert.match(html, /role="radiogroup"/);
  assert.match(html, /<input type="radio" checked name="plan" value="pro">/);
});

/* ------------------------------------------------------------------ *
 * Data display
 * ------------------------------------------------------------------ */

test('avatar() falls back to initials', () => {
  assert.match(ui.avatar({ name: 'Paul Browne' }), />PB</);
  assert.match(ui.avatar({ src: '/p.jpg', alt: 'Paul' }), /<img src="\/p.jpg" alt="Paul">/);
});

test('avatarGroup({ max }) collapses the overflow into a count', () => {
  const html = ui.avatarGroup(
    { max: 2 },
    ui.avatar({ name: 'A A' }),
    ui.avatar({ name: 'B B' }),
    ui.avatar({ name: 'C C' }),
  );

  assert.match(html, />\+1</);
  assert.ok(!html.includes('>CC<'));
});

test('badge() clamps a count to max+', () => {
  assert.match(ui.badge({ content: 250, max: 99 }, 'x'), />99\+</);
  assert.match(ui.badge({ content: 5 }, 'x'), />5</);
});

test('table() builds head and body from columns and rows', () => {
  const html = ui.table({
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'n', header: 'Count', align: 'end' },
      { header: 'Link', render: (row) => `<a href="/${row.name}">open</a>` },
    ],
    rows: [{ name: 'a', n: 1 }],
    caption: 'Pages',
  });

  assert.match(html, /<div class="su-table-wrap">/);
  assert.match(html, /<caption>Pages<\/caption>/);
  assert.match(html, /<th scope="col">Name<\/th>/);
  assert.match(html, /<th scope="col" class="su-align-end">Count<\/th>/);
  assert.match(html, /<a href="\/a">open<\/a>/);
});

test('listItem({ href }) keeps the anchor inside the <li>', () => {
  assert.match(
    ui.listItem({ title: 'Routing', href: '/docs/routing' }),
    /^<li><a href="\/docs\/routing" class="su-list-item"/,
  );
});

/* ------------------------------------------------------------------ *
 * Feedback
 * ------------------------------------------------------------------ */

test('alert() announces urgent colors as alerts and the rest politely', () => {
  assert.match(ui.alert({ color: 'danger' }, 'x'), /role="alert"/);
  assert.match(ui.alert({ color: 'success' }, 'x'), /role="status"/);
  assert.ok(!ui.alert({ color: 'success', icon: false }, 'x').includes('<svg'));
});

test('progress() is indeterminate without a value and labelled with one', () => {
  assert.match(ui.progress(), /su-progress-bar--indeterminate/);

  const html = ui.progress({ value: 25, max: 50, showValue: true });

  assert.match(html, /aria-valuenow="25"/);
  assert.match(html, /aria-valuemax="50"/);
  assert.match(html, /--su-progress-value: 50%/);
  assert.match(html, />50%</);
});

test('progress() clamps a value outside its range', () => {
  assert.match(ui.progress({ value: 300 }), /--su-progress-value: 100%/);
  assert.match(ui.progress({ value: -5 }), /--su-progress-value: 0%/);
});

test('skeleton({ lines }) shortens the last line', () => {
  const html = ui.skeleton({ lines: 3 });

  assert.equal(html.match(/su-skeleton--text/g).length, 3);
  assert.equal(html.match(/width: 60%/g).length, 1);
});

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */

test('breadcrumbs() marks the last item as the current page', () => {
  const html = ui.breadcrumbs({
    items: [{ label: 'Home', href: '/' }, { label: 'Docs' }],
  });

  assert.match(html, /aria-current="page"/);
  assert.equal(html.match(/<a /g).length, 1);
});

test('pagination() windows the page numbers around the current one', () => {
  const html = ui.pagination({ page: 5, count: 12, href: (page) => `/blog/${page}` });
  const shown = [...html.matchAll(/aria-label="Page (\d+)"/g)].map((match) => Number(match[1]));

  assert.deepEqual(shown, [1, 4, 5, 6, 12]);
  assert.equal(html.match(/su-page-ellipsis/g).length, 2);
  assert.match(html, /href="\/blog\/4"[^>]*aria-label="Previous page"/);
});

test('pagination() disables the ends', () => {
  const first = ui.pagination({ page: 1, count: 3, href: (page) => `/${page}` });

  assert.match(first, /su-page-link--disabled[^>]*disabled[^>]*aria-label="Previous page"/);
  assert.ok(!/aria-label="Next page"[^>]*disabled/.test(first));
});

test('tabs() renders links when items have hrefs', () => {
  const html = ui.tabs({
    items: [{ label: 'Docs', href: '/docs', active: true }, { label: 'API', href: '/api' }],
  });

  assert.ok(!html.includes('role="tablist"'));
  assert.ok(!html.includes('data-su-tabs'));
  assert.match(html, /<a class="su-tab" href="\/docs" aria-current="page">/);
});

test('tabs() renders a tablist when items have panels', () => {
  const html = ui.tabs({
    items: [
      { id: 'a', label: 'A', panel: '<p>a</p>' },
      { id: 'b', label: 'B', panel: '<p>b</p>' },
    ],
    value: 'b',
  });

  assert.match(html, /data-su-tabs/);
  assert.match(html, /id="b-tab"[^>]*aria-selected="true"/);
  assert.match(html, /id="a-panel"[^>]*hidden/);
  assert.ok(!/id="b-panel"[^>]*hidden/.test(html));
});

/* ------------------------------------------------------------------ *
 * Overlays
 * ------------------------------------------------------------------ */

test('modal() uses the popover API and labels itself', () => {
  const html = ui.modal({ id: 'confirm', title: 'Sure?' }, 'Body');

  assert.match(html, /id="confirm" popover="auto" role="dialog" aria-modal="true"/);
  assert.match(html, /aria-labelledby="confirm-title"/);
  assert.match(html, /popovertarget="confirm" popovertargetaction="hide"/);
});

test('modal() and drawer() require an id', () => {
  assert.throws(() => ui.modal({}, 'x'), /needs an `id`/);
  assert.throws(() => ui.drawer({}, 'x'), /needs an `id`/);
});

test('accordion({ name }) makes the sections mutually exclusive', () => {
  const html = ui.accordion({
    name: 'faq',
    items: [{ title: 'A', content: '1', open: true }, { title: 'B', content: '2' }],
  });

  assert.equal(html.match(/name="faq"/g).length, 2);
  assert.equal(html.match(/<details open/g).length, 1);
});

test('menu() is a details element that works without script', () => {
  const html = ui.menu({ trigger: 'More' }, ui.menuItem({ href: '/a' }, 'Edit'));

  assert.match(html, /^<details class="su-menu"/);
  assert.match(html, /<summary aria-haspopup="menu">More<\/summary>/);
  assert.match(html, /<li role="none"><a href="\/a" role="menuitem"/);
});

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

test('stylesheet() minifies without unbalancing the CSS', () => {
  const minified = ui.stylesheet();
  const raw = ui.stylesheet({ minify: false });

  // Comments can themselves contain braces, so compare against the raw
  // sheet with its comments already removed.
  const rawRules = raw.replace(/\/\*[\s\S]*?\*\//g, '');

  assert.ok(minified.length < raw.length);
  assert.ok(!minified.includes('/*'));
  assert.equal((minified.match(/{/g) || []).length, (rawRules.match(/{/g) || []).length);
  assert.equal((minified.match(/{/g) || []).length, (minified.match(/}/g) || []).length);

  for (const selector of ['.su-btn', '.su-card', '.su-modal', '.su-c-primary', '--su-primary']) {
    assert.ok(minified.includes(selector), `${selector} survived minification`);
  }
});

test('styles() emits a style element that cannot close itself early', () => {
  const html = ui.styles();

  assert.match(html, /^<style data-sitelo-ui="">/);
  assert.match(html, /<\/style>$/);
  assert.equal(html.match(/<\/style>/g).length, 1);
});

test('theme() maps camelCase keys and palette objects to custom properties', () => {
  const html = ui.theme({
    primary: { base: '#f00', softFg: '#900' },
    radiusMd: '2px',
    '--custom': 'x',
  });

  assert.match(html, /--su-primary: #f00/);
  assert.match(html, /--su-primary-soft-fg: #900/);
  assert.match(html, /--su-radius-md: 2px/);
  assert.match(html, /--custom: x/);
});

test('theme({ dark }) covers both the attribute and the media query', () => {
  const html = ui.theme({}, { dark: { primary: '#0f0' } });

  assert.match(html, /\[data-theme='dark'\]/);
  assert.match(html, /\[data-su-theme='dark'\]/);
  assert.match(html, /@media \(prefers-color-scheme: dark\)/);
});

test('theme() strips markup from token values', () => {
  assert.ok(!ui.theme({ primary: '</style><script>alert(1)</script>' }).includes('</style><script>'));
  assert.equal(ui.theme().length, 0);
});

test('themeScript() is self-contained and survives storage being blocked', () => {
  assert.match(ui.themeScript(), /^<script>.*<\/script>$/);
  assert.match(ui.themeScript(), /catch\(e\)\{\}/);
  assert.match(ui.themeScript({ nonce: 'abc' }), /<script nonce="abc">/);
});

/* ------------------------------------------------------------------ *
 * Public surface
 * ------------------------------------------------------------------ */

test('every export is a function returning a string of HTML', () => {
  const names = Object.keys(ui).filter((name) => name !== 'default');

  assert.ok(names.length > 50);

  for (const name of names) {
    assert.equal(typeof ui[name], 'function', `${name} is callable`);
    assert.equal(typeof defaultExport[name], 'function', `${name} is on the default export`);
  }
});

test('components escape quotes in attribute values', () => {
  const html = ui.chip({ title: 'a "quoted" value' }, 'x');

  assert.ok(!html.includes('"quoted"'));
  assert.match(html, /&#34;quoted&#34;/);
});
