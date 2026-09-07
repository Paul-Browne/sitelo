import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import * as ui from '../src/ui/index.js';
import defaultExport from '../src/ui/index.js';
import { configureUiClient, RUNTIME_MODULES } from '../src/ui/handlers.js';
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

test('a labelled badge uses hidden text, not aria-label on a bare span', () => {
  // aria-label is only valid on an element with a role, and a badge is a span.
  const html = ui.badge({ content: 4, label: '4 unread messages' }, 'x');

  assert.ok(!html.includes('aria-label'));
  assert.match(html, /<span class="su-visually-hidden">4 unread messages<\/span>/);
  assert.match(html, /<span aria-hidden="true">4<\/span>/);

  // An unlabelled dot carries no meaning, so it stays out of the tree.
  assert.match(ui.badge({ dot: true }, 'x'), /su-badge--dot[^>]*aria-hidden="true"/);
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

test('progress() is indeterminate without a value', () => {
  assert.match(ui.progress(), /su-progress-bar--indeterminate/);
});

test('progress() exposes its value only once it has a name', () => {
  const html = ui.progress({ value: 25, max: 50, showValue: true, label: 'Building' });

  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-label="Building"/);
  assert.match(html, /aria-valuenow="25"/);
  assert.match(html, /aria-valuemax="50"/);
  assert.match(html, /--su-progress-value: 50%/);
  assert.match(html, />50%</);
});

test('an unlabelled progress bar is decoration, not a nameless progressbar', () => {
  // A progressbar role with no accessible name is invalid and tells a
  // screen reader nothing, so the bar opts out of the tree entirely.
  const html = ui.progress({ value: 25 });

  assert.match(html, /aria-hidden="true"/);
  assert.ok(!html.includes('role="progressbar"'));
  assert.match(html, /--su-progress-value: 25%/);
});

test('progress() treats an unusable value as indeterminate', () => {
  // Coercing these produced aria-valuenow="NaN" and a width of NaN%.
  for (const value of ['abc', Number.NaN, Number.POSITIVE_INFINITY]) {
    const html = ui.progress({ value, label: 'Building' });

    assert.ok(!html.includes('NaN'), `${String(value)} does not leak NaN`);
    assert.match(html, /su-progress-bar--indeterminate/);
  }

  assert.ok(!ui.progress({ value: 5, max: 'x', label: 'B' }).includes('NaN'), 'a bad max is ignored');
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

  assert.match(html, /role="tablist"/);
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

test('the menu trigger is the summary, not a button inside it', () => {
  // A <summary> is already interactive; nesting a <button> in one is
  // invalid and gives a single action two tab stops.
  const html = ui.menu({ trigger: 'Actions', variant: 'soft' }, ui.menuItem('Edit'));
  const [, summary] = /<summary\b([\s\S]*?)<\/summary>/.exec(html);

  assert.ok(!/<(button|a|input|select|textarea)\b/.test(summary), 'no control nested in the summary');
  assert.match(html, /<summary class="su-btn su-btn--soft su-btn--md su-c-neutral"/);
  assert.match(html, /<span class="su-btn-label">Actions<\/span>/);
});

test('an icon-only menu trigger carries an accessible name', () => {
  const html = ui.menu({ icon: '<svg></svg>', label: 'More actions' }, ui.menuItem('Rename'));

  assert.match(html, /aria-label="More actions"/);
  assert.match(html, /su-icon-btn/);
  assert.ok(!html.includes('su-btn-label'), 'no empty label span');
});

/* -------------------------------------------------------------- *
 * Prose, empty, toggles, slider, aspect ratio, figure, collapsible
 * -------------------------------------------------------------- */

test('code({ text }) escapes, while children still render as HTML', () => {
  // Children are markup by design — that is how pre-highlighted output
  // works. `text` is the opt-in for showing a tag rather than building it.
  assert.equal(
    ui.code({ text: '<h1>Hello</h1>' }),
    '<code class="su-code">&lt;h1&gt;Hello&lt;/h1&gt;</code>',
  );

  assert.equal(
    ui.code('<span class="tok">const</span>'),
    '<code class="su-code"><span class="tok">const</span></code>',
  );

  // ampersands escape first, so nothing is double-encoded
  assert.match(ui.code({ text: 'a && b < c' }), />a &amp;&amp; b &lt; c</);
  assert.match(ui.inlineCode({ text: '<em>x</em>' }), /&lt;em&gt;/);

  // other props still reach the element
  assert.match(ui.code({ text: 'x', id: 'c1' }), /<code id="c1" class="su-code">/);
});

test('prose() only styles inside its own wrapper', () => {
  const css = ui.stylesheet({ minify: false });
  const proseRules = css.split('\n').filter((line) => line.includes('.su-prose') && line.includes('{'));

  assert.ok(proseRules.length > 10, 'prose has rules');

  for (const rule of proseRules) {
    assert.ok(rule.trimStart().startsWith('.su-prose'), `scoped to the wrapper: ${rule.trim()}`);
  }

  // and it leaves sitelo-ui components inside it alone
  for (const rule of proseRules.filter((r) => r.includes(':where('))) {
    assert.match(rule, /:not\(\[class\*='su-'\]\)/, `component-safe: ${rule.trim()}`);
  }

  assert.match(ui.prose('<h2>x</h2>'), /^<div class="su-prose"><h2>x<\/h2><\/div>$/);
  assert.match(ui.prose({ size: 'lg' }, 'x'), /su-prose--lg/);
});

test('empty() renders only the parts it was given', () => {
  const bare = ui.empty({ title: 'No posts' });

  assert.match(bare, /su-empty-title/);
  assert.ok(!bare.includes('su-empty-icon'));
  assert.ok(!bare.includes('su-empty-description'));
  assert.ok(!bare.includes('su-empty-actions'), 'no empty action row');

  const full = ui.empty({ icon: '<svg></svg>', title: 'T', description: 'D' }, '<button></button>');

  assert.match(full, /su-empty-icon" aria-hidden="true"/, 'the icon is decoration');
  assert.match(full, /su-empty-actions/);
});

test('toggleButton() carries its state in aria-pressed', () => {
  assert.match(ui.toggleButton({ pressed: true }, 'Bold'), /aria-pressed="true"/);
  assert.match(ui.toggleButton('Bold'), /aria-pressed="false"/);
  assert.match(ui.toggleButton('Bold'), /su-toggle-btn/);
});

test('toggleGroup() uses aria-current for links and aria-pressed for buttons', () => {
  const buttons = ui.toggleGroup({
    label: 'Alignment',
    value: 'center',
    items: ['left', 'center', 'right'],
  });

  // A radiogroup would be wrong here: these are pressed buttons, not radios.
  assert.match(buttons, /role="group"/);
  assert.ok(!buttons.includes('radiogroup'));
  assert.equal((buttons.match(/aria-pressed="true"/g) || []).length, 1);

  const links = ui.toggleGroup({
    value: 'ui',
    items: [
      { value: 'docs', label: 'Docs', href: '/docs' },
      { value: 'ui', label: 'UI', href: '/ui' },
    ],
  });

  assert.match(links, /<a href="\/ui" aria-current="page"/);
  assert.ok(!links.includes('aria-pressed'), 'a link is not a pressed button');

  const many = ui.toggleGroup({ value: ['a', 'b'], items: ['a', 'b', 'c'] });

  assert.equal((many.match(/aria-pressed="true"/g) || []).length, 2);
});

test('slider() is a native range input', () => {
  const html = ui.slider({ min: 0, max: 10, step: 2, value: 4 });

  assert.match(html, /<input type="range" min="0" max="10" step="2" value="4"/);
  assert.ok(!html.includes('su-slider-output'), 'no readout unless asked for');

  const withValue = ui.sliderField({ label: 'Quality', name: 'quality', value: 70, showValue: true });

  assert.match(withValue, /<output class="su-slider-output" for="su-quality">70<\/output>/);
  assert.match(withValue, /<label class="su-label" for="su-quality"/);
});

test('aspectRatio() and figure() hold their space before the image loads', () => {
  assert.match(ui.aspectRatio({ ratio: '4 / 3' }, 'x'), /style="--su-aspect: 4 \/ 3"/);

  const fig = ui.figure({ src: '/a.jpg', alt: 'A', caption: 'C', ratio: '16 / 9' });

  assert.match(fig, /^<figure class="su-figure">/);
  assert.match(fig, /--su-aspect: 16 \/ 9/);
  assert.match(fig, /<figcaption class="su-figure-caption">C<\/figcaption>/);
  assert.match(fig, /alt="A"/);

  // alt is never omitted, even when not given
  assert.match(ui.figure({ src: '/a.jpg' }), /alt=""/);
});

test('collapsible() puts nothing interactive in its summary', () => {
  const html = ui.collapsible({ trigger: 'Show more', open: true }, '<p>body</p>');
  const [, summary] = /<summary\b([\s\S]*?)<\/summary>/.exec(html);

  assert.ok(!/<(button|a|input|select|textarea)\b/.test(summary));
  assert.match(html, /^<details open class="su-collapsible">/);
  assert.match(html, /su-collapsible-content/);
});

/* -------------------------------------------------------------- *
 * Page sections
 * -------------------------------------------------------------- */

test('hero() renders only the parts it was given', () => {
  const bare = ui.hero({ title: 'Hello' });

  assert.match(bare, /^<section class="su-hero su-hero--center">/);
  assert.match(bare, /<h1 class="su-hero-title">Hello<\/h1>/);
  assert.ok(!bare.includes('su-hero-eyebrow'));
  assert.ok(!bare.includes('su-hero-actions'), 'no empty action row');
  assert.ok(!bare.includes('su-hero-media'));

  const full = ui.hero({ eyebrow: 'v2', title: 'T', description: 'D', media: '<img alt="">' }, '<button></button>');

  assert.match(full, /su-hero--split/, 'media switches on the two-column layout');
  assert.match(full, /su-hero-actions/);
});

test('hero() titles the page by default, and defers when asked', () => {
  // A hero is usually the h1 — but not one sitting part way down a page.
  assert.match(ui.hero({ title: 'T' }), /<h1 class="su-hero-title">/);
  assert.match(ui.hero({ level: 2, title: 'T' }), /<h2 class="su-hero-title">/);
  assert.match(ui.hero({ level: 9, title: 'T' }), /<h6 class="su-hero-title">/, 'clamped');
});

test('footerBottom spans every column', () => {
  const css = ui.stylesheet({ minify: false });

  assert.match(css, /\.su-footer-bottom \{[^}]*grid-column: 1 \/ -1/, 'whatever the grid is doing');

  const html = ui.footer(
    ui.footerColumn({ title: 'Docs' }, '<a href="/docs">Guide</a>'),
    ui.footerBottom('© 2026'),
  );

  assert.match(html, /^<footer class="su-footer">/);
  assert.match(html, /<ul class="su-footer-links"><li><a href="\/docs">Guide<\/a><\/li><\/ul>/);
});

test('steps() marks what is done, what is current, and what is next', () => {
  const html = ui.steps({
    current: 1,
    items: [{ title: 'Install' }, { title: 'Write' }, { title: 'Build' }],
  });

  assert.match(html, /su-step--complete/);
  assert.match(html, /su-step--current[^>]*aria-current="step"/);
  assert.match(html, /su-step--upcoming/);
  assert.equal((html.match(/aria-current="step"/g) || []).length, 1);

  // a tick reads faster than a number for something already done, and it
  // is drawn rather than typed so its weight matches the digits beside it
  assert.match(html, /su-step-marker" aria-hidden="true"><svg/);
  assert.ok(!html.includes('✓'), 'no glyph tick');
  assert.match(html, /su-step-marker" aria-hidden="true">2</);

  // first step: nothing complete yet
  assert.ok(!ui.steps({ current: 0, items: ['a', 'b'] }).includes('su-step--complete'));
});

test('timeline() builds from items or from children', () => {
  const fromItems = ui.timeline({ items: [{ time: '2026', title: 'v2' }] });
  const fromChildren = ui.timeline(ui.timelineItem({ time: '2026', title: 'v2' }));

  assert.equal(fromItems, fromChildren, 'both paths render the same entry');
  assert.match(fromItems, /^<ol class="su-timeline">/);
  assert.match(fromItems, /su-timeline-marker" aria-hidden="true"/, 'the marker is decoration');
});

test('mockup() frames are decoration, not content', () => {
  const browser = ui.mockup({ variant: 'browser', url: 'sitelo.dev' }, '<p>page</p>');

  assert.match(browser, /su-mockup--browser/);
  assert.match(browser, /su-mockup-url">sitelo.dev</);
  assert.match(browser, /su-mockup-dots" aria-hidden="true"/);
  assert.match(browser, /<p>page<\/p>/);

  // a phone has a notch and no address bar; a window has a bar and no url
  assert.match(ui.mockup({ variant: 'phone' }), /su-mockup-notch" aria-hidden="true"/);
  assert.ok(!ui.mockup({ variant: 'phone' }).includes('su-mockup-bar'));
  assert.ok(!ui.mockup({ variant: 'window' }).includes('su-mockup-url'));
  assert.match(ui.mockup({ variant: 'nonsense' }), /su-mockup--browser/, 'unknown variant falls back');
});

/* -------------------------------------------------------------- *
 * The contract between a component's event attribute and the module
 * it imports
 *
 * The runtime needs a DOM, so its behaviour is exercised in a browser
 * rather than here. What these lock down is the seam: the URL each
 * handler names, and the export it calls on the other side. That is
 * where the two have actually drifted apart before.
 * -------------------------------------------------------------- */

/** @param {string} name @returns {string} */
function runtimeSource(name) {
  return readFileSync(
    fileURLToPath(new URL(`../src/ui/runtime/${name}.js`, import.meta.url)),
    'utf8',
  );
}

/** Every `import('…/x.js').then(m=>m.call(…))` in a piece of markup. */
function handlersIn(html) {
  return [...html.matchAll(/import\('([^']+)'\)\.then\(m=>m\.([A-Za-z]+)\(([^)]*)\)\)/g)].map(
    ([whole, url, call, args]) => ({ whole, url, call, args }),
  );
}

/** One rendering of each component that wires itself to a module. */
const WIRED = [
  ['tabs', ui.tabs({ items: [{ id: 'a', label: 'A', panel: 'x' }] })],
  ['alert', ui.alert({ dismissible: true }, 'x')],
  ['themeToggle', ui.themeToggle()],
  ['menu', ui.menu({ trigger: 'x' }, ui.menuItem('y'))],
];

test('every module a handler imports exports the function it calls', () => {
  for (const [name, html] of WIRED) {
    const handlers = handlersIn(html);

    assert.ok(handlers.length > 0, `${name}() renders at least one inline import`);

    for (const { url, call } of handlers) {
      const module = /^\/su\/([a-z]+)\.js$/.exec(url)?.[1];

      assert.ok(module, `${name}() imports from ${url}, which is under the served base`);
      assert.ok(RUNTIME_MODULES.includes(module), `${module} is a module the plugin serves`);
      assert.match(
        runtimeSource(module),
        new RegExp(`export function ${call}\\b`),
        `${module}.js exports ${call}(), which ${name}() calls`,
      );
    }
  }
});

test('handlers are valid JavaScript and never break out of the attribute', () => {
  for (const [name, html] of WIRED) {
    for (const value of html.matchAll(/ on[a-z]+="([^"]*)"/g)) {
      const body = value[1];

      // javascript-to-html escapes `"` as `&#34;`, which would be an
      // entity inside a script rather than a quote — the handler has to
      // hold together without any.
      assert.ok(!body.includes('&#'), `${name}()'s handler needs no escaping`);
      assert.doesNotThrow(
        () => new Function('event', body),
        `${name}()'s handler parses`,
      );
    }
  }
});

test('no component asks the page to load a script', () => {
  // The whole point of the inline imports: a page that imports nothing
  // still gets working tabs, alerts, menus and theme toggle.
  for (const [name, html] of WIRED) {
    assert.ok(!html.includes('<script'), `${name}() renders no script tag`);
  }
});

test('RUNTIME_MODULES lists exactly what is in runtime/', () => {
  // The plugin serves this list and nothing else; a module added to the
  // directory but not the list would 404 on first click.
  const onDisk = readdirSync(fileURLToPath(new URL('../src/ui/runtime', import.meta.url)))
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.slice(0, -'.js'.length))
    .sort();

  assert.deepEqual([...RUNTIME_MODULES].sort(), onDisk);
});

test('runtime modules stand alone', () => {
  // They are copied into the build one file at a time, by name — an
  // import between them would resolve to a file that was never copied.
  for (const name of RUNTIME_MODULES) {
    assert.ok(
      !/^\s*import\s/m.test(runtimeSource(name)),
      `${name}.js imports nothing`,
    );
  }
});

test('configureUiClient() moves every handler to the new base', () => {
  try {
    configureUiClient({ base: '/assets/su' });

    const html = ui.alert({ dismissible: true }, 'x');

    assert.match(html, /import\('\/assets\/su\/alert\.js'\)/);
  } finally {
    configureUiClient({ base: null });
  }
});

test('the toasts region id is the one toast() looks up', () => {
  // toast() bails out entirely when getElementById misses.
  const id = /getElementById\('([^']+)'\)/.exec(runtimeSource('toast'))?.[1];

  assert.equal(id, 'su-toasts');
  assert.match(ui.toasts(), new RegExp(`id="${id}"`));
});

test('the dismiss fallback selector matches something a component renders', () => {
  // This is the guard that would have caught `.su-toast`, a class the
  // script closed on and nothing ever rendered.
  const selector = /closest\('([^']+)'\)/.exec(runtimeSource('alert'))?.[1];

  assert.ok(selector, 'the fallback selector was found in alert.js');
  assert.match(selector, /^\.[a-z-]+$/, `${selector} is a plain class selector`);
  assert.match(
    ui.alert({ dismissible: true }, 'x'),
    new RegExp(`class="[^"]*\\b${selector.slice(1)}\\b`),
    `${selector} matches the markup a dismiss button sits in`,
  );
});

test('each tab points at a panel that exists, and one panel is visible', () => {
  // The client resolves aria-controls with getElementById; a mismatch
  // would leave every panel hidden.
  const html = ui.tabs({
    value: 'b',
    items: [
      { id: 'a', label: 'A', panel: 'PA' },
      { id: 'b', label: 'B', panel: 'PB' },
      { id: 'c', label: 'C', panel: 'PC' },
    ],
  });

  const controls = [...html.matchAll(/aria-controls="([^"]+)"/g)].map((m) => m[1]);
  const panelIds = [...html.matchAll(/id="([^"]+)" role="tabpanel"/g)].map((m) => m[1]);

  assert.equal(controls.length, 3);
  assert.deepEqual(controls, panelIds);

  const panels = [...html.matchAll(/role="tabpanel"[^>]*>/g)].map((m) => m[0]);

  assert.equal(panels.filter((p) => !p.includes('hidden')).length, 1, 'exactly one visible panel');
  assert.equal((html.match(/aria-selected="true"/g) || []).length, 1, 'exactly one selected tab');
});

test('menu() is a details element that works without script', () => {
  const html = ui.menu({ trigger: 'More' }, ui.menuItem({ href: '/a' }, 'Edit'));

  assert.match(html, /^<details ontoggle="[^"]+" class="su-menu"/);
  assert.match(html, /aria-haspopup="menu"/);
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

/**
 * Relative luminance, per WCAG 2.
 * @param {[number, number, number]} rgb
 * @returns {number}
 */
function luminance(rgb) {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** @param {string} value @returns {[number, number, number] | null} */
function parseHex(value) {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());

  if (!match) return null;

  const int = Number.parseInt(match[1], 16);

  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** @returns {number} */
function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

/** Custom properties declared in one block of the sheet. */
function readTokens(block) {
  const tokens = {};

  for (const [, name, value] of block.matchAll(/(--su-[a-z0-9-]+):\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }

  return tokens;
}

test('the two dark blocks stay in step with each other', () => {
  const css = ui.stylesheet({ minify: false });

  /*
   * The dark tokens are written out twice — once for `data-theme`, once
   * for the media query — because plain CSS cannot share a declaration
   * block between a selector and an `@media`. Nothing in the language
   * keeps the copies equal, and the contrast test below reads only the
   * media one, so a token added to that copy alone would ship a
   * `data-theme="dark"` palette that no test has ever looked at.
   */
  const attrStart = css.indexOf("\n[data-theme='dark']");
  const attribute = readTokens(css.slice(attrStart, css.indexOf('\n}', attrStart)));

  const mediaStart = css.indexOf('@media (prefers-color-scheme: dark)');
  const media = readTokens(css.slice(mediaStart, css.indexOf('\n  }', mediaStart)));

  assert.ok(Object.keys(attribute).length > 40, 'the attribute block was found');
  assert.ok(Object.keys(media).length > 40, 'the media block was found');

  assert.deepEqual(
    attribute,
    media,
    'data-theme dark and prefers-color-scheme dark declare the same tokens',
  );
});

test('every palette clears WCAG AA against the surface it sits on', () => {
  const css = ui.stylesheet({ minify: false });

  /*
   * Anchored on block boundaries rather than on the exact selector text,
   * which is a detail the sheet is allowed to change — an earlier version
   * of this test broke the moment the dark selector gained a `:not()`.
   */
  const rootStart = css.indexOf(':root {');
  const light = readTokens(css.slice(rootStart, css.indexOf('\n}', rootStart)));
  const dark = {
    ...light,
    // The media query carries the full dark palette, and always exists.
    ...readTokens(css.slice(css.indexOf('@media (prefers-color-scheme: dark)'))),
  };

  assert.ok(Object.keys(light).length > 40, 'light tokens were found');
  assert.notEqual(light['--su-primary'], dark['--su-primary'], 'dark tokens differ');

  for (const [theme, tokens] of [['light', light], ['dark', dark]]) {
    // Body text, on both surfaces it is ever set against.
    for (const [what, foreground] of [
      ['body text', '--su-text'],
      ['muted text', '--su-text-muted'],
      ['subtle text', '--su-text-subtle'],
    ]) {
      for (const background of ['--su-surface', '--su-surface-2', '--su-bg']) {
        const ratio = contrast(parseHex(tokens[foreground]), parseHex(tokens[background]));

        assert.ok(
          ratio >= 4.5,
          `${theme} ${what} on ${background}: ${tokens[foreground]} on ${tokens[background]} is ${ratio.toFixed(2)}:1, below 4.5:1`,
        );
      }
    }

    for (const color of ['primary', 'neutral', 'success', 'warning', 'danger']) {
      const pairs = [
        ['solid button', `--su-${color}-fg`, `--su-${color}`],
        ['soft button', `--su-${color}-soft-fg`, `--su-${color}-soft`],
        ['outline, ghost and link text', `--su-${color}-soft-fg`, '--su-surface'],
        ['link colour on a surface', `--su-${color}`, '--su-surface'],
      ];

      for (const [what, foreground, background] of pairs) {
        const fg = parseHex(tokens[foreground]);
        const bg = parseHex(tokens[background]);

        assert.ok(fg, `${theme} ${foreground} is a hex colour`);
        assert.ok(bg, `${theme} ${background} is a hex colour`);

        const ratio = contrast(fg, bg);

        assert.ok(
          ratio >= 4.5,
          `${theme} ${color} ${what}: ${tokens[foreground]} on ${tokens[background]} is ${ratio.toFixed(2)}:1, below 4.5:1`,
        );
      }
    }
  }
});

test('stylesheet() picks up an edit to ui.css instead of serving a stale copy', async () => {
  // A build reads the sheet once; a dev server outlives edits to it. This
  // is the bug where a running server kept serving the old palette.
  const { readFileSync, writeFileSync } = await import('node:fs');
  const cssPath = fileURLToPath(new URL('../src/ui/ui.css', import.meta.url));
  const original = readFileSync(cssPath, 'utf8');

  assert.ok(original.includes('--su-primary:'), 'the token exists to edit');

  try {
    assert.ok(ui.stylesheet().includes('--su-primary'), 'reads before the edit');

    writeFileSync(
      cssPath,
      original.replace('--su-primary:', '--su-canary-token: #abcdef;\n  --su-primary:'),
    );

    assert.match(
      ui.stylesheet(),
      /--su-canary-token/,
      'the edit is visible to the next call',
    );
  } finally {
    writeFileSync(cssPath, original);
  }

  assert.ok(!ui.stylesheet().includes('--su-canary-token'), 'and so is the revert');
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
 * Icons
 * ------------------------------------------------------------------ */

test('icon() renders an inline svg that inherits colour and size', () => {
  const html = ui.icon('check');

  assert.match(html, /^<svg /);
  assert.match(html, /viewBox="0 0 24 24"/);
  assert.match(html, /stroke="currentColor"/);
  assert.match(html, /class="su-icon"/);
});

test('icon() is hidden from assistive tech unless it is given a label', () => {
  assert.match(ui.icon('check'), /aria-hidden="true"/);

  const labelled = ui.icon('trash', { label: 'Delete' });

  assert.match(labelled, /role="img"/);
  assert.match(labelled, /aria-label="Delete"/);
  assert.ok(!labelled.includes('aria-hidden'));
});

test('icon() takes the name as an argument or a prop', () => {
  assert.equal(ui.icon('check'), ui.icon({ name: 'check' }));
});

test('icon() resolves aliases to the drawing they name', () => {
  assert.equal(ui.icon('danger'), ui.icon('x-circle'));
  assert.equal(ui.icon('x'), ui.icon('close'));
  assert.equal(ui.icon('gears'), ui.icon('gear'));
  assert.equal(ui.icon('ai'), ui.icon('sparkles'));

  // `settings` is the sliders glyph; a cog is its own drawing.
  assert.notEqual(ui.icon('gear'), ui.icon('settings'));
});

test('icon() renders nothing for a name it does not have', () => {
  assert.equal(ui.icon('no-such-icon'), '');
  assert.equal(ui.icon(), '');
  assert.equal(ui.icon({}), '');
});

test('icon() maps size tokens to classes and lengths to a custom property', () => {
  assert.match(ui.icon('check', { size: 'sm' }), /class="su-icon su-icon--sm"/);
  assert.match(ui.icon('check', { size: 'lg' }), /class="su-icon su-icon--lg"/);

  // md is the default, so it earns no class of its own
  assert.match(ui.icon('check', { size: 'md' }), /class="su-icon"/);
  assert.match(ui.icon('check', { size: '2rem' }), /style="--su-icon-size: 2rem"/);
});

test('icon({ spin }) marks the icon for the keyframes in the sheet', () => {
  assert.match(ui.icon('spinner', { spin: true }), /su-icon--spin/);
  assert.match(ui.stylesheet({ minify: false }), /@keyframes su-icon-spin/);
});

test('icon() passes unknown props through and lets them override the defaults', () => {
  const html = ui.icon('check', { 'stroke-width': 3, 'data-testid': 'tick' });

  assert.match(html, /data-testid="tick"/);
  assert.match(html, /stroke-width="3"/);
  assert.ok(!html.includes('stroke-width="1.8"'));
});

test('icon() escapes quotes in attribute values', () => {
  assert.match(ui.icon('check', { label: 'a "quoted" name' }), /aria-label="a &#34;quoted&#34; name"/);
});

test('every glyph is well-formed and draws inside the 24x24 grid', () => {
  const names = ui.iconNames();

  assert.ok(names.length >= 60, `${names.length} icons`);

  for (const name of names) {
    const html = ui.icon(name);

    assert.match(html, /^<svg [^>]+><\/svg>$|^<svg [^>]+>.+<\/svg>$/, `${name} is one element`);
    assert.ok(html.length > 60, `${name} draws something`);

    // Balanced tags, and nothing that would need a fill to be visible.
    const inner = html.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

    assert.ok(!inner.includes('<svg'), `${name} does not nest an svg`);
    assert.equal(
      (inner.match(/<(circle|path|rect|ellipse|polyline|polygon|line)\b/g) ?? []).length,
      (inner.match(/\/>/g) ?? []).length,
      `${name} self-closes every shape`,
    );
  }
});

test('icon({ filled }) paints the glyphs whose drawing is one closed shape', () => {
  for (const name of ui.fillableIcons()) {
    assert.match(ui.icon(name, { filled: true }), /fill="currentColor"/, `${name} fills`);
    assert.match(ui.icon(name), /fill="none"/, `${name} outlines by default`);
  }
});

test('icon({ filled }) is ignored by a glyph that has no filled form', () => {
  // An open line has no inside to paint; `eye` and `tag` would lose the
  // pupil and the hole, and neither has been given a second drawing.
  for (const name of ['check', 'search', 'eye', 'tag', 'menu', 'zap']) {
    assert.ok(!ui.fillableIcons().includes(name), `${name} is not fillable`);
    assert.match(ui.icon(name, { filled: true }), /fill="none"/, `${name} stays outlined`);
  }
});

test('a glyph filled by painting its own path cannot drift from the outline', () => {
  const inner = (html) => html.replace(/^<svg[^>]*>/, '');

  // These are filled by painting the outline path itself, so the two
  // forms are the same markup by construction and cannot disagree.
  for (const name of ['bell', 'bookmark', 'folder', 'heart', 'star']) {
    assert.ok(ui.fillableIcons().includes(name), `${name} is fillable`);
    assert.equal(inner(ui.icon(name, { filled: true })), inner(ui.icon(name)), name);
  }
});

test('a chevron fills to the triangle its own three points describe', () => {
  for (const [name, triangle] of [
    ['chevron-up', 'M6 15 12 9 18 15z'],
    ['chevron-down', 'M6 9 12 15 18 9z'],
    ['chevron-left', 'M15 6 9 12 15 18z'],
    ['chevron-right', 'M9 6 15 12 9 18z'],
  ]) {
    const filled = ui.icon(name, { filled: true });

    assert.match(filled, new RegExp(triangle.replace(/ /g, ' ')), name);
    assert.match(filled, /fill="currentColor"/, name);
    // It keeps the stroke — that is what rounds the corners.
    assert.ok(!filled.includes('stroke="none"'), `${name} keeps its stroke`);
    assert.match(ui.icon(name), /fill="none"/, `${name} still outlines by default`);
  }
});

test('a glyph whose mark sits inside the shape knocks it back out', () => {
  for (const name of ['alert-triangle', 'check-circle', 'help', 'info', 'x-circle']) {
    const filled = ui.icon(name, { filled: true });

    assert.match(filled, /fill="currentColor"/, `${name} is painted`);
    // Without evenodd the mark would be painted over rather than cut out,
    // and without dropping the stroke it would be drawn back in.
    assert.match(filled, /fill-rule="evenodd"/, `${name} knocks the mark out`);
    assert.match(filled, /stroke="none"/, `${name} carries no stroke`);

    // The outline form is untouched by any of that.
    assert.match(ui.icon(name), /fill="none"/);
    assert.match(ui.icon(name), /stroke-width="1.8"/);
  }
});

test('fillableIcons() is a subset of the set, and follows aliases', () => {
  const names = ui.iconNames();

  for (const name of ui.fillableIcons()) assert.ok(names.includes(name), name);

  // `bolt` resolves to `zap`, which is not fillable
  assert.match(ui.icon('bolt', { filled: true }), /fill="none"/);
});

test('iconNames() lists each drawing once and leaves aliases out', () => {
  const names = ui.iconNames();

  assert.deepEqual(names, [...new Set(names)].sort());
  assert.ok(names.includes('x-circle'));
  assert.ok(!names.includes('danger'), 'aliases are not listed');
});

test('hasIcon() follows aliases and rejects non-strings', () => {
  assert.equal(ui.hasIcon('check'), true);
  assert.equal(ui.hasIcon('danger'), true);
  assert.equal(ui.hasIcon('nope'), false);
  assert.equal(ui.hasIcon(undefined), false);
  assert.equal(ui.hasIcon(42), false);
});

test('registerIcons() adds glyphs and can replace a built-in', () => {
  ui.registerIcons({ 'test-logo': '<path d="M4 20 12 4l8 16z"/>' });

  assert.ok(ui.hasIcon('test-logo'));
  assert.match(ui.icon('test-logo'), /<path d="M4 20 12 4l8 16z"\/>/);
  assert.ok(ui.iconNames().includes('test-logo'));

  // Non-string values are ignored rather than rendering "undefined".
  ui.registerIcons({ bad: 42 });
  assert.equal(ui.hasIcon('bad'), false);

  ui.registerIcons({ 'test-logo': null });
  assert.equal(ui.hasIcon('test-logo'), false);
});

test('registerIcons() can give a custom glyph a drawing of its own to fill with', () => {
  ui.registerIcons({
    'test-solid': { markup: '<path d="M4 4h16v16H4z"/>', filled: '<path d="M2 2h20v20H2zM8 8h8v8H8z"/>' },
  });

  assert.ok(ui.fillableIcons().includes('test-solid'));
  assert.match(ui.icon('test-solid', { filled: true }), /fill-rule="evenodd"/);
  assert.match(ui.icon('test-solid', { filled: true }), /M2 2h20v20H2z/);
  // and the outline form still uses its own markup
  assert.match(ui.icon('test-solid'), /M4 4h16v16H4z/);

  ui.registerIcons({ 'test-solid': null });
  assert.equal(ui.hasIcon('test-solid'), false);
});

test('registerIcons() can declare a custom glyph fillable', () => {
  ui.registerIcons({ 'test-blob': { markup: '<path d="M4 20 12 4l8 16z"/>', fillable: true } });

  assert.ok(ui.fillableIcons().includes('test-blob'));
  assert.match(ui.icon('test-blob', { filled: true }), /fill="currentColor"/);

  // The bare string form stays unfillable, so nothing changes for existing callers.
  ui.registerIcons({ 'test-blob': '<path d="M4 20 12 4l8 16z"/>' });
  assert.ok(!ui.fillableIcons().includes('test-blob'));
  assert.match(ui.icon('test-blob', { filled: true }), /fill="none"/);

  ui.registerIcons({ 'test-blob': null });
  assert.equal(ui.hasIcon('test-blob'), false);
});

test('registerIcons() overrides a built-in, and null puts it back', () => {
  const original = ui.icon('check');

  ui.registerIcons({ check: '<path d="M0 0"/>' });
  assert.notEqual(ui.icon('check'), original);

  ui.registerIcons({ check: null });
  assert.equal(ui.icon('check'), original);
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
